// Projects section: category filter, "show all" toggle and per-card "Read more".
(() => {
	const grid = document.getElementById('project-grid');
	if (!grid) return;

	const LIMIT = 6;
	const cards = [...grid.querySelectorAll('.project-card')];
	const filters = [...document.querySelectorAll('#project-filters [data-filter]')];
	const showAll = document.getElementById('project-show-all');
	let active = 'all';
	let expanded = false;

	// Show "Read more" only on cards whose description overflows 4 lines.
	// The button keeps its space either way (visibility, not display), so no layout shift.
	function measure() {
		cards.forEach(card => {
			if (card.hidden) return;
			const desc = card.querySelector('.project-desc');
			const more = card.querySelector('.project-more');
			if (!desc.classList.contains('is-clamped')) return;
			const overflows = desc.scrollHeight > desc.clientHeight + 1;
			desc.classList.toggle('has-overflow', overflows);
			more.classList.toggle('invisible', !overflows);
		});
	}

	function render() {
		const matching = cards.filter(c => active === 'all' || c.dataset.category.split(' ').includes(active));
		const collapsed = active === 'all' && !expanded;
		cards.forEach(c => {
			const i = matching.indexOf(c);
			c.hidden = i === -1 || (collapsed && i >= LIMIT);
		});
		showAll.hidden = active !== 'all' || cards.length <= LIMIT;
		showAll.textContent = expanded ? 'Show fewer' : `Show all projects (${cards.length})`;
		showAll.setAttribute('aria-expanded', String(expanded));
		measure();
	}

	filters.forEach(btn => {
		btn.addEventListener('click', () => {
			active = btn.dataset.filter;
			filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
			render();
		});
	});

	showAll.addEventListener('click', () => {
		expanded = !expanded;
		render();
		if (!expanded) showAll.scrollIntoView({ block: 'nearest' });
	});

	grid.addEventListener('click', e => {
		const more = e.target.closest('.project-more');
		if (!more) return;
		const desc = document.getElementById(more.getAttribute('aria-controls'));
		const open = more.getAttribute('aria-expanded') !== 'true';
		desc.classList.toggle('is-clamped', !open);
		more.setAttribute('aria-expanded', String(open));
		more.textContent = open ? 'Show less' : 'Read more';
	});

	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(measure, 150);
	});
	if (document.fonts) document.fonts.ready.then(measure);

	render();
})();
