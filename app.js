document.addEventListener('DOMContentLoaded', async () => {

  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  }

  function render(data) {

    // ── Firmenname ──────────────────────────────────────────────────────────
    if (data.firmenname) {
      setText('firmenname', data.firmenname);
      setText('footer-firmenname', `© ${new Date().getFullYear()} ${data.firmenname}`);
      document.title = data.firmenname;
    } else {
      hide('site-header');
    }

    // ── Hero ────────────────────────────────────────────────────────────────
    const hasHero = data.hero_titel || data.hero_subline || data.telefon_link;

    if (hasHero) {
      if (data.hero_titel) {
        setText('hero-titel', data.hero_titel);
      } else {
        hide('hero-titel');
      }

      if (data.hero_subline) {
        setText('hero-subline', data.hero_subline);
      } else {
        hide('hero-subline');
      }

      if (data.telefon_link) {
        setAttr('cta-button', 'href', data.telefon_link);
      } else {
        hide('cta-button');
      }
    } else {
      hide('hero');
    }

    // ── Beschreibung ────────────────────────────────────────────────────────
    if (data.beschreibung) {
      setText('beschreibung', data.beschreibung);
    } else {
      hide('section-beschreibung');
    }

    // ── Leistungen ──────────────────────────────────────────────────────────
    if (Array.isArray(data.leistungen) && data.leistungen.length > 0) {
      const list = document.getElementById('leistungen');
      if (list) {
        const fragment = document.createDocumentFragment();
        data.leistungen.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          fragment.appendChild(li);
        });
        list.appendChild(fragment);
      }
    } else {
      hide('section-leistungen');
    }

    // ── Google Maps ─────────────────────────────────────────────────────────
    // Leer-String, null, undefined oder fehlender Key → Sektion ausblenden
    if (data.maps_url && data.maps_url.trim() !== '') {
      setAttr('google-maps-frame', 'src', data.maps_url.trim());
    } else {
      hide('location');
    }

    // ── Footer-Links ────────────────────────────────────────────────────────
    if (data.impressum_url) {
      setAttr('impressum-link', 'href', data.impressum_url);
    } else {
      hide('impressum-link');
    }

    if (data.datenschutz_url) {
      setAttr('datenschutz-link', 'href', data.datenschutz_url);
    } else {
      hide('datenschutz-link');
    }
  }

  // ── Fetch & Error Handling ──────────────────────────────────────────────────
  try {
    const response = await fetch('./kunde.json');

    if (!response.ok) {
      throw new Error(`HTTP-Fehler: Status ${response.status}`);
    }

    const data = await response.json();
    render(data);

  } catch (error) {
    console.error('[app.js] Kritischer Ladefehler:', error.message);

    ['site-header', 'hero', 'section-beschreibung', 'section-leistungen', 'location', 'site-footer']
      .forEach(hide);

    const main = document.querySelector('main');
    if (main) {
      const notice = document.createElement('p');
      notice.style.cssText = 'padding: 2rem; color: #c0392b; font-family: monospace; font-size: 0.9rem;';
      notice.textContent = `Inhalte konnten nicht geladen werden. (${error.message})`;
      main.prepend(notice);
    }
  }

});
