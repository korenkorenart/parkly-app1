import React from 'react'

export default function PrivacyPage() {
  return (
    <main className="container page-section">
      <article className="legal-page">
        <h1>מדיניות הפרטיות</h1>
        <p className="last-updated">עדכון אחרון: יוני 2026</p>

        <section>
          <h2>1. איזה מידע אנו אוספים</h2>
          <ul>
            <li><strong>אימייל וסיסמה:</strong> לצורך הרשמה והתחברות</li>
            <li><strong>מיקום חניה:</strong> לעדכון מפה ותוצאות חיפוש</li>
            <li><strong>הזמנות ומועדפים:</strong> שמורים בSUPABASE תחת user_id שלך</li>
            <li><strong>IP וnuggets טיפול:</strong> לעדכון ביצועים בלבד</li>
          </ul>
        </section>

        <section>
          <h2>2. כיצד אנו משתמשים במידע שלך</h2>
          <p>המידע שלך משמש אך ורק ל:</p>
          <ul>
            <li>ניהול חשבונך</li>
            <li>הצגת חניות וזמינות</li>
            <li>שמירת מועדפים והזמנות</li>
            <li>שיפור חוויית המשתמש</li>
          </ul>
          <p><strong>לעולם לא נמכור או נשתף מידע עם צד שלישי.</strong></p>
        </section>

        <section>
          <h2>3. אבטחת מידע</h2>
          <p>אנו משתמשים ב:</p>
          <ul>
            <li>HTTPS הצפנה לכל התקשורת</li>
            <li>Supabase Auth עם JWT tokens</li>
            <li>Row-Level Security (RLS) במסד הנתונים</li>
            <li>סיסמאות מעוטות (hashed) ולא שמורות</li>
          </ul>
        </section>

        <section>
          <h2>4. זכויות שלך</h2>
          <p>אתה יכול:</p>
          <ul>
            <li>לבקש גישה למידע שלך</li>
            <li>לבקש מחיקת חשבון וכל הנתונים קשורים</li>
            <li>להתנתק בכל עת</li>
            <li>לייצא את מועדפים והזמנות שלך</li>
          </ul>
        </section>

        <section>
          <h2>5. עוגיות וtracking</h2>
          <p>אנו משתמשים אך ורק ב<strong>session cookies</strong> להתחברות. לא משתמשים בtracking צד שלישי.</p>
        </section>

        <section>
          <h2>6. שינויים למדיניות זו</h2>
          <p>אנו שומרים לעצמנו את הזכות לעדכן מדיניות זו. שינויים משמעותיים יודיעו לך דרך email.</p>
        </section>

        <section>
          <h2>7. צור קשר</h2>
          <p>שאלות לגבי הפרטיות? צור קשר דרך האפליקציה או שלח email.</p>
        </section>
      </article>
    </main>
  )
}
