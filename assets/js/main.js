// Consistent toggle button for Art/Design and Coding
document.addEventListener('DOMContentLoaded', function() {
	const toggleBtn = document.querySelector('.home-links-toggle');
	const cards = document.querySelectorAll('.gallery-card');
	if (!toggleBtn) return;

	// Always start with coding only, button says 'Art/Design'
	let showingArt = false;
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
		updateView();
	});
});
