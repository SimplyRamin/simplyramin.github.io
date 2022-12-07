function updateList() {
	const titles = [...document.querySelectorAll('h1, h2')].sort((a, b) => {
		return Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top);
	});

	document.querySelectorAll(".selected-circle").forEach(c => c.classList.remove("selected-circle"));
	
	document.querySelectorAll(".nav-dot")[[...document.querySelectorAll('h1, h2')].indexOf(titles[0])].classList.add("selected-circle");
}

function openNav() {
	document.getElementById('side-nav').style.width = '50%';
	document.getElementById('main').classList.add('bg-blend-darken');
	document.getElementById('main').classList.remove('bg-body');

}

function closeNav() {
	document.getElementById('side-nav').style.width = '0px';
	document.getElementById('main').classList.add('bg-body');
	document.getElementById('main').classList.remove('bg-blend-darken');
}

updateList();
window.addEventListener('scroll', () => {
    updateList();
})
