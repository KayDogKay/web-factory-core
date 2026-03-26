document.addEventListener('DOMContentLoaded', async () => {

  /**
   * Blendet ein Element vollständig aus.
   * @param {string} id - Die HTML-ID des Ziel-Elements.
   */
  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  /**
   * Gibt den Text-Inhalt eines Elements sicher aus.
   * @param {string} id - Die HTML-ID des Ziel-Elements.
   * @param {string} value - Der einzutragende Text-Inhalt.
   */
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /**
   * Rendert die JSON-Daten in das DOM.
   * Fehlt ein Key, wird die zugehörige Sektion ausgeblendet.
   * @param {Object} data - Das geparste JSON-Objekt.
   */
  function render(data) {

    // Firmenname
    if (data.firmenname) {
      setText('firmenname', data.firmenname);
      setText('footer-firmenname', `© ${new Date().getFullYear()} ${data.firmenname}`);
      document.title = data.firmenname;
    } else {
      hide('site-header');
      hide('site-footer');
    }

    // Beschreibung
    if (data.beschreibung) {
      setText('beschreibung', data.beschreibung);
    } else {
      hide('section-beschreibung');
    }

    // Leistungen
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

    // Alle inhaltlichen Sektionen ausblenden – kein Absturz, kein kaputtes UI.
    ['site-header', 'section-beschreibung', 'section-leistungen', 'site-footer']
      .forEach(hide);

    // Optionaler Fallback-Hinweis im <main>
    const main = document.querySelector('main');
    if (main) {
      const notice = document.createElement('p');
      notice.style.cssText = 'padding: 2rem; color: #c0392b; font-family: monospace;';
      notice.textContent = `Inhalte konnten nicht geladen werden. (${error.message})`;
      main.prepend(notice);
    }
  }

});
