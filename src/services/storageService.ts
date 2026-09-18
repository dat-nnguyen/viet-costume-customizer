import { SavedLookbook, OutfitState, CulturalScore } from '../types';

const STORAGE_KEY = 'viet_costume_customizer_lookbooks_v1';

// Đọc Lookbook từ cache LocalStorage (trả về tức thì cho UI mượt mà)
export function getSavedLookbooks(): SavedLookbook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi khi đọc danh sách Lookbook từ localStorage:', err);
    return [];
  }
}

// Đồng bộ danh sách Lookbook từ Database (SQLite / Azure PostgreSQL)
export async function fetchLookbooksFromDB(): Promise<SavedLookbook[]> {
  try {
    const res = await fetch('/api/lookbooks');
    if (res.ok) {
      const data: SavedLookbook[] = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Không thể đồng bộ Lookbook từ backend Database, sử dụng cache local:', err);
  }
  return getSavedLookbooks();
}

// Lưu Lookbook: Lưu ngay vào LocalStorage + Gửi API lưu vào Database
export function saveLookbook(title: string, outfit: OutfitState, score: CulturalScore, aiNote?: string): SavedLookbook {
  const lookbooks = getSavedLookbooks();
  const newLookbook: SavedLookbook = {
    id: 'lb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: title.trim() || 'Bản Phối Việt Phục Remix',
    createdAt: new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    outfit,
    score,
    aiNote
  };

  const updated = [newLookbook, ...lookbooks];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Bất đồng bộ đẩy lên server database
  fetch('/api/lookbooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLookbook)
  }).catch(err => {
    console.warn('Lỗi khi lưu Lookbook vào Database server:', err);
  });

  return newLookbook;
}

// Xóa Lookbook: Xóa ngay ở LocalStorage + Gửi API xóa trên Database
export function deleteLookbook(id: string): SavedLookbook[] {
  const lookbooks = getSavedLookbooks();
  const updated = lookbooks.filter(lb => lb.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Bất đồng bộ xóa trên server database
  fetch(`/api/lookbooks/${id}`, {
    method: 'DELETE'
  }).catch(err => {
    console.warn('Lỗi khi xóa Lookbook khỏi Database server:', err);
  });

  return updated;
}
