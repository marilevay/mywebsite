// Consistent toggle button for Art/Design and Coding
document.addEventListener('DOMContentLoaded', function() {
	const toggleBtn = document.querySelector('.home-links-toggle');
	const cards = document.querySelectorAll('.gallery-card');
	if (!toggleBtn) return;

	// Always start with coding only, button says 'Art/Design'
	function initArtDesignToggle() {
	  const toggleBtn = document.querySelector('.home-links-toggle');
	  const cards = document.querySelectorAll('.gallery-card');
	  if (!toggleBtn) return;

	  // Persist state in localStorage
	  let showingArt = localStorage.getItem('showingArt') === '1';
	function updateView() {
		if (showingArt) {
			toggleBtn.textContent = 'Coding';
			cards.forEach(card => {
				card.style.display = card.getAttribute('data-type') === 'art' ? '' : 'none';
			});
		} else {
			toggleBtn.textContent = 'Art/Design';
			cards.forEach(card => {
				card.style.display = card.getAttribute('data-type') === 'coding' ? '' : 'none';
			});
		}
	}
	  updateView();

	  toggleBtn.addEventListener('click', function(e) {
	    e.preventDefault();
	    showingArt = !showingArt;
	    localStorage.setItem('showingArt', showingArt ? '1' : '0');
	    updateView();
	  });
	}

	if (document.readyState === 'loading') {
	  document.addEventListener('DOMContentLoaded', initArtDesignToggle);
	} else {
	  initArtDesignToggle();
	}

	toggleBtn.addEventListener('click', function(e) {
		e.preventDefault();
		showingArt = !showingArt;
		updateView();
	});
});
