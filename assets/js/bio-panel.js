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

        // Create expand button (styled as button for consistency)
        const expandBtn = document.createElement('button');
        expandBtn.className = 'bio-panel-expand-btn';
        expandBtn.title = 'Open full project page';
        expandBtn.type = 'button';
        expandBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 13L13 7M13 7H8M13 7V12" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        expandBtn.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = url;
        });

        // Create home button
        const homeBtn = document.createElement('button');
        homeBtn.className = 'bio-panel-expand-btn bio-panel-home-btn';
        homeBtn.title = 'Return to bio';
        homeBtn.type = 'button';
        homeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10L10 4L17 10" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10V16H15V10" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        homeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          // Detect if current project is art/design
          var isArt = false;
          var tags = document.querySelectorAll('.project-header .tags .tag');
          tags.forEach(function(tag){
            var t = tag.textContent.trim().toLowerCase();
            if (t === 'art' || t === 'design') isArt = true;
          });
          if (isArt) {
            localStorage.setItem('showingArt', '1');
          } else {
            localStorage.removeItem('showingArt');
          }
          var baseurl = document.body.getAttribute('data-baseurl') || '';
          if (baseurl && !baseurl.endsWith('/')) baseurl += '/';
          window.location.href = baseurl ? baseurl : '/';
        });

  const btnWrap = document.createElement('div');
  btnWrap.style = 'display:flex;align-items:center;gap:8px;margin-bottom:10px;justify-content:flex-end;';
        btnWrap.appendChild(expandBtn);
        btnWrap.appendChild(homeBtn);

  const panel = document.createElement('div');
  panel.className = 'project-bio-panel';
  panel.style = 'position:relative;';
  panel.appendChild(btnWrap);
  // Insert the project content as a child node, not via innerHTML, to preserve button listeners
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = content.innerHTML;
  panel.appendChild(contentDiv);
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
