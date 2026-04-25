/* Ali Raza — Portfolio · script.js */

const N8N_CONTACT_WEBHOOK = "https://clientautomations.app.n8n.cloud/webhook/1a309fd6-4f6d-469c-a706-ca721a1a53cb";
const N8N_CHATBOT_WEBHOOK = "https://clientautomations.app.n8n.cloud/webhook/fbb604a6-368c-4c65-8b77-abf80ac0b00e";

(() => {

  /* ── Rate limiters ── */
  let lastChatTime = 0;
  let lastFormTime = 0;
  const CHAT_COOLDOWN  = 3000;
  const FORM_COOLDOWN  = 30000;

  /* ── Sanitize input ── */
  const sanitize = str =>
    String(str).replace(/<[^>]*>/g, '').trim().slice(0, 1500);

  /* ── Soft cursor ── */
  const cur = document.querySelector('.cursor');
  if (cur && matchMedia('(hover:hover)').matches) {
    let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      cur.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .project, input, textarea')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cur.classList.add('hover'));
        el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
      });
  }

  /* ── Magnetic buttons ── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width/2)*.15}px, ${(e.clientY - r.top - r.height/2)*.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ── Count-up stat ── */
  const num = document.querySelector('.stat-num[data-count]');
  if (num) {
    const target = parseInt(num.dataset.count, 10);
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      let n = 0;
      const step = Math.max(1, Math.round(target / 40));
      const t = setInterval(() => {
        n = Math.min(target, n + step);
        num.textContent = n + '+';
        if (n >= target) clearInterval(t);
      }, 28);
      obs.disconnect();
    });
    obs.observe(num);
  }

  /* ── Mobile menu ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mmLinks     = document.querySelectorAll('.mm-link, .mm-cta');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mmLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  /* ── Project modal ── */
  const projects = {
    1: {
      title: 'AI-Powered Smart Lead System — Auto Score, Follow-Up & CRM',
      tags: ['Lead Gen', 'CRM', 'Email'],
      desc: 'The moment a lead fills a form, the system scores them URGENT, WARM, or COLD using AI, sends the owner an instant priority alert, logs the lead to Google Sheets, sends the client a branded confirmation email, then follows up automatically on Day 1 and Day 3. A daily 9AM summary keeps the owner informed. Zero manual work — every lead handled in seconds.',
      price: '$200 – $400', duration: '1 – 7 days', industry: 'Business Automation',
      img: 'Lead___follow_up.png', alt: 'AI-Powered Smart Lead System workflow in n8n'
    },
    2: {
      title: 'AI-Powered Inbox Manager — Classify, Summarize & Reply',
      tags: ['Gmail', 'Productivity'],
      desc: 'Monitors Gmail 24/7. Every email is read, classified by urgency and type (Urgent, Newsletter, App, Spam, etc.), labeled automatically, and summarized. Urgent emails trigger a Slack alert. Newsletters get summarized in bulk. Calendar events are extracted and added automatically. Saves 1–2 hours daily — no important email ever missed.',
      price: '$150 – $300', duration: '1 – 5 days', industry: 'Productivity',
      img: 'Inobx_Manager.png', alt: 'AI-Powered Inbox Manager n8n workflow'
    },
    3: {
      title: 'AI LinkedIn Content Engine — Write & Publish Automatically',
      tags: ['LinkedIn', 'Content'],
      desc: 'Upload an idea or screenshot to Google Sheets — the system writes a high-quality LinkedIn post in your voice using AI, then publishes it via the LinkedIn API automatically. No scheduling tool needed. Consistent brand presence with zero daily effort.',
      price: '$100 – $250', duration: '1 – 3 days', industry: 'Social Media Marketing',
      img: 'AI_AUTOMAITON_WORKFLOW_LINKEDIN_SOCIAL_MEDIA_BUSINESS_N8N2.png', alt: 'AI LinkedIn Content Engine n8n workflow'
    }
  };

  const modal = document.getElementById('projectModal');

  const openModal = id => {
    const p = projects[id]; if (!p) return;
    document.getElementById('modalTitle').textContent    = p.title;
    document.getElementById('modalDesc').textContent     = p.desc;
    document.getElementById('modalPrice').textContent    = p.price;
    document.getElementById('modalDuration').textContent = p.duration;
    document.getElementById('modalIndustry').textContent = p.industry;
    document.getElementById('modalThumb').innerHTML      = `<img src="${p.img}" alt="${p.alt}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" />`;
    document.getElementById('modalTags').innerHTML       = p.tags.map(t => `<span>${t}</span>`).join('');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.project); } });
  });
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Contact form ── */
  const form      = document.getElementById('contactForm');
  const status    = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type=submit]');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status';

    const now = Date.now();
    if (now - lastFormTime < FORM_COOLDOWN) {
      status.textContent = 'Please wait a moment before sending again.';
      status.classList.add('err'); return;
    }

    const data    = new FormData(form);
    const name    = sanitize(data.get('name') || '').slice(0, 100);
    const email   = sanitize(data.get('email') || '').slice(0, 200);
    const message = sanitize(data.get('message') || '').slice(0, 1500);

    if (!name || !email || !message) { status.textContent = 'Please fill in all fields.'; status.classList.add('err'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.textContent = 'Please enter a valid email address.'; status.classList.add('err'); return; }

    submitBtn.classList.add('is-loading');
    try {
      const res = await fetch(N8N_CONTACT_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-portfolio-token': 'portfolio-2026'
        },
        body: JSON.stringify({ type: 'contact_lead', name, email, message, source: 'portfolio_website', timestamp: new Date().toISOString() })
      });
      if (!res.ok) throw new Error('Network error');
      lastFormTime = Date.now();
      form.reset();
      status.textContent = 'Sent. I\'ll reply within a few hours.';
      status.classList.add('ok');
    } catch {
      status.textContent = 'Could not send — email aiautomationexpert786@gmail.com directly.';
      status.classList.add('err');
    } finally {
      submitBtn.classList.remove('is-loading');
    }
  });

  /* ── Chatbot ── */
  const fab       = document.getElementById('chatFab');
  const panel     = document.getElementById('chatPanel');
  const closeChat = document.getElementById('chatX');
  const log       = document.getElementById('chatLog');
  const chatForm  = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  const SID_KEY = 'ali_chat_sid';
  let sessionId = sessionStorage.getItem(SID_KEY);
  if (!sessionId) {
    sessionId = 'ses_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem(SID_KEY, sessionId);
  }
  let msgCount = 0;

  const addBubble = (text, who = 'bot') => {
    const b = document.createElement('div');
    b.className = 'bubble ' + who;
    b.textContent = text;
    log.appendChild(b); log.scrollTop = log.scrollHeight;
    return b;
  };
  const addTyping = () => {
    const b = document.createElement('div');
    b.className = 'bubble bot typing';
    b.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(b); log.scrollTop = log.scrollHeight;
    return b;
  };

  const openChatPanel = () => {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.style.display = 'none';
    if (!log.children.length) {
      addBubble("Hi — I'm ARIA, Ali's assistant. Ask me about his services, pricing, or availability.", 'bot');
    }
    setTimeout(() => chatInput.focus(), 200);
  };
  const hideChatPanel = () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.style.display = '';
  };

  fab.addEventListener('click', openChatPanel);
  closeChat.addEventListener('click', hideChatPanel);

  chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = sanitize(chatInput.value).slice(0, 500);
    if (!msg) return;

    const now = Date.now();
    if (now - lastChatTime < CHAT_COOLDOWN) return;
    lastChatTime = now;

    addBubble(msg, 'me');
    chatInput.value = '';
    msgCount++;

    const typing = addTyping();
    try {
      const res  = await fetch(N8N_CHATBOT_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-portfolio-token': 'portfolio-2026'
        },
        body: JSON.stringify({ type: 'chat_message', session_id: sessionId, message: msg, history_count: msgCount, timestamp: new Date().toISOString() })
      });
      const data = await res.json().catch(() => ({}));
      typing.remove();
      addBubble(data.reply || data.output || data.message || 'Got your message — Ali will follow up soon.', 'bot');
      msgCount++;
    } catch {
      typing.remove();
      addBubble("I'm offline right now. Email Ali at aiautomationexpert786@gmail.com — he replies fast.", 'bot');
    }
  });

})();
