/* ============================================================
   HENDRA & EUIS — main.js
   No build step. Plain ES2018. Works on GitHub Pages.
   ============================================================ */
(function () {
  "use strict";

  var W = window.WEDDING || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     TOAST
     --------------------------------------------------------- */
  var scrollY = 0;
  function lockScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = "fixed";
    document.body.style.top = -scrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
  }
  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    window.scrollTo(0, scrollY);
  }

  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }

  /* ---------------------------------------------------------
     ISI HALAMAN DARI CONFIG — config.js satu-satunya sumber data
     --------------------------------------------------------- */
  var G = W.groom || {}, B = W.bride || {}, V = W.venue || {};

  function pick(path) {
    return path.split(".").reduce(function (o, k) { return o ? o[k] : ""; }, W) || "";
  }
  // "2026-11-28T11:00:00+07:00" -> "11.00", dibaca langsung dari teks
  // supaya jamnya tetap WIB walaupun zona waktu HP tamu berbeda
  function hhmm(iso) {
    var m = /T(\d{2}):(\d{2})/.exec(iso || "");
    return m ? m[1] + "." + m[2] : "";
  }
  function timeRange(key) {
    var ev = W[key] || {};
    return hhmm(ev.start) + " \u2013 " + hhmm(ev.end) + " WIB";
  }

  var COUPLE = {
    full:    esc(G.full) + "<span>&amp;</span>" + esc(B.full),
    stacked: esc(G.short) + "<span>&amp;</span>" + esc(B.short),
    title:   "<span>" + esc(G.short) + "</span><em>&amp;</em><span>" + esc(B.short) + "</span>",
    short:   esc(G.short) + " &amp; " + esc(B.short)
  };

  $$("[data-bind]").forEach(function (el) { el.textContent = pick(el.getAttribute("data-bind")); });
  $$("[data-alt]").forEach(function (el) { el.alt = pick(el.getAttribute("data-alt")); });
  $$("[data-time]").forEach(function (el) { el.textContent = timeRange(el.getAttribute("data-time")); });
  $$("[data-couple]").forEach(function (el) { el.innerHTML = COUPLE[el.getAttribute("data-couple")] || ""; });
  $$("[data-parents]").forEach(function (el) {
    var isBride = el.getAttribute("data-parents") === "bride", p = isBride ? B : G;
    el.innerHTML = (isBride ? "Putri dari" : "Putra dari") +
      "<br><b>" + esc(p.father) + "</b> &amp; <b>" + esc(p.mother) + "</b>";
  });
  $$("[data-family]").forEach(function (el) {
    var p = el.getAttribute("data-family") === "bride" ? B : G;
    el.innerHTML = "Keluarga " + esc(p.father) + "<br>&amp; " + esc(p.mother);
  });
  $$("[data-venue]").forEach(function (el) {
    el.innerHTML = esc(V.name) + "<small>" + esc(V.address) + "</small>";
  });
  $("#fMessage").placeholder = "Leave a message for " + G.short + " & " + B.short + "\u2026";

  /* ---------------------------------------------------------
     GUEST NAME FROM URL  ( ?to=Bapak%20Ananta )
     --------------------------------------------------------- */
  function getGuest() {
    var p = new URLSearchParams(location.search);
    var raw = p.get("to") || p.get("kepada") || p.get("nama") || p.get("guest") || "";
    raw = raw.replace(/\+/g, " ").trim();
    // strip anything that could inject markup
    raw = raw.replace(/[<>]/g, "");
    return raw.slice(0, 80);
  }

  var guest = getGuest();
  var guestDisplay = guest || "Tamu Undangan";
  $("#guestName").textContent = guestDisplay;
  var initial = (guest || "T").replace(/^(bapak|ibu|bpk|sdr|sdri|saudara|saudari|mr|mrs|ms)\.?\s+/i, "").trim().charAt(0).toUpperCase() || "T";
  $("#avatarInitial").textContent = initial;
  $("#navAvatar").textContent = initial;
  if (guest) document.title = guest + " — " + G.short + " & " + B.short + " · 28.11.2026";

  /* ---------------------------------------------------------
     COVER → INTRO → INVITATION
     --------------------------------------------------------- */
  var cover = $("#cover"), intro = $("#intro"), audio = $("#audio"), player = $("#player");
  var opened = false;

  // Opening title hanya diputar sekali per tamu. Flag-nya bertahan walaupun
  // tab ditutup, jadi tamu yang balik lagi langsung masuk ke hero.
  var INTRO_KEY = "he_intro_seen";
  function introSeen() {
    try { return localStorage.getItem(INTRO_KEY) === "1"; } catch (e) { return false; }
  }
  function markIntroSeen() {
    try { localStorage.setItem(INTRO_KEY, "1"); } catch (e) { /* storage diblokir */ }
  }

  $("#openBtn").addEventListener("click", function () {
    if (opened) return;
    opened = true;

    startMusic();
    cover.classList.add("is-gone");

    if (reduced || introSeen()) { finishIntro(); return; }
    markIntroSeen();

    intro.classList.add("is-on");
    setTimeout(function () { intro.classList.add("is-out"); }, 3600);
    setTimeout(finishIntro, 4400);
  });

  function finishIntro() {
    intro.classList.remove("is-on", "is-out");
    intro.style.display = "none";
    cover.style.display = "none";
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    player.hidden = false;
  }

  /* ---------------------------------------------------------
     MUSIC
     --------------------------------------------------------- */
  var playerBtn = $("#playerToggle"), navMusic = $("#navMusic");
  audio.src = (W.music && W.music.src) || "";
  audio.volume = 0;
  if (W.music && W.music.title) {
    $("#playerTitle").textContent = W.music.title + (W.music.artist ? " · " + W.music.artist : "");
  }

  function startMusic() {
    if (!audio.src) return;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setPaused(true); });
    fade(0, 0.55, 2200);
  }
  function fade(from, to, ms) {
    var t0 = performance.now();
    (function step(t) {
      var k = Math.min((t - t0) / ms, 1);
      audio.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function setPaused(is) {
    player.classList.toggle("is-paused", is);
    playerBtn.setAttribute("aria-pressed", String(!is));
    playerBtn.setAttribute("aria-label", is ? "Putar musik" : "Jeda musik");
    navMusic.setAttribute("aria-pressed", String(!is));
  }
  function toggleMusic() {
    if (!audio.src) { toast("Musik belum ditambahkan"); return; }
    if (audio.paused) { audio.play(); setPaused(false); }
    else { audio.pause(); setPaused(true); }
  }
  playerBtn.addEventListener("click", toggleMusic);
  navMusic.addEventListener("click", toggleMusic);
  audio.addEventListener("error", function () { setPaused(true); });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audio.paused) { audio.pause(); setPaused(true); }
  });

  /* ---------------------------------------------------------
     NAV
     --------------------------------------------------------- */
  var nav = $("#nav"), burger = $("#burger");
  var onScroll = function () {
    nav.classList.toggle("is-solid", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  $$(".nav__links a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // active link on scroll
  var sections = ["hero", "cast", "premiere", "gallery", "rsvp"];
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$(".nav__links a").forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (id) { var el = document.getElementById(id); if (el) navObs.observe(el); });
  }

  /* ---------------------------------------------------------
     MAPS LINKS
     --------------------------------------------------------- */
  var mapsUrl = (W.venue && W.venue.maps) || "#";
  $$("[data-maps]").forEach(function (a) { a.href = mapsUrl; });

  if (W.venue && W.venue.mapsEmbed) {
    var f = document.createElement("iframe");
    f.src = W.venue.mapsEmbed;
    f.loading = "lazy";
    f.title = "Peta lokasi " + W.venue.name;
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.allowFullscreen = true;
    $("#venueMap").appendChild(f);
  }

  /* ---------------------------------------------------------
     GOOGLE CALENDAR
     --------------------------------------------------------- */
  function gcalStamp(iso) {
    // ISO with +07:00 → UTC basic format YYYYMMDDTHHMMSSZ
    return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  var coupleFull = G.full + " & " + B.full;
  var CAL = {
    akad: {
      title: coupleFull + " — Akad Nikah",
      det: "Akad Nikah, " + timeRange("akad") + ". Kami menantikan kehadiran dan doa restu Anda."
    },
    reception: {
      title: coupleFull + " — Wedding Reception",
      det: "Resepsi Pernikahan, " + timeRange("reception") + ". Kami menantikan kehadiran dan doa restu Anda."
    }
  };
  $$("[data-cal]").forEach(function (b) {
    b.addEventListener("click", function () {
      var key = b.getAttribute("data-cal");
      var ev = W[key] || W.akad;
      var meta = CAL[key] || CAL.akad;
      var loc = ((W.venue && W.venue.name) || "") + ", " + ((W.venue && W.venue.address) || "");
      var url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent(meta.title)
        + "&dates=" + gcalStamp(ev.start) + "/" + gcalStamp(ev.end)
        + "&details=" + encodeURIComponent(meta.det + "\n\n" + mapsUrl)
        + "&location=" + encodeURIComponent(loc)
        + "&ctz=Asia/Jakarta";
      window.open(url, "_blank", "noopener");
    });
  });

  /* ---------------------------------------------------------
     COUNTDOWN
     --------------------------------------------------------- */
  var target = new Date((W.akad && W.akad.start) || "2026-11-28T08:00:00+07:00").getTime();
  var cd = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
  var clock = $("#clock");
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      cd.d.textContent = cd.h.textContent = cd.m.textContent = cd.s.textContent = "00";
      clock.classList.remove("is-live");
      var sub = $(".countdown__sub");
      if (sub) sub.textContent = "Alhamdulillah, hari itu telah tiba";
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cd.m.textContent = pad(Math.floor(s % 3600 / 60));
    cd.s.textContent = pad(s % 60);
  }
  clock.classList.add("is-live");
  tick();
  var timer = setInterval(tick, 1000);

  /* ---------------------------------------------------------
     INSTAGRAM BUTTONS
     --------------------------------------------------------- */
  function addIg(sel, handle) {
    if (!handle) return;
    var a = document.createElement("a");
    a.className = "person__ig";
    a.href = "https://instagram.com/" + handle.replace(/^@/, "");
    a.target = "_blank"; a.rel = "noopener";
    a.textContent = "@" + handle.replace(/^@/, "");
    $(sel + " .person__body").appendChild(a);
  }
  addIg("#personGroom", W.groom && W.groom.instagram);
  addIg("#personBride", W.bride && W.bride.instagram);

  /* ---------------------------------------------------------
     GALLERY RAILS + LIGHTBOX
     --------------------------------------------------------- */
  var flat = [];
  var railsEl = $("#rails");
  (W.gallery || []).forEach(function (rail) {
    var wrap = document.createElement("div");
    wrap.className = "rail rv";
    var h = document.createElement("h3");
    h.className = "rail__title";
    h.textContent = rail.title;
    var track = document.createElement("div");
    track.className = "rail__track";

    (rail.photos || []).forEach(function (ph) {
      var idx = flat.length;
      flat.push(ph);
      var b = document.createElement("button");
      b.className = "card";
      b.type = "button";
      b.setAttribute("aria-label", "Lihat foto: " + (ph.caption || "foto"));
      b.dataset.i = idx;
      b.innerHTML =
        '<img src="' + ph.src + '" alt="' + esc(ph.caption || "") + '" loading="lazy" decoding="async">' +
        '<span class="card__hd">HD</span>' +
        '<span class="card__cap">' + esc(ph.caption || "") + "</span>";
      b.addEventListener("click", function () { openLb(idx); });
      track.appendChild(b);
    });

    wrap.appendChild(h); wrap.appendChild(track);
    railsEl.appendChild(wrap);
  });

  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbI = 0;
  function openLb(i) {
    lbI = (i + flat.length) % flat.length;
    lbImg.src = flat[lbI].src;
    lbImg.alt = flat[lbI].caption || "";
    lbCap.textContent = flat[lbI].caption || "";
    if (lb.hidden) { lb.hidden = false; lockScroll(); }
  }
  function closeLb() { lb.hidden = true; unlockScroll(); }
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", function () { openLb(lbI - 1); });
  $("#lbNext").addEventListener("click", function () { openLb(lbI + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  // swipe
  var tx = 0;
  lb.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) openLb(lbI + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------------------------------------------------------
     TRAILER
     --------------------------------------------------------- */
  var tr = W.trailer || {};
  var trailerSec = $("#trailer"), vmodal = $("#vmodal"), vmBox = $("#vmBox");
  var hasTrailer = !!(tr.youtubeId || tr.file);

  if (hasTrailer) {
    trailerSec.hidden = false;
    if (tr.thumb) $("#trailerThumb").src = tr.thumb;
  } else {
    $$("[data-trailer-link]").forEach(function (a) { a.setAttribute("href", "#gallery"); });
  }

  $("#playTrailer").addEventListener("click", function () {
    if (tr.youtubeId) {
      vmBox.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + tr.youtubeId +
        '?autoplay=1&rel=0" title="Official trailer" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
    } else if (tr.file) {
      vmBox.innerHTML = '<video src="' + tr.file + '" controls autoplay playsinline></video>';
    } else { return; }
    vmodal.hidden = false;
    lockScroll();
    if (!audio.paused) { audio.pause(); setPaused(true); }
  });
  function closeVm() {
    vmodal.hidden = true; vmBox.innerHTML = "";
    unlockScroll();
  }
  $("#vmClose").addEventListener("click", closeVm);
  vmodal.addEventListener("click", function (e) { if (e.target === vmodal) closeVm(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (!lb.hidden) closeLb(); if (!vmodal.hidden) closeVm(); }
    if (!lb.hidden && e.key === "ArrowRight") openLb(lbI + 1);
    if (!lb.hidden && e.key === "ArrowLeft") openLb(lbI - 1);
  });

  /* ---------------------------------------------------------
     GIFT CARDS
     --------------------------------------------------------- */
  function copy(text, msg) {
    var done = function () { toast(msg || "Tersalin"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); }
      catch (err) { toast("Salin manual: " + text); }
      document.body.removeChild(ta);
    }
  }

  var giftGrid = $("#giftGrid");
  (W.banks || []).forEach(function (b) {
    var el = document.createElement("div");
    el.className = "bank rv";
    el.innerHTML =
      '<p class="bank__logo">' + esc(b.bank) + "</p>" +
      '<p class="bank__num">' + esc(b.number) + "</p>" +
      '<p class="bank__name">a.n. ' + esc(b.name) + "</p>" +
      '<div class="bank__row"><button class="btn btn--ghost btn--sm" type="button">Copy account number</button></div>';
    el.querySelector("button").addEventListener("click", function () {
      copy(String(b.number).replace(/\s|-/g, ""), "Nomor rekening tersalin");
    });
    giftGrid.appendChild(el);
  });

  if (W.gift && W.gift.address) {
    var g = document.createElement("div");
    g.className = "bank rv";
    g.innerHTML =
      '<p class="bank__logo">Send a physical gift</p>' +
      '<p class="bank__name" style="letter-spacing:.06em;text-transform:none;font-size:14px;color:#f5f3ee;margin-bottom:6px">' + esc(W.gift.recipient) + "</p>" +
      '<p class="bank__name" style="letter-spacing:.02em;text-transform:none;font-size:13.5px;line-height:1.6">' + esc(W.gift.address) + "</p>" +
      '<div class="bank__row"><button class="btn btn--ghost btn--sm" type="button">Copy address</button></div>';
    g.querySelector("button").addEventListener("click", function () {
      copy(W.gift.recipient + "\n" + W.gift.address, "Alamat tersalin");
    });
    giftGrid.appendChild(g);
  }

  /* ---------------------------------------------------------
     BACKEND (Google Apps Script via JSONP — no CORS issues)
     --------------------------------------------------------- */
  var API = W.apiUrl || "";
  var jsonpN = 0;

  function jsonp(params) {
    return new Promise(function (resolve, reject) {
      if (!API) { reject(new Error("no-api")); return; }
      var cb = "__we_cb_" + (++jsonpN) + "_" + Date.now();
      var qs = Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      }).join("&");

      var s = document.createElement("script");
      var to = setTimeout(function () { cleanup(); reject(new Error("timeout")); }, 15000);

      window[cb] = function (data) { cleanup(); resolve(data); };
      function cleanup() {
        clearTimeout(to);
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        if (s.parentNode) s.parentNode.removeChild(s);
      }
      s.onerror = function () { cleanup(); reject(new Error("network")); };
      s.src = API + (API.indexOf("?") > -1 ? "&" : "?") + qs + "&callback=" + cb;
      document.head.appendChild(s);
    });
  }

  /* ---------------------------------------------------------
     RSVP
     --------------------------------------------------------- */
  var form = $("#rsvpForm"), status = $("#rsvpStatus"), submitBtn = $("#rsvpSubmit");
  if (guest) $("#fName").value = guest;

  var guestsField = $("#guestsField");
  function syncGuests() {
    var att = form.querySelector('input[name="attendance"]:checked').value;
    guestsField.style.display = att === "Hadir" ? "" : "none";
  }
  $$('input[name="attendance"]').forEach(function (r) { r.addEventListener("change", syncGuests); });
  syncGuests();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#fName").value.trim();
    if (!name) { status.textContent = "Mohon isi nama Anda."; status.className = "form__status is-err"; $("#fName").focus(); return; }

    var payload = {
      action: "submit",
      name: name,
      attendance: form.querySelector('input[name="attendance"]:checked').value,
      guests: guestsField.style.display === "none" ? "0" : $("#fGuests").value,
      message: $("#fMessage").value.trim()
    };

    submitBtn.disabled = true;
    status.className = "form__status";
    status.textContent = "Mengirim…";

    var finish = function (ok) {
      submitBtn.disabled = false;
      if (!ok) {
        status.className = "form__status is-err";
        status.textContent = "Gagal mengirim. Periksa koneksi lalu coba lagi.";
        return;
      }
      form.classList.add("is-sent");
      var done = document.createElement("div");
      done.className = "rsvp__done";
      done.innerHTML =
        "<h3>Terima kasih, " + payload.name.replace(/[<>]/g, "") + ".</h3>" +
        "<p>Konfirmasi Anda sudah kami terima. Sampai jumpa di hari bahagia kami.</p>";
      form.parentNode.insertBefore(done, form);
      if (payload.message) prependWish({ name: payload.name, message: payload.message, stars: 5 });
    };

    if (!API) { setTimeout(function () { finish(true); toast("Mode demo — belum terhubung ke database"); }, 700); return; }
    jsonp(payload).then(function (r) { finish(!r || r.status !== "error"); }, function () { finish(false); });
  });

  /* ---------------------------------------------------------
     WISHES
     --------------------------------------------------------- */
  var wishList = $("#wishList");
  function stars(n) { n = Math.max(1, Math.min(5, n || 5)); return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function wishNode(w) {
    var el = document.createElement("article");
    el.className = "wish";
    el.innerHTML =
      '<p class="wish__stars">' + stars(w.stars) + "</p>" +
      '<p class="wish__msg">' + esc(w.message) + "</p>" +
      '<p class="wish__by">— <b>' + esc(w.name || "Tamu") + "</b></p>";
    return el;
  }
  function renderWishes(list) {
    wishList.innerHTML = "";
    if (!list.length) {
      wishList.innerHTML = '<p class="wishes__empty">Belum ada ucapan. Jadilah yang pertama lewat form RSVP di atas.</p>';
      return;
    }
    list.forEach(function (w) { wishList.appendChild(wishNode(w)); });
  }
  function prependWish(w) {
    var empty = wishList.querySelector(".wishes__empty");
    if (empty) empty.remove();
    wishList.insertBefore(wishNode(w), wishList.firstChild);
  }

  renderWishes(W.seedWishes || []);
  if (API) {
    jsonp({ action: "list" }).then(function (r) {
      var items = (r && (r.data || r.wishes)) || [];
      items = items.filter(function (x) { return x && x.message; });
      if (items.length) renderWishes(items.reverse());
    }, function () { /* keep seed wishes */ });
  }

  /* ---------------------------------------------------------
     SHARE
     --------------------------------------------------------- */
  $("#shareBtn").addEventListener("click", function () {
    var url = location.origin + location.pathname;
    var text = "Undangan pernikahan " + G.full + " & " + B.full + " — Sabtu, 28 November 2026, " + V.name + ".";
    if (navigator.share) {
      navigator.share({ title: G.short + " & " + B.short, text: text, url: url }).catch(function () { });
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + url), "_blank", "noopener");
    }
  });

  /* ---------------------------------------------------------
     REVEAL ON SCROLL + CREDITS ROLL
     --------------------------------------------------------- */
  $$(".section > .label, .section > .h2, .ev, .person, .clock, .verse__id, .quote blockquote, .venue__body, .rail, .bank")
    .forEach(function (el) { el.classList.add("rv"); });

  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".rv").forEach(function (el) { obs.observe(el); });

    var creditsEl = $("#credits");
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { creditsEl.classList.add("is-rolling"); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    cObs.observe(creditsEl);
  } else {
    $$(".rv").forEach(function (el) { el.classList.add("is-in"); });
    $("#credits").classList.add("is-rolling");
  }

})();
