/* main.js */

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	const delay = 2000
	document.querySelector('aside').hidden = false
	window.setTimeout(() => {
		document.querySelector('aside').hidden = true
	}, delay)
})


const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navBarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
	navBarLinks.classList.toggle('active')
})
