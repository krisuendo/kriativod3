
// ======================================================
// 1. SECTION NAVIGATION
//    Syncs: tabs, tree items, breadcrumb, section display
// ======================================================

const fileNames = {
  home:       { file: 'home.tsx',       lang: 'TypeScript React' },
  about:      { file: 'project.js',     lang: 'JavaScript'       },
  skills:     { file: 'skills.html',    lang: 'HTML'             },
  certifications: { file: 'certifications.html', lang: 'HTML'},
  experience: { file: 'experience.ts',  lang: 'TypeScript'       },
  projects:   { file: 'projects.css',   lang: 'CSS'              },
  contact:    { file: 'contact.css',    lang: 'CSS'              },
};

function navigateTo(section) {
  // Guard
  if (!fileNames[section]) return;

  // -- Tabs --
 document.querySelectorAll('.tab').forEach(tab => {
  // Re-open hidden tab if needed
  if (tab.dataset.section === section) {
    tab.style.display = 'flex';
  }
  tab.classList.toggle(
    'active',
    tab.dataset.section === section
  );
});

  // -- Tree items --
  document.querySelectorAll('.tree-item[data-section]').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
  });

  // -- Breadcrumb --
  const bc = document.getElementById('breadcrumbFile');
  if (bc) bc.textContent = fileNames[section].file;

  // -- Status bar language --
  const lang = document.getElementById('statusLang');
  if (lang) lang.textContent = fileNames[section].lang;

  // -- Sections --
  document.querySelectorAll('.editor-section').forEach(s => {
    s.classList.toggle('active', s.id === 'section-' + section);
  });

  // Scroll editor to top on switch
  const editor = document.getElementById('editorMain');
  if (editor) editor.scrollTo({ top: 0, behavior: 'smooth' });
}

// Wire up tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => navigateTo(tab.dataset.section));
});

// Wire up tree items
document.querySelectorAll('.tree-item[data-section]').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.section));
});

// ======================================================
// TAB CLOSE FUNCTIONALITY
// ======================================================

document.querySelectorAll('.tab-close').forEach(closeBtn => {
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const tab = closeBtn.closest('.tab');
    if (!tab) return;
    // Prevent permanent tabs from closing
    if (tab.classList.contains('tab--permanent')) {
      return;
    }
    const wasActive = tab.classList.contains('active');

    // Hide tab
    tab.style.display = 'none';

    // If active tab was closed,
    // switch to first visible tab
    if (wasActive) {
      const firstVisibleTab = document.querySelector(
        '.tab:not([style*="display: none"])'
      );
      if (firstVisibleTab) {
        navigateTo(firstVisibleTab.dataset.section);
      }
    }
  });
});

// Explorer toggle (sidebar icon)
const explorerToggle = document.getElementById('explorerToggle');
const explorer = document.getElementById('explorer');
explorerToggle && explorerToggle.addEventListener('click', () => {
  explorer.classList.toggle('collapsed');
  explorerToggle.classList.toggle('active');
});

/* =========================================
   COPILOT PANEL TOGGLE
========================================= */

const copilotPanel =
  document.getElementById("copilotPanel");

/* SIDEBAR COPILOT BUTTON */
const sidebarCopilotBtn =
  document.getElementById("copilotToggle");

/* STATUS BAR COPILOT BUTTON */
const statusCopilotBtn =
  document.getElementById("statusCopilot");

function toggleCopilot() {
  copilotPanel.classList.toggle("collapsed");
}

/* BOTH BUTTONS OPEN CHAT */
sidebarCopilotBtn?.addEventListener(
  "click",
  toggleCopilot
);

statusCopilotBtn?.addEventListener(
  "click",
  toggleCopilot
);

/* CLOSE BUTTON */
const copilotClose =
  document.getElementById("copilotClose");

copilotClose?.addEventListener(
  "click",
  () => {
    copilotPanel.classList.add(
      "collapsed"
    );
  }
);

// ======================================================
// 2. TYPING ANIMATION
//    Cycles through multiple subtitle strings
// ======================================================

const typingEl = document.getElementById('typingText');
const phrases = [
  "Crafting code with a smile.",
  "Let's build something awesome.",
  "Full Stack Developer.",
  "React • Node.js • TypeScript.",
  "Turning ideas into reality.",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer;

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  if (typingEl) typingEl.textContent = current.slice(0, charIndex);

  let speed = isDeleting ? 45 : 75;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  typingTimer = setTimeout(type, speed);
}

// Start typing after a short delay
setTimeout(type, 800);


// ======================================================
// 3. STATUS BAR CLOCK
// ======================================================

function updateClock() {
  const el = document.getElementById('statusTime');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${h}:${m}`;
}

updateClock();
setInterval(updateClock, 10000);

/* =========================
   TIMELINE SCROLL EFFECT
========================= */

const timelineRows = document.querySelectorAll('.timeline-row');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.01
});

timelineRows.forEach(row => {
  timelineObserver.observe(row);
});

// ======================================================
// 4. CONTACT FORM SEND HANDLER
// ======================================================

function handleSend() {
  const name    = document.getElementById('contactName')?.value.trim();
  const email   = document.getElementById('contactEmail')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();
  const btn     = document.getElementById('sendBtn');

  if (!name || !email || !message) {
    // Shake the button for visual feedback
    btn && btn.classList.add('shake');
    setTimeout(() => btn && btn.classList.remove('shake'), 600);
    showToast('Please fill in the required fields.', 'error');
    return;
  }

  // Simulate sending
  btn && (btn.textContent = 'Sending...');
  btn && (btn.disabled = true);

  setTimeout(() => {
    btn && (btn.textContent = '✓ Message Sent!');
    showToast('Message sent! I\'ll get back to you soon.', 'success');

    // Reset fields after a moment
    setTimeout(() => {
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      if (document.getElementById('contactSubject')) document.getElementById('contactSubject').value = '';
      document.getElementById('contactMessage').value = '';
      btn && (btn.textContent = 'Send Message');
      btn && (btn.disabled = false);
    }, 2200);
  }, 1400);
}


// ======================================================
// 5. TOAST NOTIFICATIONS
// ======================================================

function showToast(message, type = 'info') {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('toast--show'));

  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Inject toast styles dynamically
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 40px; right: 24px;
    background: #252538;
    border: 1px solid #2e2e45;
    border-left: 3px solid #7c3aed;
    color: #cdd6f4;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 340px;
  }
  .toast--show { opacity: 1; transform: translateY(0); }
  .toast--success { border-left-color: #a6e3a1; }
  .toast--error   { border-left-color: #f38ba8; }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-6px); }
    40%,80% { transform: translateX(6px); }
  }
  .shake { animation: shake 0.5s ease; }
`;
document.head.appendChild(toastStyle);


// ======================================================
// 6. SKILL BAR INTERSECTION OBSERVER
//    Animates bars only when they scroll into view
// ======================================================

const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Reset and replay animation
      const el = entry.target;
      el.style.animation = 'none';
      requestAnimationFrame(() => {
        el.style.animation = '';
      });
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.2 });

skillFills.forEach(fill => skillObserver.observe(fill));


// ======================================================
// 7. KEYBOARD SHORTCUTS (Ctrl+1..6 = switch sections)
// ======================================================

const sections = ['home','about','skills','experience','projects','contact'];

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    const n = parseInt(e.key);
    if (n >= 1 && n <= sections.length) {
      e.preventDefault();
      navigateTo(sections[n - 1]);
    }
  }
});


// ======================================================
// 8. INIT — make sure Home is active on load
// ======================================================

navigateTo('home');

//=========API
async function sendMessage(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  return data.reply;
}


/* =========================================
   COPILOT AI CHAT
========================================= */

const copilotMessages =
  document.getElementById("copilotMessages");

const copilotInput =
  document.getElementById("copilotInput");

  function autoResizeCopilotInput() {

  copilotInput.style.height = "auto";

  copilotInput.style.height =
    copilotInput.scrollHeight + "px";
}

copilotInput.addEventListener(
  "input",
  autoResizeCopilotInput
);

const copilotSend =
  document.getElementById("copilotSend");

async function sendCopilotMessage() {

  const message = copilotInput.value.trim();

  if (!message) return;

  // USER MESSAGE
  const userDiv = document.createElement("div");

  userDiv.className = "user-message";

  userDiv.textContent = message;

  copilotMessages.appendChild(userDiv);

  // CLEAR INPUT
  copilotInput.value = "";
  copilotInput.style.height = "42px";

  // AUTO SCROLL
  copilotMessages.scrollTop =
    copilotMessages.scrollHeight;

  // AI LOADING
  const aiDiv = document.createElement("div");

  aiDiv.className = "ai-message";

  aiDiv.textContent = "Thinking...";

  copilotMessages.appendChild(aiDiv);

  try {

    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    aiDiv.textContent =
      data.reply || "No response.";

  } catch (error) {

    aiDiv.textContent =
      "Something went wrong.";

    console.error(error);
  }

  // AUTO SCROLL
  copilotMessages.scrollTop =
    copilotMessages.scrollHeight;
}

// SEND BUTTON
copilotSend.addEventListener(
  "click",
  sendCopilotMessage
);

// ENTER KEY
copilotInput.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      sendCopilotMessage();
    }
  }
);