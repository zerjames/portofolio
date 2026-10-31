// Background Particles
const container = document.getElementById('bgParticles');
if (container) {
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 15 + 10}s;animation-delay:${Math.random() * 10}s;`;
    container.appendChild(p);
  }
}

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  });
}

// Hamburger menu
const ham = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (ham && navLinks) {
  ham.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Active nav link
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  links.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
}

// Typed text - Disesuaikan dengan minat di CV: Web Development, IT Support, Project Management, Machine Learning
const roles = ['Web Developer', 'IT Support', 'Project Manager', 'Machine Learning Enthusiast'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');
if (typedEl) {
  function type() {
    const word = roles[roleIdx];
    typedEl.textContent = deleting ? word.substring(0, charIdx--) : word.substring(0, charIdx++);
    if (!deleting && charIdx > word.length) { deleting = true; setTimeout(type, 1500); return; }
    if (deleting && charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    setTimeout(type, deleting ? 60 : 120);
  }
  type();
}

// Stats counter
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = el.dataset.float === 'true' || target % 1 !== 0;
  let count = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = isFloat ? count.toFixed(2) : Math.floor(count);
    if (count >= target) {
      el.textContent = isFloat ? target.toFixed(2) : target;
      clearInterval(timer);
    }
  }, 20);
}

// Intersection Observer for scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    const counters = entry.target.querySelectorAll('.stat-number');
    counters.forEach(animateCounter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.05 });
document.querySelectorAll('.timeline-item, .about-stats').forEach(el => observer.observe(el));

// Skills tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skills-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// Smooth close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks?.classList.remove('open'));
});

// =====================
// SERTIFIKAT
// =====================
const certificates = [
  { title: 'Basic Web Application Design', issuer: 'LSP', year: '2026', icon: 'fa-globe', img: 'Sertifikat/Dasar Perancangan Aplikasi Web.png', link: 'https://drive.google.com/file/d/1-w3jyuCJZz1KwY0h9AeK49D0KB3ccr06/view?usp=drive_link' },
  { title: 'Basic Web Application Development', issuer: 'LSP', year: '2026', icon: 'fa-code', img: 'Sertifikat/dasar pembuatan aplikasi web.png', link: 'https://drive.google.com/file/d/1Zy95beGty2HmqXtY6XzUSa-HYfGeEsM1/view?usp=drive_link' },
  { title: 'Building Website using HTML5', issuer: 'Workshop', year: '2024', icon: 'fa-html5', img: 'Sertifikat/Membangun Website Menggunakan HTML 5.png', link: 'https://drive.google.com/file/d/1cg8GajOevfE5YajkyCJfthGHCmqUCWhE/view?usp=drive_link' },
  { title: 'Dasar Pemrograman Berbasis Web', issuer: 'Lepkom Gunadarma', year: '2023', icon: 'fa-laptop-code', img: 'Sertifikat/DASAR PEMROGRAMAN BERBASIS WEB.png', link: 'https://drive.google.com/file/d/10XfxJDih-DtxtThg_yTwHcGL5XKGqbwZ/view?usp=drive_link' },
  { title: 'Dasar Pemrograman Jaringan', issuer: 'Lepkom Gunadarma', year: '2023', icon: 'fa-network-wired', img: 'Sertifikat/DASAR PEMROGRAMAN JARINGAN.png', link: 'https://drive.google.com/file/d/1bVjYgFATxh8y-eKgSieiv9TFwuv3baZG/view?usp=drive_link' },
  { title: 'Go-Lang for Intermediate', issuer: 'Lepkom Gunadarma', year: '2025', icon: 'fa-server', img: 'Sertifikat/PEMROGRAMAN GO UNTUK TINGKAT MENENGAH.png', link: 'https://drive.google.com/file/d/1p4r7TOm87dnK6-F4xnY4PyISGj0hEwbL/view?usp=drive_link' },
  { title: 'Pemrograman Go untuk Pemula', issuer: 'Lepkom Gunadarma', year: '2024', icon: 'fa-terminal', img: 'Sertifikat/PEMROGRAMAN GO UNTUK TINGKAT PEMULA.png', link: 'https://drive.google.com/file/d/1NhrNXu9coTgKZbzii-3lqY7JrTP-03GI/view?usp=drive_link' },
  { title: 'Pemrograman Jaringan Lokal Area', issuer: 'Lepkom Gunadarma', year: '2024', icon: 'fa-wifi', img: 'Sertifikat/PEMROGRAMAN JARINGAN UNTUK LOKAL AREA MENGGUNAKAN CISCO ROUTER.png', link: 'https://drive.google.com/file/d/1vR8wFy4NgDEqQppXUjos8BVedyxV1Ycy/view?usp=drive_link' },
  { title: 'Wide Area Network using Cisco Router', issuer: 'Lepkom Gunadarma', year: '2025', icon: 'fa-sitemap', img: 'Sertifikat/PEMROGRAMAN JARINGAN UNTUK WIDE AREA.png', link: 'https://drive.google.com/file/d/1YP_I7PVyCGpTttlZSlJn8CkvrvGu6UEh/view?usp=drive_link' },
];

const certDescriptions = {
  'Basic Web Application Design': 'Mempelajari dasar perancangan aplikasi web, mulai dari analisis kebutuhan hingga perancangan alur sistem dan antarmuka.',
  'Basic Web Application Development': 'Mempelajari dasar pembuatan aplikasi web, meliputi pemrograman sisi server dan pengelolaan database.',
  'Building Website using HTML5': 'Mempelajari cara membangun struktur halaman website menggunakan HTML5.',
  'Dasar Pemrograman Berbasis Web': 'Mempelajari dasar pemrograman web, mencakup HTML, CSS, dan pemrograman sisi server.',
  'Dasar Pemrograman Jaringan': 'Mempelajari konsep dasar jaringan komputer dan pemrograman jaringan.',
  'Go-Lang for Intermediate': 'Mempelajari pemrograman Go tingkat menengah, seperti struktur data, concurrency, dan pengembangan aplikasi.',
  'Pemrograman Go untuk Pemula': 'Mempelajari dasar bahasa pemrograman Go, mulai dari sintaks, variabel, hingga fungsi.',
  'Pemrograman Jaringan Lokal Area': 'Mempelajari konfigurasi jaringan lokal (LAN) menggunakan Cisco Router.',
  'Wide Area Network using Cisco Router': 'Mempelajari perancangan dan konfigurasi jaringan WAN menggunakan Cisco Router.'
};

function renderCertificates() {
  const grid = document.getElementById('certGrid');
  if (!grid || certificates.length === 0) return;
  grid.innerHTML = '';
  certificates.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'cert-card';
    const thumbHTML = cert.img
      ? `<div class="cert-thumb cert-thumb-img"><img src="${cert.img}" alt="${cert.title}" loading="lazy" /></div>`
      : `<div class="cert-thumb"><i class="fas ${cert.icon}"></i></div>`;
    const desc = cert.desc || certDescriptions[cert.title] || '';
    card.innerHTML = `
      ${thumbHTML}
      <div class="cert-info">
        <h3>${cert.title}</h3>
        <span>${cert.issuer}</span>
        <span class="cert-tag">${cert.year}</span>
        ${desc ? `<p class="cert-desc">${desc}</p>` : ''}
      </div>`;
    card.addEventListener('click', () => window.open(cert.link, '_blank'));
    grid.appendChild(card);
  });
}
renderCertificates();

// =====================
// PROJECT GALLERY / LIGHTBOX
// =====================
const projectGalleries = {
  gudang: {
    title: 'Web Persediaan Barang Gudang (ATK Toko Purnama)',
    images: [
      { src: 'Projek/gudang/projek_gudang (6).png', caption: '1/7 — Dashboard Utama: Ringkasan total barang, stok tersimpan, barang masuk & keluar, status barang, serta grafik transaksi bulanan.' },
      { src: 'Projek/gudang/projek_gudang (5).png', caption: '2/7 — Persediaan Barang: Monitoring stok barang real-time, pencatatan transaksi masuk & keluar, dan filter status persediaan.' },
      { src: 'Projek/gudang/projek_gudang (4).png', caption: '3/7 — Master Data Barang: Daftar inventaris alat tulis kantor lengkap dengan kode barang, satuan, kuantitas stok, dan aksi CRUD.' },
      { src: 'Projek/gudang/projek_gudang (1).png', caption: '4/7 — Laporan Transaksi: Rekapitulasi transaksi masuk & keluar dengan filter rentang tanggal, tombol Cetak Laporan, dan Ekspor Excel.' },
      { src: 'Projek/gudang/projek_gudang (3).png', caption: '5/7 — Kategori Barang: Pengelompokan jenis barang inventaris (Alat Tulis, Arsip dan Map, Kertas dan Buku).' },
      { src: 'Projek/gudang/projek_gudang (2).png', caption: '6/7 — Manajemen Pengguna: Pengaturan akun pengguna dengan hak akses admin dan pemilik sistem.' },
      { src: 'Projek/gudang/projek_gudang (7).png', caption: '7/7 — Halaman Login: Autentikasi aman untuk admin dan pemilik Gudang ATK Toko Purnama.' }
    ]
  },
  scanmakan: {
    title: 'ScanMakan — Deteksi Makanan berbasis YOLOv8',
    images: [
      { src: 'Projek/scanmakan/scanmakan (1).png', caption: '1/3 — Halaman Utama: Tampilan antarmuka aplikasi ScanMakan dengan fitur deteksi makanan real-time melalui kamera.' },
      { src: 'Projek/scanmakan/scanmakan (2).png', caption: '2/3 — Hasil Deteksi: Output klasifikasi 12 jenis makanan dan minuman menggunakan model YOLOv8 Transfer Learning.' },
      { src: 'Projek/scanmakan/scanmakan (3).png', caption: '3/3 — Detail Klasifikasi: Informasi lengkap hasil identifikasi jenis makanan beserta tingkat akurasi prediksi.' }
    ]
  },
  futsal: {
    title: 'Website Booking Lapangan Futsal',
    images: [
      { src: 'Projek/sayan/sayan (1).png', caption: '1/8 — Halaman Utama: Landing page platform booking lapangan futsal dengan tampilan jadwal dan ketersediaan.' },
      { src: 'Projek/sayan/sayan (2).png', caption: '2/8 — Daftar Lapangan: Pilihan lapangan futsal yang tersedia beserta detail fasilitas dan harga sewa.' },
      { src: 'Projek/sayan/sayan (3).png', caption: '3/8 — Form Booking: Formulir pemesanan lapangan dengan pemilihan tanggal, sesi waktu, dan data pemesan.' },
      { src: 'Projek/sayan/sayan (4).png', caption: '4/8 — Konfirmasi Pembayaran: Halaman konfirmasi pembayaran digital setelah proses booking berhasil.' },
      { src: 'Projek/sayan/sayan (5).png', caption: '5/8 — Riwayat Booking: Daftar riwayat pemesanan dengan status konfirmasi dan detail transaksi.' },
      { src: 'Projek/sayan/sayan (6).png', caption: '6/8 — Dashboard Admin: Panel administrasi untuk mengelola jadwal, lapangan, dan konfirmasi booking.' },
      { src: 'Projek/sayan/sayan (7).png', caption: '7/8 — Manajemen Lapangan: Pengaturan data lapangan, jam operasional, dan tarif sewa oleh admin.' },
      { src: 'Projek/sayan/sayan (8).png', caption: '8/8 — Halaman Login: Autentikasi pengguna dan admin sistem booking lapangan futsal.' }
    ]
  }
};

let currentGalleryKey = null;
let currentGalleryIdx = 0;

function openProjectGallery(key, startIndex = 0) {
  const gallery = projectGalleries[key];
  if (!gallery || !gallery.images.length) return;
  currentGalleryKey = key;
  currentGalleryIdx = startIndex;

  const modal = document.getElementById('galleryModal');
  const title = document.getElementById('galleryTitle');
  const thumbsContainer = document.getElementById('galleryThumbs');

  if (title) title.textContent = gallery.title;
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';

  // Render thumbnails
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    gallery.images.forEach((item, idx) => {
      const thumb = document.createElement('img');
      thumb.src = item.src;
      thumb.alt = `Thumbnail ${idx + 1}`;
      thumb.className = 'gallery-thumb' + (idx === currentGalleryIdx ? ' active' : '');
      thumb.addEventListener('click', () => showGalleryImage(idx));
      thumbsContainer.appendChild(thumb);
    });
  }

  showGalleryImage(currentGalleryIdx);
}

function showGalleryImage(idx) {
  const gallery = projectGalleries[currentGalleryKey];
  if (!gallery) return;
  currentGalleryIdx = (idx + gallery.images.length) % gallery.images.length;
  const item = gallery.images[currentGalleryIdx];

  const img = document.getElementById('galleryImg');
  const counter = document.getElementById('galleryCounter');
  const caption = document.getElementById('galleryCaption');

  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = item.src;
      img.onload = () => { img.style.opacity = '1'; };
    }, 100);
  }

  if (counter) counter.textContent = `${currentGalleryIdx + 1} / ${gallery.images.length}`;
  if (caption) caption.textContent = item.caption;

  // Update active thumbnail
  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === currentGalleryIdx);
    if (i === currentGalleryIdx) {
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function closeProjectGallery() {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Gallery Event Listeners
document.getElementById('galleryClose')?.addEventListener('click', closeProjectGallery);
document.getElementById('galleryBackdrop')?.addEventListener('click', closeProjectGallery);
document.getElementById('galleryPrev')?.addEventListener('click', () => showGalleryImage(currentGalleryIdx - 1));
document.getElementById('galleryNext')?.addEventListener('click', () => showGalleryImage(currentGalleryIdx + 1));

document.addEventListener('keydown', e => {
  const modal = document.getElementById('galleryModal');
  if (!modal || !modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeProjectGallery();
  if (e.key === 'ArrowLeft') showGalleryImage(currentGalleryIdx - 1);
  if (e.key === 'ArrowRight') showGalleryImage(currentGalleryIdx + 1);
});
