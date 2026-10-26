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

  /* Scroll reveals and count-ups. Skipped entirely for reduced motion or old browsers,
     so content is never hidden unless we can bring it back. */
  var motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window;
  if (motionOk) {
    document.documentElement.classList.add('js');

    var mark = function (sel, cls, stagger) {
      $all(sel).forEach(function (el) {
        el.classList.add(cls);
        if (stagger) {
          var i = Array.prototype.indexOf.call(el.parentNode.children, el);
          el.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms');
        }
      });
    };
    mark('.section-head, .track-panel, .carrier-sheet, .prose, .quote-callout, .quote-form, .contact-card, .bridge-route, .cta-band .wrap > *', 'reveal');
    mark('.services > *, .process > *, .fleet-list > *, .industries > *, .checks > li, .track-steps > li, .timeline > li, .bridge-list > li, .amazon-figures > *', 'reveal', true);
    mark('.quality-photo, .about-photo, .cap-photo', 'reveal-img', true);

    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('is-in');
        revealer.unobserve(el);
        // Hand the element back to its own hover transitions once it has landed
        if (el.classList.contains('reveal')) {
          setTimeout(function () { el.classList.remove('reveal', 'is-in'); el.style.removeProperty('--d'); }, 900 + (parseInt(el.style.getPropertyValue('--d'), 10) || 0));
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $all('.reveal, .reveal-img').forEach(function (el) { revealer.observe(el); });

    /* Big numbers count up from zero the first time they're seen */
    var countUp = function (el) {
      var node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      var raw = node.nodeValue, m = raw.match(/[\d,]+/);
      if (!m) return;
      var target = parseInt(m[0].replace(/,/g, ''), 10), start = null;
      var fmt = function (n) { return raw.replace(m[0], n.toLocaleString('en-AU')); };
      node.nodeValue = fmt(0);
      var tick = function (t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / 1400, 1);
        node.nodeValue = fmt(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    var counter = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target);
        counter.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    $all('.proof__num, .fleet-item strong, .amazon-figures strong').forEach(function (el) { counter.observe(el); });
  }

  /* Header: shadow on scroll, mobile menu */
  var header = $('.site-header');
  var menuBtn = $('.menu-btn');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    if (!header || !menuBtn) return;
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? T.closeMenu : T.openMenu);
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    $all('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Tabs in the hero card */
  var tabs = $all('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    tab.parentNode.style.setProperty('--i', tabs.indexOf(tab));
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
      $('#quote').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
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
          '<pre id="quote-summary" style="white-space:pre-wrap;font:0.85rem/1.5 var(--mono);background:#fff;border:1px solid var(--line);border-radius:4px;padding:10px;margin:12px 0 0">' + esc(summary) + '</pre>' +
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

  var y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
