import app from './app.js';
import { db } from './db.js';
import { getApiKey } from './geminiService.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Viet Costume Server running on http://localhost:${PORT}`);
  console.log(`📁 Database Engine: ${db.getEngineName()}`);
  console.log(`🔑 Gemini Server Key: ${getApiKey() ? 'CONFIGURED ✅' : 'MISSING ⚠️'}`);
});
