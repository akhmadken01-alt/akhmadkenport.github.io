/* =============================================
   MAIN.JS — Portfolio A.Ken
   ============================================= */

// ========== 1. LOAD & RENDER KARYA ==========

// Fungsi untuk load data dari karya.json
async function loadKarya() {
    const grid = document.getElementById('karya-grid');

    try {
        const response = await fetch('data/karya.json');
        const dataKarya = await response.json();

        // Simpan data secara global supaya bisa difilter
        window.semuaKarya = dataKarya;

        // Render semua karya
        renderKarya(dataKarya);
    } catch (error) {
        // Jika fetch gagal (misal buka langsung tanpa server),
        // pakai data fallback
        console.warn('Gagal load karya.json, pakai data fallback:', error);
        const fallback = getFallbackData();
        window.semuaKarya = fallback;
        renderKarya(fallback);
    }
}

// Fungsi untuk render kartu karya ke grid
function renderKarya(data) {
    const grid = document.getElementById('karya-grid');

    if (data.length === 0) {
        grid.innerHTML = '<p class="karya__loading">Belum ada karya di kategori ini.</p>';
        return;
    }

    grid.innerHTML = data.map(function (item) {
        return `
            <div class="karya__card reveal" data-kategori="${item.kategori}">
                <div class="karya__card-img">
                    ${item.gambar
                        ? `<img src="${item.gambar}" alt="${item.judul}" 
                             onerror="this.style.display='none'">`
                        : ''
                    }
                </div>
                <div class="karya__card-body">
                    <h3 class="karya__card-title">${item.judul}</h3>
                    <p class="karya__card-desc">${item.deskripsi}</p>
                    <span class="karya__card-tag">${item.kategori}</span>
                </div>
            </div>
        `;
    }).join('');

    // Aktifkan scroll reveal untuk kartu baru
    initScrollReveal();
}

// Data fallback jika JSON gagal di-load
function getFallbackData() {
    return [
            {
        "id": 1,
        "judul": "Kanade - Sukima Switch",
        "kategori": "musik",
        "deskripsi": "-",
        "gambar": "assets/img/karya-1.jpg"
    },
    {
        "id": 2,
        "judul": "-",
        "kategori": "jurnal",
        "deskripsi": "-",
        "gambar": "assets/img/karya-2.jpg"
    }
    ];
}


// ========== 2. FILTER KARYA ==========

function initFilter() {
    const buttons = document.querySelectorAll('.karya__filter-btn');

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Hapus class active dari semua tombol
            buttons.forEach(function (b) { b.classList.remove('active'); });

            // Tambah class active ke tombol yang diklik
            btn.classList.add('active');

            // Ambil kategori dari data-filter
            const filter = btn.getAttribute('data-filter');

            // Filter data
            if (filter === 'semua') {
                renderKarya(window.semuaKarya);
            } else {
                const filtered = window.semuaKarya.filter(function (item) {
                    return item.kategori === filter;
                });
                renderKarya(filtered);
            }
        });
    });
}


// ========== 3. NAVBAR SCROLL EFFECT ==========

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    });
}


// ========== 4. HAMBURGER MENU (HP) ==========

function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.querySelector('.navbar__menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        menu.classList.toggle('open');
    });

    // Tutup menu saat klik link
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            menu.classList.remove('open');
        });
    });
}


// ========== 5. SCROLL REVEAL ANIMATION ==========

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Hanya animasi sekali
            }
        });
    }, {
        threshold: 0.15,   // Muncul saat 15% elemen terlihat
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function (el) {
        observer.observe(el);
    });
}


// ========== 6. TAMBAH CLASS REVEAL KE SECTION ==========

function addRevealClasses() {
    // Tambahkan class "reveal" ke elemen-elemen yang mau di-animasi
    const selectors = [
        '.tentang__desc',
        '.tentang__skills',
        '.pendidikan__card',
        '.kontak__item',
        '.kontak__desc'
    ];

    selectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (el) {
            el.classList.add('reveal');
        });
    });
}


// ========== JALANKAN SEMUA ==========

document.addEventListener('DOMContentLoaded', function () {
    // Tambah class reveal ke elemen
    addRevealClasses();

    // Aktifkan scroll reveal
    initScrollReveal();

    // Load dan render karya dari JSON
    loadKarya();

    // Aktifkan filter
    initFilter();

    // Aktifkan navbar scroll effect
    initNavbarScroll();

    // Aktifkan hamburger menu
    initHamburger();
});