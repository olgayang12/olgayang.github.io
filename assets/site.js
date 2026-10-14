(function () {
  var dlg = document.querySelector('.lb');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var img = dlg.querySelector('img');
  var count = dlg.querySelector('.lb-count');
  var list = [], idx = 0;

  function show(i) {
    idx = (i + list.length) % list.length;
    img.src = list[idx].href;
    var thumb = list[idx].querySelector('img');
    img.alt = thumb ? thumb.alt : '';
    var multi = list.length > 1;
    dlg.querySelector('.lb-prev').hidden = !multi;
    dlg.querySelector('.lb-next').hidden = !multi;
    count.textContent = multi ? (idx + 1) + ' / ' + list.length : '';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-lb]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    list = a.hasAttribute('data-lb-solo') ? [a] : Array.prototype.slice.call(document.querySelectorAll('a[data-lb]:not([data-lb-solo])'));
    show(list.indexOf(a));
    dlg.showModal();
  });
  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { img.removeAttribute('src'); });
  document.addEventListener('keydown', function (e) {
    if (!dlg.open) return;
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

/* Flipbook: leaves turn around the spine; click the right half to go forward, left half to go back. */
(function () {
  document.querySelectorAll('[data-book]').forEach(function (book) {
    var leaves = Array.prototype.slice.call(book.querySelectorAll('.leaf'));
    var inner = book.querySelector('.book-inner');
    var prev = book.querySelector('.book-prev'), next = book.querySelector('.book-next');
    var count = book.querySelector('.book-count');
    var total = leaves.length * 2, k = 0;
    function render() {
      leaves.forEach(function (lf, i) {
        var turned = i < k;
        lf.classList.toggle('turned', turned);
        lf.style.zIndex = turned ? (10 + i) : (leaves.length - i);
      });
      book.setAttribute('data-state', k === 0 ? 'start' : (k === leaves.length ? 'end' : 'mid'));
      prev.disabled = k === 0; next.disabled = k === leaves.length;
      count.textContent = k === 0 ? '封面' : (k === leaves.length ? '封底' : (2 * k) + '–' + (2 * k + 1) + ' / ' + total);
    }
    function go(d) { k = Math.max(0, Math.min(leaves.length, k + d)); render(); }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    inner.addEventListener('click', function (e) {
      var r = inner.getBoundingClientRect();
      go(e.clientX > r.left + r.width / 2 ? 1 : -1);
    });
    book.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    });
    inner.setAttribute('data-cursor', '翻頁');
    render();
  });
})();

/* Panorama: drag with the mouse to scroll sideways. */
(function () {
  document.querySelectorAll('.pan').forEach(function (pan) {
    var down = false, sx = 0, sl = 0;
    pan.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; sx = e.clientX; sl = pan.scrollLeft; pan.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) { if (down) pan.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener('pointerup', function () { down = false; pan.classList.remove('dragging'); });
    pan.setAttribute('data-cursor', '拖曳');
  });
})();

/* List / grid switch, remembered per visitor. */
(function () {
  var works = document.querySelector('.works');
  if (!works) return;
  var btns = works.querySelectorAll('.view button');
  function set(v) {
    works.classList.toggle('is-grid', v === 'grid');
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === v)); });
    try { localStorage.setItem('oy-view', v); } catch (e) {}
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-view')); }); });
  var saved = null;
  try { saved = localStorage.getItem('oy-view'); } catch (e) {}
  if (saved === 'grid') set('grid');
})();

/* Name: letters light up like a highlighter as the pointer passes over them. */
(function () {
  var letters = document.querySelectorAll('.name .l');
  if (!letters.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function lite(el) {
    el.classList.add('lit');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('lit'); }, 700);
  }
  letters.forEach(function (el) { el.addEventListener('pointerenter', function () { lite(el); }); });
  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0], el = t && document.elementFromPoint(t.clientX, t.clientY);
    if (el && el.classList && el.classList.contains('l')) lite(el);
  }, { passive: true });
  // a single opening sweep so first-time visitors see it is alive
  letters.forEach(function (el, i) { setTimeout(function () { lite(el); }, 300 + i * 70); });
})();

/* Reading progress bar. */
(function () {
  var bar = document.querySelector('.progress');
  if (!bar) return;
  function upd() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
  }
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
})();

/* Pointer: a highlighter dot, and a floating preview of the work under it in list view. */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c = document.querySelector('.cursor'), peek = document.querySelector('.peek');
  var pimg = peek && peek.querySelector('img');
  var works = document.querySelector('.works');
  if (!reduce && c) document.documentElement.classList.add('has-cursor');
  var x = -100, y = -100, tx = x, ty = y, px = x, py = y, showPeek = false;
  addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; if (c) c.classList.remove('hide'); }, { passive: true });
  document.addEventListener('pointerleave', function () { if (c) c.classList.add('hide'); });
  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest ? e.target : null;
    var row = t && t.closest('.row a');
    var link = t && t.closest('a, button, [data-cursor]');
    if (c) c.classList.toggle('big', !!link && !row);
    if (c) c.classList.toggle('off', !!row && !(works && works.classList.contains('is-grid')));
    if (row && pimg && !(works && works.classList.contains('is-grid'))) {
      var src = row.getAttribute('data-peek');
      if (pimg.getAttribute('src') !== src) pimg.setAttribute('src', src);
      if (!showPeek) { px = tx; py = ty; }
      showPeek = true; peek.classList.add('on');
    } else if (showPeek) { showPeek = false; peek.classList.remove('on'); }
  });
  (function loop() {
    x += (tx - x) * 0.35; y += (ty - y) * 0.35;
    px += (tx - px) * (reduce ? 1 : 0.16); py += (ty - py) * (reduce ? 1 : 0.16);
    if (c) c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    if (peek) {
      var w = peek.offsetWidth, h = peek.offsetHeight;
      var lx = Math.min(Math.max(px + 40, innerWidth * 0.42), innerWidth - w - 24), ly = Math.min(Math.max(py - h / 2, 70), innerHeight - h - 16);
      peek.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
    }
    requestAnimationFrame(loop);
  })();
})();

/* Keep the name exactly as wide as the page, whatever font actually loads. */
(function () {
  var name = document.querySelector('.name');
  if (!name) return;
  function fit() {
    name.style.fontSize = '';
    var cs = parseFloat(getComputedStyle(name).fontSize);
    var inner = name.firstElementChild;
    var w = inner.getBoundingClientRect().width, avail = name.clientWidth;
    if (w > 0) name.style.fontSize = Math.min(cs * avail / w * 0.995, 420) + 'px';
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  addEventListener('resize', fit);
})();
