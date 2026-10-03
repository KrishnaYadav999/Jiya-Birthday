"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { RotateCcw, Sparkles } from "lucide-react";

const cards = [
  { image: "love", title: "How much? This much.", alt: "A cute cat beside a pink and purple love pie chart" },
  { image: "flowers", title: "Flowers for my pretty girl", alt: "A blushing cat holding pink flowers" },
  { image: "bouquet", title: "A bouquet for my cutie pie", alt: "A smiling character holding a big bouquet of red roses" },
  { image: "heart", title: "You have my whole heart", alt: "A shy character hugging a heart-shaped arrow" },
  { image: "cat", title: "One little flower, just for you", alt: "A happy little cat offering a pink flower" },
];

const questions = [
  { text: "Kya Krishna aapko pareshan karta hai?", image: "cat", options: [
    { label: "Yes", message: "Huhhh… itna bhi pareshan karta hoon kya? 🥺", image: "crying-cat" },
    { label: "No", message: "Hehe, mujhe pata tha! Tum toh meri favourite ho. ♡", image: "happy-cat" },
  ] },
  { text: "Fish pasand hai ki Krishna?", image: "love", options: [
    { label: "K · Krishna", message: "Krishna wins! Ab toh dil garden garden ho gaya. ♡", image: "happy-cat" },
    { label: "F · Fish", message: "Fish se haar gaya… chalo, second favourite toh hoon na? 🥺", image: "crying-cat" },
  ] },
  { text: "Kya mujhe maarne ka mann karta hai?", image: "heart", options: [
    { label: "Yes", message: "Arre meri jaan, bas pyaar wali daant chalegi! 🙈", image: "crying-cat" },
    { label: "No", message: "Good! Toh ek virtual hug pakka. ♡", image: "happy-cat" },
  ] },
  { text: "Aaj Boyfriend Day hai… wish jaan-bujhkar nahi kiya ya sach mein bhool gayi? Huhhhh!", image: "crying-cat", options: [
    { label: "Jaan-bujhkar nahi bola 🙈", message: "Achhaaa, mujhe tease kar rahi thi! Ab ek cute si wish toh banti hai. ♡", image: "shy-cat" },
    { label: "Sach mein bhool gayi 🥺", message: "Koi baat nahi, meri jaan. Tumhari late wish bhi mere liye special hai. ♡", image: "crying-cat" },
  ] },
  { text: "“Mai choodi huna” aisa baar-baar kaun bolta hai?", image: "shy-cat", options: [
    { label: "Tu", message: "Achhaaa, main? Yeh shy face sab bata raha hai. 🙈", image: "shy-cat" },
    { label: "Mai", message: "Hehe, confession mil gaya! Meri cutie. ♡", image: "shy-cat" },
  ] },
  { text: "Aaj aapka Accounts ka paper hai! Best of luck, meri…? ♡", image: "accounts-maths", options: [
    { label: "Best of luck, Rasmalai! ♡", message: "Meri Rasmalai, calmly paper likhna. Tumne jo padha hai, us par trust karo. You’ve got this! ♡", image: "accounts-maths" },
    { label: "Best of luck, Kaju Katli! ✨", message: "Meri Kaju Katli, ek-ek question aaram se karna. Krishna tumhare liye cheer kar raha hai! ♡", image: "accounts-study" },
  ] },
  { text: "Jiya · जिया · ジヤ… will you be mine? ♡", image: "bouquet", options: [
    { label: "Yes ♡", message: "My favourite yes, from my favourite person. ♡", image: "happy-cat" },
    { label: "Yes, always! ✨", message: "Always sounds beautiful with you. ♡", image: "shy-cat" },
  ] },
];

const videos = [
  { file: "for-jiya", title: "A little love, on repeat", label: "The first special video for Jiya" },
  { file: "another-little-love", title: "One more reason to smile", label: "Another special video for Jiya" },
];

function LoveVideo({ video, onAudiblePlay }: { video: typeof videos[number]; onAudiblePlay: () => void }) {
  const [failed, setFailed] = useState(false);
  function handleAudio(element: HTMLVideoElement) {
    if (element.muted || element.paused) return;
    onAudiblePlay();
    element.closest(".video-grid")?.querySelectorAll("video").forEach(other => {
      if (other !== element && !other.muted) other.muted = true;
    });
  }
  return <figure className="video-card reveal"><div className="video-frame">
    <video src={`/surprises/${video.file}.mp4`} controls autoPlay muted loop playsInline preload="auto" aria-label={video.label}
      onPlay={event => handleAudio(event.currentTarget)} onVolumeChange={event => handleAudio(event.currentTarget)} onError={() => setFailed(true)}>
      Your browser does not support this video.
    </video>
  </div><figcaption>{video.title} <span>♡</span></figcaption>
    <p className="video-help">{failed ? <span role="alert">Video yahan play nahi ho paaya. </span> : ""}<a href={`/surprises/${video.file}.mp4`} download>Keep this little video</a></p>
  </figure>;
}

function burst(count: number) {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    confetti({ particleCount: count, spread: 85, origin: { y: .7 }, colors: ["#923d58", "#efacc4", "#d5ab6c"] });
  }
}

export default function Surprises({ onVideoPlay }: { onVideoPlay: () => void }) {
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selection, setSelection] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  const finished = step === questions.length;
  const current = questions[step];
  const chosen = current?.options.find(option => option.label === selection);
  const gameImage = chosen?.image ?? current?.image ?? "bouquet";

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
      <div className="intro reveal"><p className="eyebrow">JUST A LITTLE BIRTHDAY FLIRTING</p><h2>Bas tum, main…<br/><em>aur thodi si masti.</em></h2><p>जिया · ジヤ, in sawaalon ke jawaab toh do. ♡</p></div>
      <div className="question-shell reveal">
        <div className="question-progress"><span>{finished ? "A little masti, a lot of love" : `Question ${step + 1} of ${questions.length}`}</span><span>{finished ? questions.length : step} / {questions.length} answered</span></div>
        <progress aria-label="Birthday questions completed" value={finished ? questions.length : step} max={questions.length}/>
        <div className="question-panel" ref={panel}>
          {finished ? <><Sparkles className="finish-sparkle" size={36}/><h3 ref={heading} tabIndex={-1}>My favourite person.<br/>My favourite yes.</h3><p>Happy Birthday, Jiya · जिया · ジヤ. Thodi nok-jhok, bahut saara pyaar — aur end mein mera favourite yes. ♡</p><img className="game-image" src="/surprises/bouquet.jpg" alt="A special bouquet for the birthday girl" width={736} height={721}/><p className="script">All the flowers. All the love. All for you.</p><div className="game-actions"><a className="primary" href="#your-video">Your next little surprise</a><button className="restart" onClick={() => { interacted.current = true; setStep(0); setAnswered(false); setSelection(""); }}><RotateCcw size={16}/>Play again</button></div></>
          : <><img className="game-image" key={gameImage} src={`/surprises/${gameImage}.jpg`} alt={gameImage === "crying-cat" ? "A little crying cat reaction" : gameImage === "happy-cat" ? "A happy cat surrounded by hearts" : gameImage === "shy-cat" ? "A shy kitten peeking around a door with hearts" : gameImage === "accounts-maths" ? "A confused cat surrounded by mathematical formulas" : gameImage === "accounts-study" ? "A little cat studying with a helping hand" : "A little picture full of love"} width={736} height={736}/><h3 ref={heading} tabIndex={-1}>{current.text}</h3><div className="answer-options">{current.options.map((option,i) => <button key={option.label} className={i === 0 ? "primary" : "yes-extra"} onClick={() => answer(option.label)} disabled={answered}>{option.label}</button>)}</div><div className="answer-response" aria-live="polite">{answered ? <><p className="chosen">{selection}</p><p>{chosen?.message}</p><button className="next-question" ref={next} onClick={advance}>{step === questions.length - 1 ? "Open my birthday surprise" : "Next little question"}</button></> : <p className="game-hint">Apna answer choose karo. ♡</p>}</div></>}
        </div>
      </div>
    </section>
    <section className="video-section section-pad" id="your-video"><div className="intro reveal"><p className="eyebrow">TWO LITTLE MOMENTS, JUST FOR YOU</p><h2>A little love.<br/><em>On repeat.</em></h2><p>Sound chahiye? Video ke speaker par tap karo. ♡</p></div><div className="video-grid">{videos.map(video => <LoveVideo key={video.file} video={video} onAudiblePlay={onVideoPlay}/>)}</div></section>
  </>;
}

