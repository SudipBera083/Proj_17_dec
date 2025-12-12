
  
    /* -------- Typewriter intro -------- */
    const typeText = "I wanted our chat to feel special today 🤍. So… Happy Birthday! Srijita, Here’s a cozy corner where I’ll send you surprises, notes, and a lot of love.";
    const twEl = document.getElementById('typewriter');
    let i = 0;
    (function type() {
      if (i <= typeText.length) {
        twEl.textContent = typeText.slice(0, i++);
        setTimeout(type, 24);
      }
    })();

    /* -------- Hearts background -------- */
    const heartsEl = document.getElementById('hearts');
    function spawnHeart(){
      const h = document.createElement('div');
      h.className = 'heart';
      const size = 12 + Math.random()*16;
      h.style.width = h.style.height = size+'px';
      h.style.left = Math.random()*100+'vw';
      h.style.bottom = '-10vh';
      h.style.opacity = 0.15 + Math.random()*0.25;
      h.style.animationDuration = (8 + Math.random()*10) + 's';
      heartsEl.appendChild(h);
      setTimeout(()=>h.remove(), 18000);
    }
    setInterval(spawnHeart, 600);

    /* -------- Confetti -------- */
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    function resizeCanvas(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function makeConfetti(){
      confettiPieces = [];
      const colors = ['#ff5fa2','#ffd166','#7bd88f','#9aa0ff','#ff9ec7','#ff8ec2','#f7f7ff'];
      const count = Math.min(220, Math.floor(canvas.width/5));
      for(let i=0;i<count;i++){
        confettiPieces.push({
          x: Math.random()*canvas.width,
          y: -20 - Math.random()*canvas.height*0.4,
          w: 6 + Math.random()*10,
          h: 3 + Math.random()*6,
          color: colors[Math.floor(Math.random()*colors.length)],
          vy: 2 + Math.random()*4,
          vx: -2 + Math.random()*4,
          rot: Math.random()*Math.PI,
          vr: (-0.1 + Math.random()*0.2),
        });
      }
    }
    function drawConfetti(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      confettiPieces.forEach(p=>{
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vr;
      });
      confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 30);
      if(confettiPieces.length) requestAnimationFrame(drawConfetti);
    }
    function celebrate(){
      makeConfetti();
      drawConfetti();
    }
    document.getElementById('confettiBtn').addEventListener('click', celebrate);

    

    /* -------- Chat logic (frontend demo) -------- */
    const chatPanel = document.getElementById('chatPanel');
    const startBtn = document.getElementById('startChat');
    const chatBody = document.getElementById('chatBody');
    const chatText = document.getElementById('chatText');
    const sendBtn = document.getElementById('sendBtn');
    const chatForm = document.getElementById('chatForm');

    function addMsg(text, from='me'){
      const m = document.createElement('div');
      m.className = 'msg ' + from;
      m.innerHTML = text + `<div class="timestamp">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>`;
      chatBody.appendChild(m);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    startBtn.addEventListener('click', ()=>{
      chatPanel.setAttribute('aria-hidden', 'false');
      chatText.disabled = false;
      sendBtn.disabled = false;
      celebrate();
      addMsg("Happy Birthday, my love! 🎂💖 I’m so grateful for you—today and always. Ready for a stream of surprises? ✨", 'me');
      setTimeout(()=> addMsg("Aww, yes! I’m ready 😍", 'her'), 1400);
    });

    chatForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const t = chatText.value.trim();
      if(!t) return;
      addMsg(t, 'me');
      chatText.value = '';
      // Cute auto-reply (you can replace with real backend)
      
const replies = [
  "Anything for you, birthday girl! 🎂💖",
  "Because you deserve all the happiness today and always ✨",
  "Haha, you’re too adorable 😍",
  "Only the best for my favorite person 💕",
  "That’s exactly why I planned this surprise 🎈",
  "You make everything worth it ❤️",
  "Because you’re my world 🌍💘",
  "I just want to see you smile 😊",
  "You’re the reason behind all my efforts 💫",
  "Haha, guilty as charged 😅",
  "Because today is YOUR day, queen 👑",
  "I love spoiling you, can’t help it 💝",
  "You’re my happy place 🌸",
  "Because you’re one in a million 💎",
  "Haha, you caught me! 😜",
  "I’d do this every day if I could 💌",
  "Because you deserve magic ✨",
  "You’re the best thing that ever happened to me 💞",
  "Haha, you’re making me blush now 😳",
  "Because I love you more than words can say 💖",
  "You’re my sunshine on every cloudy day ☀️",
  "Haha, you’re too smart for me 😅",
  "Because you’re my forever person 💍",
  "I just want to make this day unforgettable 🎉",
  "Because you’re my favorite human 💕",
  "Haha, you’re so cute when you ask that 😍",
  "Because you deserve all the love in the universe 🌌",
  "You’re the reason I smile every day 😊",
  "Haha, you know me too well 😎",
  "Because loving you is the easiest thing ever 💘"
];
      setTimeout(()=> addMsg(replies[Math.floor(Math.random()*replies.length)], 'her'), 800);
    });
 





    /* -------- Memories button (example) -------- */
    const memoriesBtn = document.getElementById('memoriesBtn');   
    memoriesBtn.addEventListener('click', ()=>{
      window.location.href = 'memories.html';
            // alert('Here are some of our favorite memories together! 📸\n\n(You can customize this section with actual photos and messages.)');
    });


    /* -------- Music -------- */
    const bgm = document.getElementById('bgm');
    const musicBtn = document.getElementById('musicBtn');
    let musicOn = false;
    musicBtn.addEventListener('click', async ()=>{
      try {
        if(!musicOn){
          await bgm.play();
          musicBtn.textContent = 'Pause Music ❚❚';
          musicOn = true;
        } else {
          bgm.pause();
          musicBtn.textContent = 'Play Music ♫';
          musicOn = false;
        }
      } catch(e){
        alert('Add a file named "birthday.mp3" next to this HTML to enable music 🎵');
      }
    });