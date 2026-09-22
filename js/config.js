/* ============================================================
   CONFIG — this is the only file you need to edit for content.
   Semua data undangan ada di sini. Ubah nilainya, simpan, upload.
   ============================================================ */

window.WEDDING = {

  /* ---------- COUPLE ---------- */
  groom: {
    short: "Hendra",
    full: "Muhammad Hendrananta",
    father: "Bapak Eko Hari Endrarto",
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
  reception: { start: "2026-11-28T11:00:00+07:00", end: "2026-11-28T13:00:00+07:00" },

  venue: {
    name: "Arunika",
    address: "Cigugur, Palutungan, Kuningan, Jawa Barat",
    maps: "https://maps.app.goo.gl/NWe1UzgkxcE7fnAt9",
    // Optional embedded map. Leave "" to hide the map frame.
    mapsEmbed: "https://www.google.com/maps?q=Arunika%20Garden%20Palutungan%20Kuningan&output=embed"
  },

  /* ---------- TRAILER ---------- */
  // Put a YouTube ID (e.g. "dQw4w9WgXcQ") OR a local file path in `file`.
  trailer: {
    youtubeId: "gFK-JnbZZvo",
    file: ""                                   // e.g. "assets/video/prewedding.mp4"
  },

  /* ---------- MUSIC ---------- */
  music: {
    src: "assets/audio/backsound.mp3",
    title: "Our Forever",
    artist: "Hendra & Euis"
  },

  /* ---------- GIFT ---------- */
  banks: [
    { bank: "Bank BCA",     name: "Muhammad Hendrananta", number: "0012601644" },
    { bank: "Bank Mandiri", name: "Euis Herlina",         number: "1040006018209" }
  ],
  gift: {
    recipient: "Muhammad Hendrananta / Euis Herlina",
    address: "Jl. Cisanggiri II No.3, RT.3/RW.4, Petogogan, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12170"
  },

  /* ---------- RSVP / WISHES BACKEND ---------- */
  // Paste the Google Apps Script /exec URL here (see apps-script/Code.gs + README).
  apiUrl: "https://script.google.com/macros/s/AKfycbwgOnOIFwAUHL1t6xKDnbjlNz4h2t0KH_q7h4zvhB1p_U6bnIZnq0l9KCiL5XcTkU9K2Q/exec",

  /* ---------- GALLERY ---------- */
  // Group photos into rails. Add or remove freely.
  gallery: [
    {
      title: "Top Moments",
      photos: [
        { src: "assets/img/gallery/g1.webp",  caption: "The two of us" },
        { src: "assets/img/gallery/g2.webp",  caption: "Us, and our shadows" },
        { src: "assets/img/gallery/g3.webp",  caption: "Under one light" },
        { src: "assets/img/gallery/g4.webp",  caption: "Walking into it" },
        { src: "assets/img/gallery/g5.webp",  caption: "Side by side" }
      ]
    },
    {
      title: "The Second Look",
      photos: [
        { src: "assets/img/gallery/g6.webp",  caption: "Dressed in white" },
        { src: "assets/img/gallery/g7.webp",  caption: "Him, and her shadow" },
        { src: "assets/img/gallery/g8.webp",  caption: "Her, and his shadow" },
        { src: "assets/img/gallery/g9.webp",  caption: "The first steps" },
        { src: "assets/img/gallery/g10.webp", caption: "A quiet moment" }
      ]
    }
  ]
};
