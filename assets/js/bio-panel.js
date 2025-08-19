// JS for project bio panel
// Loads project .md content into the left panel on card click

document.addEventListener('DOMContentLoaded', function() {
  const leftPanel = document.querySelector('.home-split__left');
  const cards = document.querySelectorAll('.gallery-card[data-page]');
  const defaultBio = leftPanel ? leftPanel.innerHTML : null;

  function loadProject(url) {
    if (!leftPanel) return;
    fetch(url)
      .then(res => res.text())
      .then(html => {
        // Try to extract the <article class="project"> if present
        const temp = document.createElement('div');
        temp.innerHTML = html;
        let content = temp.querySelector('article.project');
        if (!content) content = temp; // fallback to all
        // Add icon-only expand button as an <a> for reliable navigation
        const expandBtn = document.createElement('a');
        expandBtn.className = 'bio-panel-expand-btn';
        expandBtn.title = 'Open full project page';
        expandBtn.href = url;
        expandBtn.target = '_self';
        expandBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 13L13 7M13 7H8M13 7V12" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        const panel = document.createElement('div');
        panel.className = 'project-bio-panel';
        panel.style = 'position:relative;';
        panel.appendChild(expandBtn);
        panel.innerHTML += content.innerHTML;
        leftPanel.innerHTML = '';
        leftPanel.appendChild(panel);
        leftPanel.scrollTop = 0;
        // Re-initialize project.js logic for tabs and PDF nav
        if (window.initProjectTabs) window.initProjectTabs(leftPanel);
      });
  }

  if (leftPanel) {
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        loadProject(card.getAttribute('data-page'));
      });
    });

    // Optionally, add a way to return to the bio
    leftPanel.addEventListener('click', function(e) {
      if (e.target.classList.contains('project-bio-panel')) {
        leftPanel.innerHTML = defaultBio;
      }
    });
  }
});
