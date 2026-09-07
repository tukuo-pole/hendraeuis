/* ============================================================
   CONFIG — this is the only file you need to edit for content.
   Semua data undangan ada di sini. Ubah nilainya, simpan, upload.
   ============================================================ */

window.WEDDING = {

  /* ---------- COUPLE ---------- */
  groom: {
    short: "Hendra",
    full: "Muhammad Hendrananta",
    father: "Bapak Eko Hari",
    mother: "Ibu Tita Anantasari",
    instagram: ""            // e.g. "hendrananta" — leave "" to hide the button
  },
  bride: {
    short: "Euis",
    full: "Euis Herlina",
    father: "Bapak Caswan Ocim",
    mother: "Ibu Rasminah",
    instagram: ""            // e.g. "euisherlina" — leave "" to hide the button
  },

  /* ---------- EVENT ---------- */
  // ISO time WITH the +07:00 offset. Do not change the offset.
  akad:      { start: "2026-11-28T08:00:00+07:00", end: "2026-11-28T10:00:00+07:00" },
  reception: { start: "2026-11-28T11:30:00+07:00", end: "2026-11-28T13:30:00+07:00" },

  venue: {
    name: "Arunika Eatery",
    address: "Cigugur, Palutungan, Kuningan, Jawa Barat",
    maps: "https://maps.app.goo.gl/5AwnS6s3ytuk842fA",
    // Optional embedded map. Leave "" to hide the map frame.
    mapsEmbed: "https://www.google.com/maps?q=Arunika%20Eatery%20Palutungan%20Kuningan&output=embed"
  },

  /* ---------- TRAILER ---------- */
  // Put a YouTube ID (e.g. "dQw4w9WgXcQ") OR a local file path in `file`.
  // Leave both empty ("") and the whole trailer section hides itself.
  trailer: {
    youtubeId: "",
    file: "",                                  // e.g. "assets/video/prewedding.mp4"
    thumb: "assets/img/trailer-thumb.jpg"
  },

  /* ---------- MUSIC ---------- */
  music: {
    src: "assets/audio/backsound.mp3",
    title: "Our Forever",
    artist: "Hendra & Euis"
  },

  /* ---------- GIFT ---------- */
  banks: [
    { bank: "BANK NAME",  name: "ACCOUNT NAME", number: "0000000000" },
    { bank: "BANK NAME",  name: "ACCOUNT NAME", number: "0000000000" }
  ],
  gift: {
    recipient: "Muhammad Hendrananta / Euis Herlina",
    address: ""              // leave "" to hide the physical-gift card
  },

  /* ---------- RSVP / WISHES BACKEND ---------- */
  // Paste the Google Apps Script /exec URL here (see apps-script/Code.gs + README).
  // Leave "" and the form will run in demo mode (nothing is saved).
  apiUrl: "",

  /* ---------- GALLERY ---------- */
  // Group photos into rails. Add or remove freely.
  gallery: [
    {
      title: "Top Moments",
      photos: [
        { src: "assets/img/gallery/g1.jpg",  caption: "The two of us" },
        { src: "assets/img/gallery/g2.jpg",  caption: "Under one light" },
        { src: "assets/img/gallery/g3.jpg",  caption: "The first steps" },
        { src: "assets/img/gallery/g4.jpg",  caption: "Side by side" }
      ]
    },
    {
      title: "Our Favorite Memories",
      photos: [
        { src: "assets/img/gallery/g5.jpg",  caption: "In Sundanese white" },
        { src: "assets/img/gallery/g6.jpg",  caption: "Behind the drape" },
        { src: "assets/img/gallery/g7.jpg",  caption: "A quiet moment" },
        { src: "assets/img/gallery/g8.jpg",  caption: "Walking into it" }
      ]
    },
    {
      title: "Portraits",
      photos: [
        { src: "assets/img/gallery/g9.jpg",  caption: "Him, and her shadow" },
        { src: "assets/img/gallery/g10.jpg", caption: "Her, and his shadow" },
        { src: "assets/img/gallery/g11.jpg", caption: "In motion" },
        { src: "assets/img/gallery/g12.jpg", caption: "Just us" }
      ]
    }
  ],

  /* ---------- FALLBACK WISHES ---------- */
  // Shown before/if the backend has no data yet. Delete entries once live.
  seedWishes: [
    { name: "Keluarga Besar Cigugur", stars: 5, message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair." },
    { name: "Teman-teman Bandung",    stars: 5, message: "Selamat menempuh hidup baru. Semoga sakinah, mawaddah, warahmah." }
  ]
};
