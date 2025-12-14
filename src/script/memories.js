/* Memories Gallery Script */
/* ---------- Data (seed memories + LocalStorage) ---------- */
const seedMemories = [
    {
        id: "m1",
        src: "src/img/cubbon.jpg",
        title: "Cubbon Park giggles",
        date: "2024-03-17",
        tags: ["us", "cute"],
        caption: "You laughed so hard I forgot the world 🌿💚",
    },
    {
        id: "m2",
        src: "src/img/coffee.jpg",
        title: "Coffee that tasted like love",
        date: "2024-08-09",
        tags: ["food", "us"],
        caption: "Your ‘one more sip’ smile—unbeatable ☕💕",
    },
    {
        id: "m3",
        src: "src/img/goa.jpg",
        title: "Goa sunset promises",
        date: "2023-12-02",
        tags: ["trip", "us"],
        caption: "We held hands and time slowed by the sea 🌅",
    },
    {
        id: "m4",
        src: "src/img/gift.jpg",
        title: "The little handmade gift",
        date: "2025-01-26",
        tags: ["gift", "cute"],
        caption: "Your craft, your care, your heart—everything ✨",
    },
    {
        id: "m5",
        src: "src/img/streetfood.jpg",
        title: "Street food adventure",
        date: "2024-04-21",
        tags: ["food", "trip"],
        caption: "Spicy pani puri + your happy dance = perfect 🥳",
    },
];

const STORE_KEY = "memories.sudip.srijita.v1";
const FAV_KEY = "memories.favorites.v1";

function loadMemories() {
    const saved = localStorage.getItem(STORE_KEY);
    try { return saved ? JSON.parse(saved) : seedMemories; }
    catch { return seedMemories; }
}
function saveMemories(arr) {
    localStorage.setItem(STORE_KEY, JSON.stringify(arr));
}
function loadFavs() {
    const saved = localStorage.getItem(FAV_KEY);
    try { return saved ? JSON.parse(saved) : []; }
    catch { return []; }
}
function saveFavs(arr) {
    localStorage.setItem(FAV_KEY, JSON.stringify(arr));
}

let memories = loadMemories();
let favorites = loadFavs();

/* ---------- Render Gallery ---------- */
const grid = document.getElementById('grid');


function cardTemplate(m) {
    const favActive = favorites.includes(m.id) ? 'active' : '';
    const tagHtml = (m.tags || []).map(t => `<span class="tag">${tagLabel(t)}</span>`).join("");
    const safeTitle = escapeHtml(m.title || '');
    const safeCaption = escapeHtml(m.caption || '');

    return `
    <article class="card" data-id="${m.id}" data-tags="${(m.tags || []).join(',')}" data-title="${safeTitle}" data-caption="${safeCaption}">
      <div class="cover" data-open>
        ${m.src}
        <div class="tag-badge">${tagHtml}</div>
        <button class="fav ${favActive}" title="Favorite" data-fav>
          ${heartIcon()}
        </button>
      </div>
      <div class="content">
        <div class="title">${safeTitle}</div>
        <div class="meta">${fmtDate(m.date)}</div>
        <div class="caption">${safeCaption}</div>
      </div>
    </article>
   `;
}

function renderGallery(filterTag = 'all', q = '') {
    const list = memories.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const normQ = q.trim().toLowerCase();
    const html = list
        .filter(m => {
            const tagOk = filterTag === 'all' || (m.tags || []).includes(filterTag);
            const text = (m.title + ' ' + m.caption + ' ' + (m.date || '')).toLowerCase();
            const qOk = !normQ || text.includes(normQ);
            return tagOk && qOk;
        })
        .map(cardTemplate).join("");
    grid.innerHTML = html;
}
renderGallery();

/* ---------- Filters & Search ---------- */
const chips = document.querySelectorAll('.chip');
let currentTag = 'all';
chips.forEach(ch => {
    ch.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        currentTag = ch.dataset.tag;
        renderGallery(currentTag, searchBox.value);
    });
});
const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('input', () => renderGallery(currentTag, searchBox.value));

/* ---------- Favorites ---------- */
grid.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav]');
    const openArea = e.target.closest('[data-open]');
    const cardEl = e.target.closest('.card');
    if (favBtn && cardEl) {
        const id = cardEl.dataset.id;
        const idx = favorites.indexOf(id);
        if (idx >= 0) favorites.splice(idx, 1); else favorites.push(id);
        saveFavs(favorites);
        favBtn.classList.toggle('active');
        return;
    }
    if (openArea && cardEl) {
        const id = cardEl.dataset.id;
        const m = memories.find(x => x.id === id);
        openLightbox(m);
    }
});

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
const lbTitle = document.getElementById('lbTitle');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbFav = document.getElementById('lbFav');

let lbIndex = 0; // index in filtered array
let lbFiltered = memories;

function rebuildFiltered() {
    // match current filter + search
    const q = searchBox.value.trim().toLowerCase();
    lbFiltered = memories.filter(m => {
        const tagOk = currentTag === 'all' || (m.tags || []).includes(currentTag);
        const text = (m.title + ' ' + m.caption + ' ' + (m.date || '')).toLowerCase();
        const qOk = !q || text.includes(q);
        return tagOk && qOk;
    }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function openLightbox(m) {
    rebuildFiltered();
    lbIndex = lbFiltered.findIndex(x => x.id === m.id);
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    updateLB();
    document.addEventListener('keydown', keyLB);
}
function closeLightbox() {
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', keyLB);
}
function updateLB() {
    const m = lbFiltered[lbIndex];
    if (!m) return;
    lbTitle.textContent = `${m.title} • ${fmtDate(m.date)}`;
    lbImg.src = m.src;
    lbFav.textContent = favorites.includes(m.id) ? '💛 Favorited' : '❤️ Favorite';
}
function keyLB(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLB();
    if (e.key === 'ArrowRight') nextLB();
}
function prevLB() { lbIndex = (lbIndex - 1 + lbFiltered.length) % lbFiltered.length; updateLB(); }
function nextLB() { lbIndex = (lbIndex + 1) % lbFiltered.length; updateLB(); }

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevLB);
lbNext.addEventListener('click', nextLB);
lbFav.addEventListener('click', () => {
    const m = lbFiltered[lbIndex]; if (!m) return;
    const idx = favorites.indexOf(m.id);
    if (idx >= 0) favorites.splice(idx, 1); else favorites.push(m.id);
    saveFavs(favorites);
    updateLB();
});
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

/* ---------- Slideshow ---------- */
const slideshowBtn = document.getElementById('slideshowBtn');
let slideTimer = null;
slideshowBtn.addEventListener('click', () => {
    rebuildFiltered();
    if (!lb.classList.contains('active')) {
        lbIndex = 0;
        lb.classList.add('active'); lb.setAttribute('aria-hidden', 'false');
        updateLB();
        document.addEventListener('keydown', keyLB);
    }
    if (slideTimer) { clearInterval(slideTimer); slideTimer = null; slideshowBtn.textContent = 'Slideshow ▶️'; return; }
    slideshowBtn.textContent = 'Stop ⏸';
    slideTimer = setInterval(nextLB, 2500);
});


/* ---------- Confetti ---------- */
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

let confettiPieces = [];
function makeConfetti() {
    confettiPieces = [];
    const colors = ['#ff6aa9', '#ffd166', '#9aa0ff', '#7bd88f', '#f5f5ff', '#ff9ec7'];
    const count = Math.min(260, Math.floor(canvas.width / 4));
    for (let i = 0; i < count; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.3,
            w: 6 + Math.random() * 10,
            h: 3 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: 2 + Math.random() * 4,
            vx: -2 + Math.random() * 4,
            rot: Math.random() * Math.PI,
            vr: (-0.12 + Math.random() * 0.24),
        });
    }
}
function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        p.y += p.vy; p.x += p.vx; p.rot += p.vr;
    });
    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 30);
    if (confettiPieces.length) requestAnimationFrame(drawConfetti);
}
function celebrate() { makeConfetti(); drawConfetti(); }
document.getElementById('celebrateBtn').addEventListener('click', celebrate);
document.getElementById('confettiAgain').addEventListener('click', (e) => { e.preventDefault(); celebrate(); });

/* ---------- Helpers ---------- */
function fmtDate(d) {
    if (!d) return '';
    try {
        const date = new Date(d);
        return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' });
    } catch { return d; }
}
function tagLabel(t) {
    return ({ us: 'Us ❤️', trip: 'Trips ✈️', food: 'Food 🍰', gift: 'Gifts 🎁', cute: 'Cute 🐼' })[t] || t;
}
function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]);
}
function heartIcon() {
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.716-4.54-9.099-7.604C1.237 11.482 2.32 8.5 4.812 7.52c2.492-.98 4.448.701 5.188 2.032C10.952 8.221 12.908 6.54 15.4 7.52c2.492.98 3.575 3.962 2.911 5.876C18.716 16.46 12 21 12 21z"/></svg>`;
}
