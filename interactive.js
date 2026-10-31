// Interactive effects: page fade on scroll, mountain parallax, side dots, card tilt
(function () {
  // Day / night mode
  const starsEl = document.getElementById('stars');
  if (starsEl) {
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      const size = Math.random() * 2 + 1;
      s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 60}%;animation-delay:${Math.random() * 3}s;animation-duration:${2 + Math.random() * 3}s`;
      starsEl.appendChild(s);
    }
  }
  const themeBtn = document.getElementById('themeToggle');
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.setAttribute('aria-checked', t === 'night' ? 'true' : 'false');
      themeBtn.classList.toggle('night', t === 'night');
    }
    try { localStorage.setItem('theme', t); } catch (e) { }
  }
  let saved = 'day';
  try { saved = localStorage.getItem('theme') || 'day'; } catch (e) { }
  applyTheme(saved);
  themeBtn?.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'night' ? 'day' : 'night');
  });

  const root = document.documentElement;
  const pages = Array.from(document.querySelectorAll('section[id]'));
  pages.forEach(p => p.classList.add('page'));

  // Progress bar
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  // Side dots
  const labels = { home: 'Home', about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects', certificates: 'Sertifikat', contact: 'Contact' };
  const dotsWrap = document.createElement('nav');
  dotsWrap.className = 'side-dots';
  dotsWrap.setAttribute('aria-label', 'Navigasi halaman');
  const dots = pages.map(p => {
    const d = document.createElement('button');
    d.className = 'side-dot';
    d.dataset.label = labels[p.id] || p.id;
    d.setAttribute('aria-label', d.dataset.label);
    d.addEventListener('click', () => p.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    dotsWrap.appendChild(d);
    return d;
  });
  document.body.appendChild(dotsWrap);

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function update() {
    const vh = window.innerHeight;
    const sy = window.scrollY;
    const max = document.documentElement.scrollHeight - vh;
    root.style.setProperty('--sy', sy);
    root.style.setProperty('--progress', max > 0 ? sy / max : 0);

    let activeIdx = 0, best = -1;
    pages.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const ratio = clamp(overlap / Math.min(r.height, vh), 0, 1);
      const fade = clamp(ratio * 2.2, 0, 1);
      const center = r.top + r.height / 2;
      const dir = center < vh / 2 ? -1 : 1; // above -> drifts up, below -> drifts down
      p.style.setProperty('--fade', fade.toFixed(3));
      p.style.setProperty('--shift', (dir * (1 - fade) * 60).toFixed(1) + 'px');
      p.style.setProperty('--scale', (0.96 + 0.04 * fade).toFixed(3));
      p.style.pointerEvents = fade < 0.2 ? 'none' : '';
      if (ratio > best) { best = ratio; activeIdx = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();

  // Mouse parallax for mountains and sun
  window.addEventListener('mousemove', e => {
    root.style.setProperty('--mx', ((e.clientX / window.innerWidth) - 0.5).toFixed(3));
  }, { passive: true });

  // Card tilt
  document.addEventListener('mousemove', e => {
    const card = e.target.closest && e.target.closest('.skill-card, .project-card:not(.add-more), .cert-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
    card.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
  });
  document.addEventListener('mouseout', e => {
    const card = e.target.closest && e.target.closest('.skill-card, .project-card, .cert-card');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    }
  });

  // Button ripple
  document.addEventListener('click', e => {
    const btn = e.target.closest && e.target.closest('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(s);
    setTimeout(() => s.remove(), 650);
  });
})();

// Fade in/out each block while scrolling (both directions)
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sel = '.section-header, .hero-content, .hero-visual, .about-text, .about-info, .skills-tabs, .skills-content.active .skill-card, .skills-content.active .soft-skill, .timeline-item, .project-card, .cert-card, .contact-card';
  const targets = Array.from(document.querySelectorAll(sel));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const el = en.target;
      if (en.isIntersecting) {
        el.classList.remove('out-up', 'out-down');
        el.classList.add('in-view');
      } else {
        el.classList.remove('in-view');
        el.classList.add(en.boundingClientRect.top < 0 ? 'out-up' : 'out-down');
      }
    });
  }, { threshold: 0.12 });

  function register(el, i) {
    if (el.classList.contains('reveal')) return;
    el.classList.add('reveal');
    el.style.setProperty('--d', Math.min(i % 6, 5) * 0.08 + 's');
    io.observe(el);
  }
  targets.forEach(register);

  // cards inside other skill tabs appear when the tab is opened
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('.skills-content.active .skill-card, .skills-content.active .soft-skill')
        .forEach((el, i) => register(el, i));
    }, 30);
  }));
  // cert cards are rendered by script.js; make sure they are picked up
  document.querySelectorAll('.cert-card').forEach(register);
})();

// Project detail modal: cards stay compact, details open on click
(function () {
  const projectDetails = {
    gudang: {
      title: 'Web Gudang ATK Purnama – Aplikasi Web Manajemen Persediaan Barang',
      role: 'Proyek Sertifikasi BNSP | Universitas Gunadarma',
      img: 'Projek/gudang/projek_gudang (6).png',
      points: [
        'Membangun aplikasi web manajemen persediaan barang ATK menggunakan CodeIgniter 4 dengan arsitektur MVC, PHP 8.2, dan MySQL, dilengkapi fitur autentikasi, Role-Based Access Control (RBAC), serta transaksi barang masuk dan keluar.',
        'Mengembangkan dashboard monitoring dengan grafik transaksi harian, pelaporan historis stok menggunakan metode retroactive calculation, serta fitur ekspor laporan ke Excel menggunakan SheetJS.',
        'Mengimplementasikan validasi stok secara real-time, auto-generate kode barang menggunakan AJAX, serta manajemen pengguna dengan keamanan password bcrypt dan pembaruan data profil secara otomatis pada session.'
      ],
      tech: ['PHP', 'MySQL', 'CodeIgniter 4'],
      github: 'https://github.com/zerjames/Website-Kelola-persediaan-pada-gudang-ATK',
      gallery: 'gudang', shots: 7
    },
    scanmakan: {
      title: 'ScanMakan - Aplikasi Web Pengenalan Makanan dan Pelacak Kalori',
      role: 'Proyek Penulisan Skripsi | Universitas Gunadarma',
      img: 'Projek/scanmakan/scanmakan (1).png',
      points: [
        'Mengembangkan aplikasi web berbasis Artificial Intelligence dan Computer Vision untuk mendeteksi dan mengklasifikasikan makanan Indonesia menggunakan model YOLOv8 yang dilatih dengan dataset.',
        'Melatih model YOLOv8 menggunakan dataset gambar makanan dengan pendekatan Transfer Learning untuk meningkatkan performa deteksi dan klasifikasi makanan.',
        'Mengintegrasikan model YOLOv8 dalam format ONNX ke dalam aplikasi web full-stack sehingga pengguna dapat mengunggah gambar makanan, melakukan klasifikasi secara otomatis, serta memperoleh informasi nilai gizi seperti energi, protein, lemak, karbohidrat, dan serat.',
        'Mengembangkan sistem pelacakan kalori harian yang mencakup estimasi ukuran porsi, pencatatan makanan, manajemen profil pengguna, perhitungan BMI dan TDEE, serta dashboard menggunakan PHP, CSS, MySQL, dan JavaScript.'
      ],
      tech: ['Python', 'YOLOv8', 'PHP', 'CSS', 'JavaScript'],
      github: 'https://github.com/zerjames/Scanmakan',
      gallery: 'scanmakan', shots: 3
    },
    futsal: {
      title: 'Futsal Sayan - Website Booking Lapangan Futsal',
      role: 'Proyek Penulisan Ilmiah | Universitas Gunadarma',
      img: 'Projek/sayan/sayan (1).png',
      points: [
        'Mengembangkan website pemesanan lapangan futsal berbasis web untuk memudahkan pengguna melihat informasi lapangan dan melakukan pemesanan secara online.',
        'Mengimplementasikan fitur registrasi dan login pengguna, pemesanan lapangan, unggah bukti pembayaran, riwayat booking, serta pengelolaan profil pengguna.',
        'Mengembangkan dashboard administrator untuk mengelola data lapangan, harga sewa, data pengguna, dan konfirmasi pemesanan melalui sistem yang terintegrasi dengan database MySQL.'
      ],
      tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/zerjames/futsalsayan',
      gallery: 'futsal', shots: 8
    },
    kopi: {
      title: 'Galeri Kopi Galaxy - Website Company Profile',
      role: 'Proyek Akademik | Universitas Gunadarma',
      img: 'Projek/galerikopi/foto bersama owner.jpeg',
      points: [
        'Mengembangkan website company profile untuk memperkenalkan informasi bisnis Galeri Kopi Galaxy secara digital, termasuk menu, event, galeri, fasilitas, dan profil perusahaan.',
        'Berperan sebagai Project Manager dengan tanggung jawab mengoordinasikan anggota tim, membagi tugas, dan memantau progres pengembangan website.',
        'Melakukan diskusi dengan pemilik bisnis untuk mengumpulkan dan menganalisis kebutuhan pengguna (requirement gathering), menentukan konten serta fitur website, dan mempresentasikan hasil pengembangan kepada klien.'
      ],
      tech: ['PHP', 'CSS', 'MySQL'],
      gallery: 'kopi', shots: 5
    }
  };

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const modal = document.createElement('div');
  modal.className = 'gallery-modal detail-modal';
  modal.id = 'detailModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="gallery-backdrop" data-close></div>
    <div class="gallery-dialog detail-dialog">
      <div class="gallery-header">
        <div class="gallery-info">
          <h3 id="detailTitle"></h3>
          <span class="gallery-counter" id="detailRole"></span>
        </div>
        <button class="gallery-close" data-close aria-label="Tutup"><i class="fas fa-times"></i></button>
      </div>
      <div class="detail-body" id="detailBody"></div>
    </div>`;
  document.body.appendChild(modal);

  function closeDetail() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openDetail(key) {
    const d = projectDetails[key];
    if (!d) return;
    document.getElementById('detailTitle').textContent = d.title;
    document.getElementById('detailRole').textContent = d.role;
    let html = '';
    if (d.img) html += `<img class="detail-img" src="${d.img}" alt="${esc(d.title)}" />`;
    html += '<ul class="detail-points">' + d.points.map(p => `<li>${esc(p)}</li>`).join('') + '</ul>';
    html += '<div class="project-tech">' + d.tech.map(t => `<span>${esc(t)}</span>`).join('') + '</div>';
    html += '<div class="detail-actions">';
    if (d.gallery) html += `<button type="button" class="btn btn-primary" data-gallery="${d.gallery}"><i class="fas fa-images"></i> Lihat Screenshot (${d.shots} Foto)</button>`;
    if (d.github) html += `<a class="btn btn-ghost" href="${d.github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>`;
    html += '</div>';
    const body = document.getElementById('detailBody');
    body.innerHTML = html;
    body.scrollTop = 0;
    body.querySelector('[data-gallery]')?.addEventListener('click', e => {
      const g = e.currentTarget.dataset.gallery;
      closeDetail();
      if (typeof openProjectGallery === 'function') openProjectGallery(g, 0);
    });
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeDetail(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeDetail();
  });

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    const open = () => openDetail(card.dataset.project);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
})();
