(function () {
  'use strict';

  const nav        = document.getElementById('site-nav');
  const openBtn    = document.getElementById('nav-search-open');
  const closeBtn   = document.getElementById('nav-search-close');
  const input      = document.getElementById('nav-search-input');
  const dropdown   = document.getElementById('search-dropdown');
  const resultsEl  = document.getElementById('search-results');

  if (!openBtn) return;

  let pagefind = null;
  let debounce = null;

  async function initPagefind() {
    if (pagefind) return pagefind;
    try {
      pagefind = await import('/pagefind/pagefind.js');
      await pagefind.init();
      return pagefind;
    } catch (e) {
      console.info('Pagefind index not found — run "hugo && npx pagefind --site public" to build it.');
      return null;
    }
  }

  function openSearch() {
    nav.classList.add('search-open');
    input.value = '';
    resultsEl.innerHTML = '';
    dropdown.classList.remove('visible');
    // pre-load pagefind in the background
    initPagefind();
    // slight delay so the CSS transition finishes before focus
    requestAnimationFrame(() => input.focus());
  }

  function closeSearch() {
    nav.classList.remove('search-open');
    dropdown.classList.remove('visible');
    input.value = '';
    resultsEl.innerHTML = '';
  }

  openBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('search-open') && !nav.contains(e.target)) {
      closeSearch();
    }
  });

  input.addEventListener('input', function () {
    clearTimeout(debounce);
    const query = input.value.trim();

    if (!query) {
      dropdown.classList.remove('visible');
      resultsEl.innerHTML = '';
      return;
    }

    debounce = setTimeout(async function () {
      const pf = await initPagefind();
      if (!pf) {
        resultsEl.innerHTML = '<div class="search-no-results">Search index not built yet.</div>';
        dropdown.classList.add('visible');
        return;
      }

      const search = await pf.search(query);
      const top    = search.results.slice(0, 7);

      if (top.length === 0) {
        resultsEl.innerHTML = '<div class="search-no-results">No results for &ldquo;' + query + '&rdquo;</div>';
        dropdown.classList.add('visible');
        return;
      }

      const data = await Promise.all(top.map(function (r) { return r.data(); }));

      resultsEl.innerHTML = data.map(function (r) {
        return '<a href="' + r.url + '" class="search-result-item">' +
          '<div class="search-result-title">' + (r.meta.title || 'Untitled') + '</div>' +
          '<div class="search-result-excerpt">' + r.excerpt + '</div>' +
          '</a>';
      }).join('');

      dropdown.classList.add('visible');
    }, 200);
  });

  // keyboard navigation through results
  input.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return;
    const items = resultsEl.querySelectorAll('.search-result-item');
    if (!items.length) return;

    const active = resultsEl.querySelector('.search-result-item:focus');
    if (e.key === 'Enter' && active) { active.click(); return; }

    let idx = Array.from(items).indexOf(active);
    if (e.key === 'ArrowDown') idx = Math.min(idx + 1, items.length - 1);
    if (e.key === 'ArrowUp')   idx = Math.max(idx - 1, 0);

    items[idx].focus();
    e.preventDefault();
  });

})();
