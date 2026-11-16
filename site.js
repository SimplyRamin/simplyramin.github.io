// Site chrome: header state, mobile menu, scroll-spy, copy-email, footer year.
(() => {
	const header = document.querySelector('.site-header');
	const toggle = document.getElementById('menu-toggle');
	const menu = document.getElementById('mobile-menu');

	// Header gets a solid background once the page scrolls.
	const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	// Mobile menu
	function setMenu(open) {
		toggle.setAttribute('aria-expanded', String(open));
		toggle.querySelector('[data-label]').textContent = open ? 'close' : 'menu';
		menu.hidden = !open;
	}
	toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
	menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
			setMenu(false);
			toggle.focus();
		}
	});
	window.matchMedia('(min-width: 768px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

	// Scroll-spy: mark the nav link of the section in view.
	const links = [...document.querySelectorAll('[data-spy]')];
	const sections = [...new Set(links.map(a => a.getAttribute('href').slice(1)))]
		.map(id => document.getElementById(id)).filter(Boolean);
	const setActive = id => links.forEach(a => {
		if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
		else a.removeAttribute('aria-current');
	});
	// The active section is the last one whose top has passed 40% of the viewport;
	// at the very bottom of the page the last section wins (it may be too short to reach that line).
	function spy() {
		const line = window.innerHeight * 0.4;
		const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
		let current = '';
		sections.forEach(s => { if (s.getBoundingClientRect().top <= line) current = s.id; });
		if (atBottom && sections.length) current = sections[sections.length - 1].id;
		setActive(current);
	}
	// Only a handful of rect reads per scroll, so no throttling is needed.
	window.addEventListener('scroll', spy, { passive: true });
	window.addEventListener('resize', spy);
	spy();

	// Copy email
	const copy = document.getElementById('copy-email');
	if (copy && navigator.clipboard) {
		copy.hidden = false;
		copy.addEventListener('click', async () => {
			const label = copy.querySelector('[data-label]');
			try {
				await navigator.clipboard.writeText(copy.dataset.email);
				label.textContent = 'copied';
			} catch {
				label.textContent = 'press ctrl+c';
			}
			setTimeout(() => { label.textContent = 'copy'; }, 2000);
		});
	}

	const year = document.getElementById('year');
	if (year) year.textContent = new Date().getFullYear();
})();
