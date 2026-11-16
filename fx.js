// Motion layer: scroll reveal, typed section eyebrows, timeline rail, pointer spotlight.
// Everything here is progressive: without JS (no .js class) nothing is hidden.
(() => {
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ---- Typed eyebrows: tell CSS how many characters to type ----
	document.querySelectorAll('.section .eyebrow').forEach(el => {
		el.style.setProperty('--n', el.textContent.trim().length);
	});

	// ---- Reveal targets, staggered within their parent ----
	const TARGETS = [
		'.section .section-title', '.section .lead', '#project-filters', '.project-card',
		'.xp', '.edu', '.cert', '#stack dl > div', '#contact .term', '.group-label',
	];
	const items = [...document.querySelectorAll(TARGETS.join(','))];
	items.forEach(el => {
		el.setAttribute('data-reveal', '');
		const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal') || items.includes(c));
		const i = Math.max(0, siblings.indexOf(el));
		el.style.setProperty('--d', `${Math.min(i % 6, 4) * 70}ms`);
	});

	const sections = [...document.querySelectorAll('.section')];
	const show = el => el.classList.add('is-in');

	// Reveal anything whose top has entered the lower part of the viewport, or is above it.
	// A plain rect check (not IntersectionObserver) so nothing can ever stay hidden:
	// hidden elements (display:none) report top 0 and are revealed too, so they show
	// instantly when a filter or "Show all" displays them.
	let pending = [...items, ...sections];
	function checkReveal() {
		const limit = window.innerHeight * 0.9;
		pending = pending.filter(el => {
			if (el.getBoundingClientRect().top < limit) { show(el); return false; }
			return true;
		});
		if (!pending.length) {
			window.removeEventListener('scroll', checkReveal);
			window.removeEventListener('resize', checkReveal);
		}
	}
	if (reduced) {
		pending.forEach(show);
		pending = [];
	} else {
		window.addEventListener('scroll', checkReveal, { passive: true });
		window.addEventListener('resize', checkReveal);
	}
	// Turn the motion styles on only now that this script is running, then reveal what's in view.
	document.documentElement.classList.add('fx');
	checkReveal();

	// ---- Timeline rail: fills as you scroll, nodes light up when passed ----
	const timelines = [...document.querySelectorAll('.timeline')];
	function updateTimelines() {
		const line = window.innerHeight * 0.6;
		timelines.forEach(tl => {
			const r = tl.getBoundingClientRect();
			const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
			tl.style.setProperty('--p', p.toFixed(4));
			[...tl.children].forEach(li => {
				li.classList.toggle('is-lit', li.getBoundingClientRect().top + 40 < line);
			});
		});
	}
	if (timelines.length) {
		window.addEventListener('scroll', updateTimelines, { passive: true });
		window.addEventListener('resize', updateTimelines);
		updateTimelines();
	}

	// ---- Pointer spotlight on cards and panels (fine pointers only) ----
	document.querySelectorAll('.project-card, #stack dl > div').forEach(el => el.classList.add('spot'));
	if (window.matchMedia('(pointer: fine)').matches) {
		document.addEventListener('pointermove', e => {
			const el = e.target.closest && e.target.closest('.spot');
			if (!el) return;
			const r = el.getBoundingClientRect();
			el.style.setProperty('--mx', `${e.clientX - r.left}px`);
			el.style.setProperty('--my', `${e.clientY - r.top}px`);
		}, { passive: true });
		document.addEventListener('pointerout', e => {
			const el = e.target.closest && e.target.closest('.spot');
			if (el && !el.contains(e.relatedTarget)) {
				el.style.removeProperty('--mx');
				el.style.removeProperty('--my');
			}
		});
	}
})();
