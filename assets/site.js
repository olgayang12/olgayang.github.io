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

/* Masonry that keeps left-to-right reading order (CSS columns read top-to-bottom). */
(function () {
  var wall = document.querySelector('.wall');
  if (!wall) return;
  var items = Array.prototype.slice.call(wall.children);
  var current = 0;
  function cols() {
    var w = window.innerWidth;
    return w >= 1800 ? 4 : w >= 1240 ? 3 : w >= 560 ? 2 : 1;
  }
  function layout() {
    var n = cols();
    if (n === current) return;
    current = n;
    wall.innerHTML = '';
    wall.classList.add('js-masonry');
    var columns = [], heights = [];
    for (var i = 0; i < n; i++) {
      var li = document.createElement('li');
      li.className = 'wcol';
      var ul = document.createElement('ul');
      li.appendChild(ul);
      wall.appendChild(li);
      columns.push(ul);
      heights.push(0);
    }
    items.forEach(function (it) {
      var img = it.querySelector('img');
      var ratio = img ? (+img.getAttribute('height') / +img.getAttribute('width')) : 1;
      var k = 0;
      for (var i = 1; i < n; i++) if (heights[i] < heights[k] - 0.05) k = i;
      columns[k].appendChild(it);
      heights[k] += ratio + 0.22;
    });
  }
  layout();
  window.addEventListener('resize', layout);
})();
