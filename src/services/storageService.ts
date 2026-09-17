import { SavedLookbook, OutfitState, CulturalScore } from '../types';

const STORAGE_KEY = 'viet_costume_customizer_lookbooks_v1';

export function getSavedLookbooks(): SavedLookbook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi khi đọc danh sách Lookbook:', err);
    return [];
  }
}

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
  return newLookbook;
}

export function deleteLookbook(id: string): SavedLookbook[] {
  const lookbooks = getSavedLookbooks();
  const updated = lookbooks.filter(lb => lb.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
