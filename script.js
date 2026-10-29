/* ===== EDIT HERE ===== */
const TOTAL = 19;                 // photo1.jpeg ... photo19.jpeg
const EXT = "jpeg";
const PER_PAGE = 6;               // photos per page
const CAPTIONS = {                // text shown when a photo is opened
  1: "Quruxdaydu waa tushta,",
};
const CATS = ["Portraits", "Nature", "Travel", "Fashion", "Friends"];
const CATEGORY = {                // choose a group for a photo, e.g. 3: "Travel"
  // 3: "Travel",
};
/* ===================== */

const photos = Array.from({ length: TOTAL }, (_, i) => {
  const n = i + 1;
  return { n, src: `photo${n}.${EXT}`, cat: CATEGORY[n] || CATS[i % CATS.length] };
});

const grid = document.getElementById("grid");
const pager = document.getElementById("pager");
const filters = document.getElementById("filters");
const liked = new Set();
let filter = "All", page = 1, list = photos;

function renderFilters() {
  filters.innerHTML = "";
  ["All", ...CATS].forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (c === filter ? " on" : "");
    b.textContent = c;
    b.onclick = () => { filter = c; page = 1; render(); };
    filters.appendChild(b);
  });
}

function render() {
  list = filter === "All" ? photos : photos.filter((p) => p.cat === filter);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  page = Math.min(page, pages);
  renderFilters();

  grid.innerHTML = "";
  list.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach((p) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.src = p.src; img.alt = CAPTIONS[p.n] || `Photo ${p.n}`; img.loading = "lazy";
    img.onerror = () => fig.remove();
    const like = document.createElement("button");
    like.className = "like" + (liked.has(p.n) ? " on" : "");
    like.innerHTML = liked.has(p.n) ? "&#9829;" : "&#9825;";
    like.setAttribute("aria-label", "Like");
    like.onclick = (e) => {
      e.stopPropagation();
      liked.has(p.n) ? liked.delete(p.n) : liked.add(p.n);
      like.classList.toggle("on");
      like.innerHTML = liked.has(p.n) ? "&#9829;" : "&#9825;";
    };
    fig.onclick = () => open(list.indexOf(p));
    fig.append(img, like);
    grid.appendChild(fig);
  });

  pager.innerHTML = "";
  if (pages > 1) {
    for (let i = 1; i <= pages; i++) {
      const b = document.createElement("button");
      b.textContent = i;
      if (i === page) b.className = "on";
      b.onclick = () => { page = i; render(); };
      pager.appendChild(b);
    }
    const next = document.createElement("button");
    next.innerHTML = "&rarr;";
    next.onclick = () => { page = page % pages + 1; render(); };
    pager.appendChild(next);
  }
}

/* Lightbox */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");
let cur = 0;

function open(i) {
  cur = (i + list.length) % list.length;
  const p = list[cur];
  lbImg.src = p.src;
  lbImg.alt = CAPTIONS[p.n] || `Photo ${p.n}`;
  lbCap.textContent = CAPTIONS[p.n] || "";
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}
const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };

document.getElementById("close").onclick = close;
document.getElementById("prev").onclick = () => open(cur - 1);
document.getElementById("next").onclick = () => open(cur + 1);
lb.onclick = (e) => { if (e.target === lb) close(); };
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") open(cur - 1);
  if (e.key === "ArrowRight") open(cur + 1);
});
let sx = 0;
lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 50) open(cur + (dx < 0 ? 1 : -1));
}, { passive: true });

render();
