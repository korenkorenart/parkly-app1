# Parkly - חנייה בקלות

פלטפורמת ממצא חניות עם התחברות Supabase וניהול מועדפים. אפליקציה React+Vite עם תמיכה RTL עברית מלאה.

## מה אפשר לעשות
✨ חיפוש חניות עם סינון לפי מחיר וזמינות
❤️ שמירת מועדפים בחניות
📍 מפה אינטראקטיבית עם OpenStreetMap
📅 הזמנות חניות עם היסטוריה
👤 פרופיל משתמש עם נתונים מסונכרנים

## התקנה מהירה

```bash
# 1. התקן תלויות
npm install

# 2. העתק את קובץ הסביבה
cp .env.example .env.local
# ערוך את VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY

# 3. הרץ בפיתוח
npm run dev

# 4. בנה ל-production
npm run build
```

האפליקציה תרוץ על `http://localhost:5173`

## הגדרת Supabase

### 1. צור פרויקט ב-[supabase.com](https://supabase.com)

### 2. העתק את הקוד בـ SQL Editor

```sql
-- Parking Spots
CREATE TABLE parking_spots (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  description TEXT,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Favorites (user_id מ-Supabase Auth)
CREATE TABLE favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  parking_spot_id TEXT NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, parking_spot_id)
);

-- Bookings
CREATE TABLE bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  parking_spot_id TEXT NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. הוסף נתונים לדוגמה

```sql
INSERT INTO parking_spots (id, title, location, price, available, lat, lng) VALUES
('lot-1', '🅿️ חניון רחוב מנחם בגין', 'תל אביב מרכז', 30, TRUE, 32.0852, 34.7818),
('lot-2', '🅿️ חניון קניון רמת השרון', 'רמת השרון', 20, TRUE, 32.1559, 34.8346),
('lot-3', '🅿️ חניון חיפה בנמל', 'חיפה', 25, FALSE, 32.8173, 35.0005);
```

### 4. הגדר .env.local

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
```

(מוצא בהגדרות Supabase > API)

## תכונות עיקריות

### 📖 דפים
- **בית** - התחברות ורשמה
- **דשבורד** - רשימת חניות עם סינון
- **מפה** - OpenStreetMap אינטראקטיבית
- **מועדפים** - חניות שנשמרו
- **פרופיל** - היסטוריית הזמנות
- **מדיניות פרטיות** - שימוש נתונים
- **תנאי שימוש** - חובות משפטיות

### 🔐 אבטחה
- Supabase Auth (JWT tokens)
- סיסמאות מעוטות (bcrypt)
- HTTPS הצפנה
- Row-Level Security (RLS) במסד

### 📱 עיצוב
- RTL מלא עברית
- Responsive (desktop + mobile)
- WCAG A11y אחריות נגישות
- Dark/Light חומר עיצוב

## ארכיטקטורה

```
src/
├── App.jsx              # ניהול מצב ראשי, routes
├── components/          # Navbar, Footer, ProtectedRoute
├── pages/               # 8 דפים מלאים
│   ├── HomePage
│   ├── LoginPage
│   ├── RegisterPage
│   ├── DashboardPage
│   ├── MapPage
│   ├── ParkingDetailsPage
│   ├── FavoritesPage
│   ├── ProfilePage
│   ├── PrivacyPage
│   └── TermsPage
├── lib/
│   └── supabaseClient.js # תקשור Supabase
├── data/
│   └── parkingData.js   # backup דמו
└── index.css            # סגנונות RTL
```

## פיתוח

```bash
npm run dev         # dev server עם hot reload
npm run build       # בנייה production (dist/)
npm run preview     # תצוגה של build
```

## סביבות

**.env.local** - מצפין בתוכנית, לעולם אל תשלח לGit
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

**.env.example** - טמפלט, בטוח להעלות
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## עדכון Git

```bash
git status                  # בדוק מצב
git add .                   # הוסף קבצים
git commit -m "wip: feature" # commit
git push origin main        # push
```

**חשוב:** `.env.local` כבר בـ `.gitignore` - לא יהיה מקרה אומץ בgit!

## Deployment

### Vercel (מומלץ)
```bash
# 1. יצא לvercel.com וכנס עם GitHub
# 2. בחר את הrepo
# 3. הוסף Environment Variables:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
# 4. Vercel יבנה וידיפלוי באופן אוטומטי
```

### Netlify
```bash
# 1. npm run build
# 2. העלה את תיקית dist/
```

### Docker (עבור VPS)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## לשימור בקובץ Git

```bash
git push origin main
```

קובץ `.env.local` מוגן אוטומטית מקידוד לGit!

## תמיכה וקשר

צור issue בgithub או שלח email.

---

**מצב:** Production-Ready ✅
**עדכון אחרון:** יוני 2026
**ליצנס:** MIT
