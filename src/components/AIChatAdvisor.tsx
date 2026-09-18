import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatActionPayload } from '../types';
import { streamGeminiChatResponse } from '../services/geminiChatService';
import { TRADITIONAL_COSTUMES } from '../data/traditionalCostumes';
import { HERITAGE_COLORS } from '../data/heritagePalettes';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Loader2,
  Minimize2
} from 'lucide-react';

interface AIChatAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOutfit: (payload: ChatActionPayload) => void;
}

const QUICK_SUGGESTIONS = [
  '🎓 Phối cổ phục chụp ảnh kỷ yếu phong cách Gen Z năng động',
  '🌸 Tết này nên mặc Áo Tấc hay Áo Ngũ Thân?',
  '🏛️ Ý nghĩa văn hóa của 5 khuy cài Ngũ Thường là gì?',
  '👟 Cách phối giày sneaker trắng với Áo Nhật Bình',
  '💍 Đi dự tiệc cưới nên chọn màu sắc gì theo Ngũ Hành?'
];

export const AIChatAdvisor: React.FC<AIChatAdvisorProps> = ({
  isOpen,
  onClose,
  onApplyOutfit
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Chào bạn! Mình là Cố Vấn Di Sản Cổ Phục & Gen Z Remix. Mình có thể hỗ trợ bạn khám phá lịch sử các triều đại, ý nghĩa quy tắc Hữu Nhậm - Ngũ Thường, phối màu sắc Ngũ Hành hoặc lên ý tưởng Remix cổ phục cùng sneakers & phụ kiện hiện đại.\n\nBạn đang chuẩn bị trang phục cho sự kiện gì thế?',
      timestamp: Date.now()
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 200);
    }
  }, [isOpen, messages]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      sender: 'assistant',
      text: '...',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, initialAssistantMessage]);
    setIsLoading(true);

    try {
      await streamGeminiChatResponse(updatedMessages, (streamedText, actionPayload) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantPlaceholderId
              ? { ...msg, text: streamedText, actionPayload }
              : msg
          )
        );
      });
    } catch (err: any) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                text: 'Dạ, hiện tại kết nối đến hệ thống AI đang bị gián đoạn. Bạn vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau một chút nhé!'
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col justify-end sm:justify-start items-center sm:items-end animate-fadeIn">
      
      {/* Backdrop trên mobile */}
      <div 
        onClick={onClose}
        className="sm:hidden fixed inset-0 bg-black/70 backdrop-blur-sm -z-10"
      />

      {/* Main Chat Box */}
      <div className="w-full sm:w-[420px] h-[85vh] sm:h-[580px] max-h-[92vh] bg-[#11121b]/95 border border-[#2b2e42] rounded-t-3xl sm:rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="bg-[#161724] border-b border-[#242738] p-3.5 sm:p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9e2a2b] via-[#c94b4b] to-[#e09f3e] flex items-center justify-center text-white shadow-md shadow-[#9e2a2b]/30 relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#161724]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">Cố Vấn Cổ Phục AI</h3>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#e09f3e]/20 text-[#ffd166] border border-[#e09f3e]/40">
                  Gen Z Remix
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span>Bảo chứng chuẩn mực văn hóa</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#202232] transition-colors cursor-pointer"
              title="Thu nhỏ cửa sổ chat"
            >
              <Minimize2 className="w-4 h-4 hidden sm:inline" />
              <X className="w-5 h-5 sm:hidden" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const costume = msg.actionPayload?.costumeId 
              ? TRADITIONAL_COSTUMES.find(c => c.id === msg.actionPayload?.costumeId)
              : null;
            const outerColor = msg.actionPayload?.outerColorId 
              ? HERITAGE_COLORS.find(c => c.id === msg.actionPayload?.outerColorId)
              : null;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#9e2a2b] to-[#e09f3e] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-[#9e2a2b] to-[#b83838] text-white rounded-tr-sm shadow-md'
                        : 'bg-[#181926] border border-[#2b2d42] text-gray-200 rounded-tl-sm shadow-sm whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actionable Card: Thử Bản Phối Trực Tiếp Trên Canvas */}
                  {!isUser && msg.actionPayload && (
                    <div className="bg-gradient-to-b from-[#1c1e2e] to-[#141520] border border-[#e09f3e]/40 rounded-xl p-3 shadow-lg space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#ffd166] uppercase tracking-wider flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#e09f3e]" />
                          <span>Gợi Ý Bản Phối Thực Tế</span>
                        </span>
                        {costume && (
                          <span className="text-[10px] text-gray-400">
                            {costume.dynasty.split(' ')[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        {costume && (
                          <img
                            src={costume.imageUrl}
                            alt={costume.name}
                            className="w-10 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
                          />
                        )}
                        <div className="min-w-0 flex-1 text-xs">
                          <div className="font-bold text-white truncate">
                            {msg.actionPayload.name || costume?.name || 'Bản Phối Đề Xuất'}
                          </div>
                          {outerColor && (
                            <div className="text-[11px] text-[#e09f3e] flex items-center gap-1 mt-0.5">
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-white/30" 
                                style={{ backgroundColor: outerColor.hex }}
                              />
                              <span>Màu {outerColor.name} ({outerColor.element})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onApplyOutfit(msg.actionPayload!);
                          onClose();
                        }}
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-[#d49b27] via-[#e09f3e] to-[#c94b4b] text-[#090a0f] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#e09f3e]/20 cursor-pointer"
                      >
                        <span>Thử Ngay Bản Phối Này Trên Canvas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[9px] text-gray-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#252838] border border-[#373a50] flex items-center justify-center text-gray-300 flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-[#e09f3e] pl-9">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI đang phân tích di sản & phối đồ...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-[#141520] border-t border-[#222434] overflow-x-auto flex gap-1.5 no-scrollbar flex-shrink-0">
          {QUICK_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isLoading}
              className="text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-[#1c1e2b] border border-[#2e3144] text-gray-300 hover:text-white hover:border-[#e09f3e]/50 hover:bg-[#252838] transition-all flex-shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#161724] border-t border-[#252838] flex items-center gap-2 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi về cổ phục, dịp mặc, cách phối đồ Gen Z..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 bg-[#0e0f17] border border-[#2c2f42] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#e09f3e] transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="min-h-[38px] min-w-[38px] rounded-xl bg-gradient-to-r from-[#9e2a2b] to-[#c94b4b] text-white flex items-center justify-center shadow-md shadow-[#9e2a2b]/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
            title="Gửi câu hỏi"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
