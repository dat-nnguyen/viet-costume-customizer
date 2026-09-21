import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { db, SavedLookbookRecord } from './db.js';
import { streamChatToResponse, generateStylistRecommendationServer, generateBananaImageServer, getApiKey } from './geminiService.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Khởi tạo Database khi ứng dụng khởi động
db.init().catch(err => {
  console.error('❌ Failed to initialize database:', err);
});

// -------------------------------------------------------------
// 1. Health Check
// -------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db.getEngineName(),
    geminiConfigured: !!getApiKey()
  });
});

// -------------------------------------------------------------
// 2. Chatbot Streaming & Persistence (/api/chat)
// -------------------------------------------------------------
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, sessionId = 'default_session' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Danh sách tin nhắn không hợp lệ' });
    return;
  }

  // Lưu tin nhắn người dùng vào DB
  const lastUserMsg = messages[messages.length - 1];
  if (lastUserMsg && lastUserMsg.sender === 'user') {
    db.saveChatMessage({
      id: 'msg_u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      sessionId,
      sender: 'user',
      text: lastUserMsg.text,
      createdAt: Date.now()
    }).catch(e => console.warn('Lỗi lưu tin nhắn user vào DB:', e));
  }

  // Cấu hình Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    await streamChatToResponse(
      messages,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      },
      (fullText) => {
        // Lưu câu trả lời của AI vào DB
        db.saveChatMessage({
          id: 'msg_a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          sessionId,
          sender: 'assistant',
          text: fullText,
          createdAt: Date.now()
        }).catch(e => console.warn('Lỗi lưu tin nhắn assistant vào DB:', e));

        res.write('data: [DONE]\n\n');
        res.end();
      },
      (err) => {
        console.error('Lỗi streaming Gemini:', err);
        res.write(`data: ${JSON.stringify({ error: err.message || 'Lỗi xử lý AI' })}\n\n`);
        res.end();
      }
    );
  } catch (error: any) {
    console.error('Lỗi khởi tạo stream:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Lỗi máy chủ' })}\n\n`);
    res.end();
  }
});

// Lấy lịch sử chat theo session
app.get('/api/chat/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId);
    const history = await db.getChatMessages(sessionId);
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// 3. AI Stylist Endpoint (/api/stylist)
// -------------------------------------------------------------
app.post('/api/stylist', async (req: Request, res: Response) => {
  try {
    const recommendation = await generateStylistRecommendationServer(req.body);
    res.json(recommendation);
  } catch (error: any) {
    console.warn('Lỗi gọi AI Stylist server:', error.message);
    res.status(500).json({ error: error.message || 'Không thể tạo bản phối' });
  }
});

// -------------------------------------------------------------
// 3.5. AI Image Generation via Banana Models (/api/render)
// -------------------------------------------------------------
app.post('/api/render', async (req: Request, res: Response) => {
  try {
    const result = await generateBananaImageServer(req.body);
    if (!result.success && result.quotaExceeded) {
      res.status(429).json(result);
      return;
    }
    if (!result.success) {
      res.status(500).json(result);
      return;
    }
    res.json(result);
  } catch (error: any) {
    console.warn('Lỗi gọi AI Render server:', error.message);
    res.status(500).json({ error: error.message || 'Không thể tạo ảnh bằng Banana model' });
  }
});

// -------------------------------------------------------------
// 4. Lookbooks CRUD (/api/lookbooks)
// -------------------------------------------------------------
app.get('/api/lookbooks', async (_req: Request, res: Response) => {
  try {
    const lookbooks = await db.getLookbooks();
    res.json(lookbooks);
  } catch (error: any) {
    console.error('Lỗi đọc lookbooks:', error);
    res.status(500).json({ error: 'Không thể đọc danh sách Lookbook' });
  }
});

app.post('/api/lookbooks', async (req: Request, res: Response) => {
  try {
    const item: SavedLookbookRecord = req.body;
    if (!item || !item.id || !item.outfit) {
      res.status(400).json({ error: 'Dữ liệu Lookbook không hợp lệ' });
      return;
    }
    const saved = await db.saveLookbook(item);
    res.json(saved);
  } catch (error: any) {
    console.error('Lỗi lưu lookbook:', error);
    res.status(500).json({ error: 'Không thể lưu Lookbook' });
  }
});

app.delete('/api/lookbooks/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const success = await db.deleteLookbook(id);
    res.json({ success });
  } catch (error: any) {
    console.error('Lỗi xóa lookbook:', error);
    res.status(500).json({ error: 'Không thể xóa Lookbook' });
  }
});

// -------------------------------------------------------------
// 5. Static File Serving (Production Mode)
// -------------------------------------------------------------
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log(`📦 Serving static files from ${distPath}`);
  app.use(express.static(distPath));

  app.use((req: Request, res: Response, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}

export default app;
