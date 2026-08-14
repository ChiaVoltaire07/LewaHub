import { useState, type FormEvent } from 'react';

type RatingKey = 'overall' | 'academic' | 'social' | 'staff';
type Review = Record<RatingKey, number> & { school: string; level: string; year: string; text: string };

const initialReview: Review = { school: '', level: 'Secondary', year: '2025 / 2026', overall: 0, academic: 0, social: 0, staff: 0, text: '' };

function Rating({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="rating-row"><span>{label}</span><div className="star-picker" aria-label={`${label}: ${value} out of 5`}>{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} className={star <= value ? 'active' : ''} onClick={() => onChange(star)} aria-label={`${star} stars`}>★</button>)}</div></div>;
}

export default function App() {
  const [review, setReview] = useState<Review>(initialReview);
  const [submitted, setSubmitted] = useState(false);
  const setField = <K extends keyof Review>(key: K, value: Review[K]) => setReview((previous) => ({ ...previous, [key]: value }));
  const setRating = (key: RatingKey, value: number) => setField(key, value);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (review.overall && review.academic && review.social && review.staff && review.school.trim() && review.text.trim()) setSubmitted(true);
  }

  function startAgain() { setReview(initialReview); setSubmitted(false); }

  return <main className="site-shell">
    <header className="topbar"><a className="brand" href="/" aria-label="LewaHub home"><span className="brand-mark">L</span> lewa<span>hub</span></a><div className="review-nav">Write a review <span>·</span> <strong>Anonymous by design</strong></div><div className="privacy-chip"><span>◈</span> No accounts. No names.</div></header>
    <section className="review-layout">
      <div className="review-intro"><p className="eyebrow">The student voice matters</p><h1>What was it<br /><em>really like?</em></h1><p>Share the parts that matter: the teaching, the culture, and your everyday experience at school.</p><div className="privacy-panel"><strong>◈ You stay anonymous</strong><span>We never ask for your name, email, student number, phone number, or social handle. Your review is about the school, not about you.</span></div><div className="review-note"><span>“</span><p>Honest experiences help students make clearer decisions.</p></div></div>
      <form className="review-form" onSubmit={submit}>
        <div className="form-top"><span>01</span><strong>Write your review</strong><span className="form-top-note">No personal information required</span></div>
        {submitted ? <div className="success"><span>✦</span><p className="eyebrow">Thank you for speaking up</p><h2>Your review is in the mix.</h2><p>It will help another student see the full picture. We only publish experiences, never personal information.</p><button type="button" className="dark-button" onClick={startAgain}>Write another review <span>→</span></button></div> : <>
          <div className="form-section"><p className="eyebrow">01 · About the school</p><h2>Set the scene</h2><label className="field-label">School name<input required value={review.school} onChange={(event) => setField('school', event.target.value)} placeholder="Which school are you reviewing?" /></label><div className="form-row"><label>School level<select value={review.level} onChange={(event) => setField('level', event.target.value)}><option>Primary / Nursery</option><option>Secondary</option><option>University</option></select></label><label>School year<select value={review.year} onChange={(event) => setField('year', event.target.value)}><option>2025 / 2026</option><option>2024 / 2025</option><option>2023 / 2024</option><option>Earlier</option></select></label></div></div>
          <div className="form-section"><p className="eyebrow">02 · Rate the experience</p><h2>The important stuff</h2><Rating label="Overall experience" value={review.overall} onChange={(value) => setRating('overall', value)} /><Rating label="Academic quality" value={review.academic} onChange={(value) => setRating('academic', value)} /><Rating label="Staff & teaching" value={review.staff} onChange={(value) => setRating('staff', value)} /><Rating label="Social life & community" value={review.social} onChange={(value) => setRating('social', value)} /></div>
          <div className="form-section"><p className="eyebrow">03 · Put it into words</p><h2>Your honest take</h2><textarea required maxLength={600} value={review.text} onChange={(event) => setField('text', event.target.value)} placeholder="What should another student know? Talk about classes, support, friendships, pressure, opportunities, or everyday life..." /><div className="character-count">{review.text.length} / 600</div></div>
          <div className="submit-row"><span>By submitting, you confirm this is your honest experience and contains no personal information.</span><button className="dark-button" type="submit">Submit anonymously <span>↗</span></button></div>
        </>}
      </form>
    </section>
    <footer><span>© 2026 LewaHub</span><span>Honest school experiences, without the personal data <b>↗</b></span></footer>
  </main>;
}
