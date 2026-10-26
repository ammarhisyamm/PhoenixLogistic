/* Phoenix Global Logistics — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Configuration. Fill these in when the services are ready.
     ------------------------------------------------------------------ */
  var CONFIG = {
    // Public Transvirtual tracking page for a consignment. Use {consignment}
    // where the number goes, e.g. 'https://example.transvirtual.com/track/{consignment}'.
    // Leave empty until the tracking widget link is confirmed.
    trackingUrl: '',
    // Form endpoint that accepts a JSON POST (Formspree, Netlify, your own API).
    // Leave empty and the quote form falls back to composing an email.
    quoteEndpoint: '',
    email: 'import@phoenixgloballogistics.com.au'
  };

  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var T = {
    en: {
      needCon: 'Enter your consignment number to track it.',
      opening: 'Opening tracking for ',
      pendingTitle: 'Online tracking is being connected.',
      pendingBody: 'Until it’s live, email us your consignment number and we’ll send you the latest scan and proof of delivery.',
      copy: 'Copy', copied: 'Copied', copyFail: 'Select and copy',
      needName: 'Add your name so we know who to reply to.',
      needEmail: 'Add an email address we can send the quote to.',
      badEmail: 'That email address doesn’t look right. Check for typos.',
      sentTitle: 'Thanks, your request is with us.',
      sentBody: 'We’ll reply to ',
      mailTitle: 'Your request is ready to send.',
      mailBody: 'Send it to our team by email. Open it in your email app, or copy the details below.',
      openMail: 'Open in email app',
      copyDetails: 'Copy details',
      sendFail: 'We couldn’t send that just now. Email the details below instead.',
      subject: 'Quote request',
      openMenu: 'Open menu', closeMenu: 'Close menu'
    },
    zh: {
      needCon: '请输入运单号进行查询。',
      opening: '正在打开运单 ',
      pendingTitle: '在线追踪功能正在接入中。',
      pendingBody: '上线前，请将运单号发送至我们的邮箱，我们会回复最新扫描记录及签收证明。',
      copy: '复制', copied: '已复制', copyFail: '请手动复制',
      needName: '请填写您的姓名。',
      needEmail: '请填写用于接收报价的邮箱。',
      badEmail: '邮箱格式似乎不正确，请检查。',
      sentTitle: '谢谢，我们已收到您的询价。',
      sentBody: '我们将回复至 ',
      mailTitle: '您的询价已准备好。',
      mailBody: '请通过邮件发送给我们：在邮件应用中打开，或复制以下内容。',
      openMail: '在邮件应用中打开',
      copyDetails: '复制内容',
      sendFail: '暂时无法提交，请将以下内容通过邮件发送给我们。',
      subject: '询价',
      openMenu: '打开菜单', closeMenu: '关闭菜单'
    }
  }[lang === 'zh' ? 'zh' : 'en'];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Header: transparent over the hero, solid after it; hides while scrolling
     down and comes back as soon as you scroll up. */
  var header = $('.site-header');
  var menuBtn = $('.menu-btn');
  var hero = $('.hero');
  var lastY = window.scrollY;
  function onScroll() {
    if (!header) return;
    var y = window.scrollY;
    var heroEnd = hero ? hero.offsetHeight - header.offsetHeight : 0;
    var open = header.classList.contains('is-open');
    header.classList.toggle('is-over', !!hero && y < heroEnd - 40 && !open);
    var goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (open || y < heroEnd) header.classList.remove('is-hidden');
    else if (goingDown) header.classList.add('is-hidden');
    else if (goingUp) header.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  function setMenu(open) {
    if (!header || !menuBtn) return;
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? T.closeMenu : T.openMenu);
    onScroll();
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    $all('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Tabs in the quick tools bar; the indicator slides via data-active */
  var tabs = $all('[role="tab"]');
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    if (list) list.setAttribute('data-active', String(tabs.indexOf(tab)));
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        selectTab(next, true);
      }
    });
  });

  /* Copy helpers */
  function copyText(text, btn) {
    var label = btn.textContent;
    function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = label; }, 1800); }
    try {
      navigator.clipboard.writeText(text).then(function () { done(T.copied); }, function () { done(T.copyFail); });
    } catch (err) { done(T.copyFail); }
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy');
    if (text === '#quote-summary') { var pre = $('#quote-summary'); text = pre ? pre.textContent : ''; }
    copyText(text, btn);
  });

  /* Tracking */
  $all('[data-track-form]').forEach(function (form) {
    var input = $('input[name="consignment"]', form);
    var msg = $('.track-msg', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var con = (input.value || '').trim().toUpperCase().replace(/\s+/g, '');
      input.value = con;
      if (!con) {
        input.setAttribute('aria-invalid', 'true');
        msg.innerHTML = '<p class="field-error">' + esc(T.needCon) + '</p>';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      if (CONFIG.trackingUrl) {
        var url = CONFIG.trackingUrl.replace('{consignment}', encodeURIComponent(con));
        msg.innerHTML = '<p>' + esc(T.opening) + '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(con) + ' →</a></p>';
        var w = window.open(url, '_blank', 'noopener');
        if (!w) $('a', msg).focus();
        return;
      }
      msg.innerHTML =
        '<div class="notice"><strong>' + esc(T.pendingTitle) + '</strong>' + esc(T.pendingBody) +
        '<div class="copy-row"><code>' + esc(CONFIG.email) + '</code>' +
        '<button class="copy-btn" type="button" data-copy="' + esc(CONFIG.email) + '">' + esc(T.copy) + '</button></div></div>';
    });
    input.addEventListener('input', function () { input.removeAttribute('aria-invalid'); });
  });

  /* Quote helpers */
  var quoteForm = $('#quote-form');
  function setQuoteType(type) {
    var sel = $('#q-type');
    if (sel && type) {
      $all('option', sel).forEach(function (o) { if (o.value === type || o.textContent === type) sel.value = o.value; });
    }
    if (type && /amazon/i.test(type)) {
      var chip = $('input[name="service"][value="Amazon FBA"]');
      if (chip) chip.checked = true;
    }
  }
  $all('[data-quote-type]').forEach(function (a) {
    a.addEventListener('click', function () { setQuoteType(a.getAttribute('data-quote-type')); });
  });

  var quick = $('[data-quick-quote]');
  if (quick && quoteForm) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      $('#q-from').value = $('#qq-from').value;
      $('#q-to').value = $('#qq-to').value;
      var type = $('#qq-type');
      setQuoteType(type.options[type.selectedIndex].value);
      $('#quote').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      setTimeout(function () { $('#q-qty').focus({ preventScroll: true }); }, 450);
    });
  }

  if (quoteForm) {
    var result = $('.quote-result', quoteForm);
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      $all('.field-error', quoteForm).forEach(function (n) { n.remove(); });
      $all('[aria-invalid]', quoteForm).forEach(function (n) { n.removeAttribute('aria-invalid'); });

      var data = new FormData(quoteForm);
      var name = (data.get('name') || '').trim();
      var email = (data.get('email') || '').trim();
      var errors = [];
      if (!name) errors.push(['q-name', T.needName]);
      if (!email) errors.push(['q-email', T.needEmail]);
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push(['q-email', T.badEmail]);
      if (errors.length) {
        errors.forEach(function (er) {
          var el = document.getElementById(er[0]);
          el.setAttribute('aria-invalid', 'true');
          var p = document.createElement('p'); p.className = 'field-error'; p.textContent = er[1];
          el.parentNode.appendChild(p);
        });
        document.getElementById(errors[0][0]).focus();
        return;
      }

      var services = data.getAll('service').join(', ') || '-';
      var rows = [
        ['Services', services],
        ['Pick-up', data.get('from')], ['Delivery', data.get('to')],
        ['Freight', data.get('type')], ['Quantity', data.get('qty')],
        ['Weight (kg)', data.get('weight')], ['Ready date', data.get('when')],
        ['Notes', data.get('notes')],
        ['Name', name], ['Company', data.get('company')], ['Email', email], ['Phone / WeChat', data.get('phone')]
      ].filter(function (r) { return r[1] && String(r[1]).trim(); });
      var summary = rows.map(function (r) { return r[0] + ': ' + String(r[1]).trim(); }).join('\n');

      function showMailFallback(lead) {
        var mailto = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(T.subject + ' – ' + (data.get('company') || name)) + '&body=' + encodeURIComponent(summary);
        result.innerHTML =
          '<div class="notice"><strong>' + esc(lead || T.mailTitle) + '</strong>' + esc(T.mailBody) +
          '<div class="copy-row"><code>' + esc(CONFIG.email) + '</code>' +
          '<button class="copy-btn" type="button" data-copy="' + esc(CONFIG.email) + '">' + esc(T.copy) + '</button></div>' +
          '<pre id="quote-summary" style="white-space:pre-wrap;font:0.85rem/1.5 var(--body);background:#fff;border:1px solid var(--line);border-radius:4px;padding:10px;margin:12px 0 0">' + esc(summary) + '</pre>' +
          '<div class="copy-row"><a class="btn btn--sm" href="' + esc(mailto) + '">' + esc(T.openMail) + '</a>' +
          '<button class="copy-btn" type="button" data-copy="#quote-summary">' + esc(T.copyDetails) + '</button></div></div>';
        result.querySelector('.notice').scrollIntoView({ block: 'nearest' });
      }

      if (CONFIG.quoteEndpoint) {
        var payload = {}; rows.forEach(function (r) { payload[r[0]] = String(r[1]).trim(); });
        fetch(CONFIG.quoteEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (res) {
          if (!res.ok) throw new Error(res.status);
          result.innerHTML = '<div class="notice notice--ok"><strong>' + esc(T.sentTitle) + '</strong>' + esc(T.sentBody) + esc(email) + '.</div>';
          quoteForm.reset();
        }).catch(function () { showMailFallback(T.sendFail); });
      } else {
        showMailFallback();
      }
    });
  }

  /* Scroll reveals. Elements that come into view together are staggered by
     their order in that batch, so nothing waits on items far off screen. */
  var revealables = $all('[data-reveal], [data-reveal-media]');
  function countUp(el) {
    var target = el.textContent.trim();
    var end = parseInt(target.replace(/,/g, ''), 10);
    if (!end || reduceMotion.matches) return;
    var useComma = target.indexOf(',') > -1;
    var start = null, dur = 1400;
    function fmt(n) { return useComma ? n.toLocaleString('en-AU') : String(n); }
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(frame); else el.textContent = target;
    }
    el.textContent = fmt(0);
    requestAnimationFrame(frame);
  }
  function reveal(el, i) {
    el.style.setProperty('--i', String(Math.min(i, 6)));
    el.classList.add('is-in');
    $all('[data-count]', el).concat(el.hasAttribute('data-count') ? [el] : []).forEach(countUp);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; });
      batch.sort(function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
      batch.forEach(function (el, i) { reveal(el, i); io.unobserve(el); });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  var y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
