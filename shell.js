// ramin-shell: a tiny interactive terminal in the Contact section.
// All output is built with textContent / DOM nodes — user input is never parsed as HTML.
(() => {
	const root = document.getElementById('shell');
	if (!root) return;
	const out = document.getElementById('shell-out');
	const form = document.getElementById('shell-form');
	const input = document.getElementById('shell-in');
	root.hidden = false;

	const EMAIL = 'ferdos.ramin@gmail.com';
	const PROMPT = 'guest@ferdos:~$';
	const SECTIONS = { top: 'top', home: 'top', work: 'projects', projects: 'projects', experience: 'experience', stack: 'stack', education: 'education', contact: 'contact' };
	const history = [];
	let hIndex = 0;

	// ---- output helpers ----
	function line(parts, cls) {
		const p = document.createElement('p');
		if (cls) p.className = cls;
		(Array.isArray(parts) ? parts : [parts]).forEach(part => {
			if (part instanceof Node) p.appendChild(part);
			else p.appendChild(document.createTextNode(part));
		});
		out.appendChild(p);
		while (out.childElementCount > 200) out.firstElementChild.remove();
		return p;
	}
	function link(href, text, external = true) {
		const a = document.createElement('a');
		a.href = href;
		a.textContent = text;
		if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
		return a;
	}
	function span(text, cls) {
		const s = document.createElement('span');
		s.className = cls;
		s.textContent = text;
		return s;
	}
	const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));

	// ---- data straight from the page, so the shell never drifts from the content ----
	const projects = () => [...document.querySelectorAll('.project-card')].map(c => ({
		title: c.querySelector('.project-title').textContent.trim(),
		badge: c.querySelector('.project-badge').textContent.trim().toLowerCase(),
		dates: c.querySelector('header p').textContent.trim(),
	}));
	const roles = () => [...document.querySelectorAll('#experience .xp')].map(x => ({
		date: x.querySelector('.xp-date').textContent.trim(),
		role: x.querySelector('.xp-role').textContent.trim(),
		org: x.querySelector('.xp-org').textContent.trim(),
	}));
	const stack = () => [...document.querySelectorAll('#stack dl > div')].map(d => ({
		key: d.querySelector('dt').textContent.trim(),
		items: [...d.querySelectorAll('.chip')].map(c => c.textContent.trim()),
	}));

	function go(name) {
		const id = SECTIONS[name];
		const el = id && document.getElementById(id);
		if (!el) {
			line(`cd: no such directory: ${name || ''}`.trim(), 'err');
			line('try: ' + Object.keys(SECTIONS).filter(k => k !== 'home' && k !== 'projects').join('  '), 'dim');
			return;
		}
		line(`→ jumping to ~/${name}`, 'ok');
		setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
	}

	const COMMANDS = {
		help: {
			desc: 'list commands',
			run() {
				line('available commands:', 'dim');
				Object.entries(COMMANDS).filter(([, c]) => c.desc).forEach(([k, c]) => line([span(pad(k, 12), 'cmd'), c.desc]));
				line('tip: ↑/↓ for history, tab to autocomplete', 'dim');
			},
		},
		whoami: {
			desc: 'who is ramin?',
			run() {
				line('Ramin Ferdos: Senior AI Engineer.');
				line('I build production AI systems, from agent orchestration to evaluation.');
				line('Currently owning AI & analytics products end to end at Tabiat Makan Industrial Group.', 'dim');
			},
		},
		ls: {
			desc: 'list sections',
			run() { line('work/  experience/  stack/  education/  contact/'); },
		},
		cd: {
			desc: 'jump to a section, e.g. cd stack',
			run(args) { go((args[0] || '').replace(/^~?\/?|\/$/g, '').toLowerCase()); },
		},
		projects: {
			desc: 'list projects',
			run() {
				projects().forEach(p => line([span(pad(p.title, 28), 'cmd'), span(pad(`[${p.badge}]`, 10), p.badge === 'public' ? 'ok' : 'dim'), p.dates]));
				line('→ `cd work` to see them', 'dim');
			},
		},
		experience: {
			desc: 'career log',
			run() { roles().forEach(r => line([span(pad(r.date, 21), 'dim'), span(r.role + ' ', 'cmd'), r.org])); },
		},
		stack: {
			desc: 'tools & techniques',
			run() { stack().forEach(s => line([span(s.key + ' ', 'err'), s.items.join(', ')])); },
		},
		contact: {
			desc: 'how to reach me',
			run() {
				line(['email     ', link('mailto:' + EMAIL, EMAIL, false)]);
				line(['github    ', link('https://github.com/SimplyRamin', 'github.com/SimplyRamin')]);
				line(['linkedin  ', link('https://www.linkedin.com/in/raminferdos/', 'linkedin.com/in/raminferdos')]);
				line('→ `mail` opens your mail app', 'dim');
			},
		},
		mail: {
			desc: 'write me an email',
			run() {
				line(`opening mail client for ${EMAIL}…`, 'ok');
				window.location.href = 'mailto:' + EMAIL;
			},
		},
		date: { desc: 'print the date', run() { line(new Date().toString()); } },
		echo: { desc: 'print text', run(args) { line(args.join(' ')); } },
		clear: { desc: 'clear the screen', run() { out.textContent = ''; } },
		// easter eggs (not listed in help)
		sudo: { run() { line('permission denied: nice try.', 'err'); line('but you can still hire me → type `mail`', 'dim'); } },
		hire: { run() { COMMANDS.mail.run(); } },
		rm: { run() { line('not today. this portfolio is load-bearing.', 'err'); } },
		exit: { run() { line('there is no exit. there is only `mail`.', 'dim'); } },
		vim: { run() { line('you are now trapped in vim. just kidding: type `help`.', 'dim'); } },
		coffee: { run() { line('☕ brewing… error 418: I\'m a teapot.', 'dim'); } },
	};

	function run(raw) {
		const text = raw.trim();
		line([span(PROMPT + ' ', 'err'), text], 'cmd');
		if (!text) return;
		history.push(text);
		hIndex = history.length;
		const [name, ...args] = text.split(/\s+/);
		const key = name.toLowerCase();
		if (SECTIONS[key] && !COMMANDS[key]) return go(key);
		const cmd = COMMANDS[key];
		if (cmd) cmd.run(args);
		else {
			line(`command not found: ${name}`, 'err');
			line('type `help` to see what I can do', 'dim');
		}
	}

	function scrollDown() { out.scrollTop = out.scrollHeight; }

	form.addEventListener('submit', e => {
		e.preventDefault();
		run(input.value);
		input.value = '';
		scrollDown();
	});

	input.addEventListener('keydown', e => {
		if (e.key === 'ArrowUp' && history.length) {
			e.preventDefault();
			hIndex = Math.max(0, hIndex - 1);
			input.value = history[hIndex];
		} else if (e.key === 'ArrowDown' && history.length) {
			e.preventDefault();
			hIndex = Math.min(history.length, hIndex + 1);
			input.value = history[hIndex] || '';
		} else if (e.key === 'Tab' && input.value.trim()) {
			// autocomplete commands, and section names after `cd `
			const v = input.value;
			const m = v.match(/^cd\s+(\S*)$/i);
			const pool = m ? Object.keys(SECTIONS) : Object.keys(COMMANDS).filter(k => COMMANDS[k].desc);
			const stem = m ? m[1].toLowerCase() : v.trim().toLowerCase();
			const hits = pool.filter(k => k.startsWith(stem));
			if (hits.length === 1) {
				e.preventDefault();
				input.value = m ? `cd ${hits[0]}` : hits[0] + ' ';
			} else if (hits.length > 1) {
				e.preventDefault();
				line(hits.join('  '), 'dim');
				scrollDown();
			}
		}
	});

	// Clicking anywhere in the terminal focuses the prompt (unless selecting text or clicking a link).
	out.addEventListener('click', e => {
		if (!e.target.closest('a') && !String(window.getSelection())) input.focus({ preventScroll: true });
	});

	root.querySelectorAll('[data-cmd]').forEach(b => b.addEventListener('click', () => {
		run(b.dataset.cmd);
		scrollDown();
	}));

	line('ramin-shell v1.0 · type `help` or tap a command below', 'dim');
	line('');
})();
