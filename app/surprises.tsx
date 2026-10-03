"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { Heart, RotateCcw, Sparkles } from "lucide-react";

const cards = [
  { image: "love", title: "How much? This much.", alt: "A cute cat beside a pink and purple love pie chart" },
  { image: "flowers", title: "Flowers for my pretty girl", alt: "A blushing cat holding pink flowers" },
  { image: "bouquet", title: "A bouquet for my cutie pie", alt: "A smiling character holding a big bouquet of red roses" },
  { image: "heart", title: "You have my whole heart", alt: "A shy character hugging a heart-shaped arrow" },
  { image: "cat", title: "One little flower, just for you", alt: "A happy little cat offering a pink flower" },
];

const questions = [
  ["Jiya, birthday girl wali biggest smile dogi?", "Bas, isi smile ke liye toh yeh sab banaya hai. ♡"],
  ["Aaj thoda extra pamper hone ke liye ready ho?", "Birthday girl deserves the royal treatment!"],
  ["Mere diye hue flowers accept karogi?", "Cherry blossoms, lilies aur saara pyaar — tumhare liye."],
  ["Ek cherry blossom walk mere saath karogi?", "Pink flowers, tum, aur ek perfect little moment."],
  ["Lilies ke bouquet ke saath ek cute si photo logi?", "My favourite girl with her favourite flowers. Perfect."],
  ["Mere saath cake ka pehla bite share karogi?", "Sabse sweet bite, sabse sweet person ke saath."],
  ["Birthday hug ke liye apni arms open karogi?", "Sending the warmest, longest virtual hug. ♡"],
  ["Meri silly baaton par aise hi hasti rahogi?", "Tumhari laugh meri favourite sound hai."],
  ["Aaj apni favourite dessert choose karogi?", "Aaj tumhari choice, tumhari happiness, tumhara day."],
  ["Ek cute cat jaisa pyaar bhara flower logi?", "This little kitty has excellent taste — it picked you!"],
  ["Apne dreams ke liye ek bada sa wish karogi?", "Dream big, Jiya. I’ll always be cheering for you."],
  ["Mere saath aur cute memories banane ke liye ready ho?", "A thousand little moments, aur har ek mein tum."],
  ["Yaad rakhogi ki tum kitni special ho?", "Just as you are. Today, tomorrow, always."],
  ["Mere favourite person ka title rakhogi?", "Reserved for Jiya. No expiry date. ♡"],
  ["Apne happiest birthday chapter ko welcome karogi?", "Then here’s to you, your dreams, and all the happiness ahead!"],
];

function burst(count: number) {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    confetti({ particleCount: count, spread: 85, origin: { y: .7 }, colors: ["#923d58", "#efacc4", "#d5ab6c"] });
  }
}

export default function Surprises({ onVideoPlay }: { onVideoPlay: () => void }) {
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selection, setSelection] = useState("");
  const [videoError, setVideoError] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  const finished = step === questions.length;

  useEffect(() => {
    if (!interacted.current) return;
    heading.current?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(panel.current, { opacity: .2, y: 16, scale: .98 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: "power2.out" });
    });
    return () => ctx.revert();
  }, [step]);

  useEffect(() => { if (answered) next.current?.focus({ preventScroll: true }); }, [answered]);

  function answer(value: string) {
    if (answered) return;
    interacted.current = true;
    setSelection(value);
    setAnswered(true);
    burst(32);
  }

  function advance() {
    setAnswered(false);
    setSelection("");
    setStep(value => value + 1);
    if (step === questions.length - 1) burst(180);
  }

  return <>
    <section className="scrapbook section-pad" id="little-things">
      <div className="intro reveal"><p className="eyebrow">A POCKET FULL OF LOVE</p><h2>Little things.<br/><em>Big feelings.</em></h2><p>A few cute ways to say what my heart says every day.</p></div>
      <div className="scrap-grid">{cards.map((card, i) => <figure className="scrap-card reveal" key={card.image}>
        <span className="scrap-number">0{i + 1} / FOR YOU</span>
        <img src={`/surprises/${card.image}.jpg`} alt={card.alt} loading="lazy" width={736} height={736}/>
        <figcaption>{card.title} <span>♡</span></figcaption>
      </figure>)}</div>
    </section>
    <section className="yes-section section-pad" id="yes-game">
      <div className="intro reveal"><p className="eyebrow">JUST A LITTLE BIRTHDAY FLIRTING</p><h2>15 questions.<br/><em>So many little yeses.</em></h2><p>Dono options yes hain — bas thoda sa birthday fun. ♡</p></div>
      <div className="question-shell reveal">
        <div className="question-progress"><span>{finished ? "15 little yeses, one happy heart" : `Question ${step + 1} of 15`}</span><span>{finished ? 15 : step} / 15 answered</span></div>
        <progress aria-label="Birthday questions completed" value={finished ? 15 : step} max={15}/>
        <div className="question-panel" ref={panel}>
          {finished ? <><Sparkles className="finish-sparkle" size={36}/><h3 ref={heading} tabIndex={-1}>You just made my heart<br/>15 times happier.</h3><p>Happy Birthday, Jiya. Har yes ke saath ek aur reason to smile. Aaj ka din tumhari tarah beautiful ho.</p><img className="game-image" src="/surprises/bouquet.jpg" alt="A special bouquet for the birthday girl" width={736} height={721}/><p className="script">All the flowers. All the love. All for you.</p><div className="game-actions"><a className="primary" href="#your-video">Your next little surprise</a><button className="restart" onClick={() => { interacted.current = true; setStep(0); setAnswered(false); }}><RotateCcw size={16}/>Play again</button></div></>
          : <><img className="game-image" src={`/surprises/${cards[Math.floor(step / 3)].image}.jpg`} alt={cards[Math.floor(step / 3)].alt} width={736} height={736}/><h3 ref={heading} tabIndex={-1}>{questions[step][0]}</h3><div className="answer-options"><button className="primary" onClick={() => answer("Yes ♡")} disabled={answered}><Heart size={17}/>Yes ♡</button><button className="yes-extra" onClick={() => answer("Yes, bilkul! ✨")} disabled={answered}>Yes, bilkul! ✨</button></div><div className="answer-response" aria-live="polite">{answered ? <><p className="chosen">{selection}</p><p>{questions[step][1]}</p><button className="next-question" ref={next} onClick={advance}>{step === 14 ? "Open my birthday surprise" : "Next little question"}</button></> : <p className="game-hint">A little yes, a little smile, a little more love.</p>}</div></>}
        </div>
      </div>
    </section>
    <section className="video-section section-pad" id="your-video"><div className="intro reveal"><p className="eyebrow">ONE MORE THING, BIRTHDAY GIRL</p><h2>A little moment.<br/><em>Just for you.</em></h2><p>Press play. This one comes with love.</p></div><div className="video-frame reveal"><video controls playsInline preload="metadata" aria-label="A special video for Jiya" onPlay={onVideoPlay} onError={() => setVideoError(true)}><source src="/surprises/for-jiya.mp4" type="video/mp4"/>Your browser does not support this video.</video></div>{videoError ? <p role="alert" className="video-help">Video yahan play nahi ho paaya. <a href="/surprises/for-jiya.mp4" download>Video download karke dekho.</a></p> : <p className="video-help">Made for your smile. <a href="/surprises/for-jiya.mp4" download>Keep this little video</a></p>}</section>
  </>;
}
