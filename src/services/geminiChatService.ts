import { ChatMessage, ChatActionPayload, CostumeId } from '../types';
import { getChatEndpoint, getApiHeaders } from './apiConfig';



// Phân tích action tag từ text
export function parseActionTag(text: string): { cleanText: string; actionPayload?: ChatActionPayload } {
  const actionRegex = /\[ACTION:([^\]]+)\]/i;
  const match = text.match(actionRegex);

  if (!match) {
    return { cleanText: text };
  }

  const rawParams = match[1];
  const cleanText = text.replace(actionRegex, '').trim();
  const params = new URLSearchParams(rawParams);

  const costumeId = (params.get('costumeId') || undefined) as CostumeId | undefined;
  const outerColorId = params.get('outerColor') || undefined;
  const innerColorId = params.get('innerColor') || undefined;
  const bottomColorId = params.get('bottomColor') || undefined;
  const name = params.get('name') || undefined;
  const rawAccessories = params.get('accessories');
  const accessories = rawAccessories ? rawAccessories.split(',').filter(Boolean) : undefined;

  return {
    cleanText,
    actionPayload: {
      costumeId,
      outerColorId,
      innerColorId,
      bottomColorId,
      accessories,
      name
    }
  };
}

/**
 * Gửi tin nhắn đến Cố Vấn AI thông qua Server-Side Backend (/api/chat).
 * Khóa API và System Guardrail được bảo mật 100% ở phía server, không bao giờ lộ ra trình duyệt.
 */
export async function streamGeminiChatResponse(
  messages: ChatMessage[],
  onChunk: (currentText: string, actionPayload?: ChatActionPayload) => void,
  sessionId: string = 'default_session'
): Promise<{ text: string; actionPayload?: ChatActionPayload }> {
  try {
    const endpoint = getChatEndpoint();
    const headers = getApiHeaders();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: messages.map(m => ({ sender: m.sender, text: m.text })),
        sessionId
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No readable stream from /api/chat');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedRaw = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.text) {
              accumulatedRaw += parsed.text;
              const { cleanText, actionPayload } = parseActionTag(accumulatedRaw);
              onChunk(cleanText, actionPayload);
            } else if (parsed.error) {
              console.warn('Server chat error:', parsed.error);
              accumulatedRaw = 'Dạ, ' + (parsed.error || 'hệ thống đang bận một chút.');
              const { cleanText, actionPayload } = parseActionTag(accumulatedRaw);
              onChunk(cleanText, actionPayload);
            }
          } catch {
            // chunk json dở dang
          }
        }
      }
    }

    if (!accumulatedRaw || accumulatedRaw.trim().length === 0) {
      accumulatedRaw = 'Dạ, tôi chưa nhận được phản hồi. Bạn có thể hỏi lại về trang phục hoặc dịp phối đồ sắp tới được không ạ?';
      onChunk(accumulatedRaw);
    }

    const { cleanText, actionPayload } = parseActionTag(accumulatedRaw);
    return { text: cleanText, actionPayload };
  } catch (err) {
    console.warn('Lỗi gọi /api/chat từ server backend:', err);
    const fallbackMsg = 'Dạ, hệ thống Cố Vấn đang bận kết nối một chút hoặc server chưa khởi động. Bạn vui lòng thử lại nhé!';
    onChunk(fallbackMsg);
    return { text: fallbackMsg };
  }
}

