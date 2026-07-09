// DOM elements
const navBtn = document.getElementById('nav-btn');
const navLinks = document.querySelector('.nav-links');
const typingEl = document.getElementById('typing-intro');
const gameChevronLeft = document.getElementById('game-chevron-left');
const gameChevronRight = document.getElementById('game-chevron-right');
const showChevronLeft = document.getElementById('show-chevron-left');
const showChevronRight = document.getElementById('show-chevron-right');
const email = document.getElementById('email');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const submitBtn = document.getElementById('submit');

const typingText = 'Welcome to Night City, where legends are born.'; // text to display through typing effect

let newsletterAccept = false; // tracks whether user has chosen to receive newsletter

// tracks which game/show img user has selected
let gameIndex = 0;
let showIndex = 0;

// tracks email validation
let isEmailValid = false;

// clears email input on page refresh
email.value = '';

// navbar icon toggle
const navMenu = () => {
    if (navLinks.classList.contains('show')) {
        navBtn.innerHTML = `
            <i class="fa-solid fa-xmark"></i>
        `;
    } else {
        navBtn.innerHTML = `
            <i class="fa-solid fa-bars"></i>
        `;
    }
}

// displays typing text
const typingEffect = (el, text, i = 0) => {
    if (i === 0) {
        el.textContent = ''; // set display
    }

    if (i < text.length) {
        el.textContent += text[i]; // update display with text

        setTimeout(() => typingEffect(el, text, i + 1), 130); // time between each letter typed
    } else {
        setTimeout(() => {
            el.textContent = ''; // reset display
            setTimeout(() => typingEffect(el, text, 0), 2500); // time before typing begins
        }, 10000); // time text is left on screen before starting over
    }
}

typingEffect(typingEl, typingText);

// adds or removes .fade class from .selection classes when user selects img
// removes .fade class when screen is smaller
const updateSelectionClass = (selection, index) => {
    selection.forEach((item, i) => {
        if (i === index) {
            item.classList.remove('fade');
        } else {
            item.classList.add('fade');
        }
    });
}

// fetch data from json file
const fetchData = async () => {
    try {
        const res = await fetch('./news.json');
        const data = await res.json();
        displayNews(data);
    } catch (err) {
        console.log(err);
    }
}

fetchData();

// displays data from json file
const displayNews = (data) => {
    const newsList = document.getElementById('news-list');

    data.forEach((dataIndex) => {
        const { title, date, link, img } = dataIndex; // data destructure

        const newsListHTML =  `
            <a href="${link}" target="_blank" class="web-page">
                <img src="${img}" alt="web logo" class="web-img">
                <span class="web-title">${title}<br>
                ${date}</span>
            </a>
        `;

        newsList.innerHTML += newsListHTML;
    });
}

// email validation and submit button toggle
const emailValidation = (emailInput) => {
    const emailText = document.querySelector('.email-text');
    const emailCursor = document.querySelector('.email-cursor');
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmpty = emailInput === ''; // no user input

    isEmailValid = regex.test(emailInput); // tests user input

    if (isEmpty) {
        emailText.textContent = '>> Enter email address:'; // tells user to enter email address
        emailText.classList.remove('email-invalid');
        emailCursor.style.display = 'inline';
    } else if (!isEmailValid) {
        emailText.textContent = '>> Invalid node detected: enter valid email'; // tells user email is not valid
        emailText.classList.add('email-invalid');
        emailCursor.style.display = 'none';
    } else {
        emailText.textContent = '>> Node verified'; // tells user email is valid
        emailText.classList.remove('email-invalid');
    }
}

// toggles submit button
// disabled = invalid email and/or newsletter acceptance is not selected
// enabled = valid email and newsletter acceptance is selected
const submitBtnToggle = () => {
    submitBtn.disabled = !(isEmailValid && newsletterAccept);
}

submitBtnToggle();

// adjusts game/show img layout individually based on screen size and what user had previously selected
const resize = () => {
    const containers = document.querySelectorAll('.select-container');
    const gameSelection = containers[0].querySelectorAll('.selection');
    const showSelection = containers[1].querySelectorAll('.selection');

    if (window.innerWidth < 800) {
        gameSelection.forEach(i => i.classList.remove('fade'));
        showSelection.forEach(i => i.classList.remove('fade'));
    } else {
        updateSelectionClass(gameSelection, gameIndex);
        updateSelectionClass(showSelection, showIndex);
    }
}

resize();

// event listeners

// window resize
window.addEventListener('resize', resize);

// toggles nav menu when hamburger is clicked
navBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    navMenu();
});

// on smaller screens
// hides nav menu when option is clicked
navLinks.addEventListener('click', () => {
    navLinks.classList.remove('show');
    navMenu();
});

// on larger screens
// adjusts display of game/show imgs based on closest .select-container to the button clicked
// updates user selection

gameChevronLeft.addEventListener('click', (e) => {
    const container = e.target.closest('.select-container');
    const selection = container.querySelectorAll('.selection');

    gameIndex = 0;

    updateSelectionClass(selection, gameIndex);

    gameChevronLeft.classList.add('btn-fade');
    gameChevronRight.classList.remove('btn-fade');
});

gameChevronRight.addEventListener('click', (e) => {
    const container = e.target.closest('.select-container');
    const selection = container.querySelectorAll('.selection');

    gameIndex = 1;

    updateSelectionClass(selection, gameIndex);

    gameChevronRight.classList.add('btn-fade');
    gameChevronLeft.classList.remove('btn-fade');
});

showChevronLeft.addEventListener('click', (e) => {
    const container = e.target.closest('.select-container');
    const selection = container.querySelectorAll('.selection');

    showIndex = 0;

    updateSelectionClass(selection, showIndex);

    showChevronLeft.classList.add('btn-fade');
    showChevronRight.classList.remove('btn-fade');
});

showChevronRight.addEventListener('click', (e) => {
    const container = e.target.closest('.select-container');
    const selection = container.querySelectorAll('.selection');

    showIndex = 1;

    updateSelectionClass(selection, showIndex);

    showChevronRight.classList.add('btn-fade');
    showChevronLeft.classList.remove('btn-fade');
});

// user email input
// checks email validity and, if valid, enables submit btn if user has selected 'yes' before typing
email.addEventListener('input', () => {
    const emailInput = email.value;
    emailValidation(emailInput);
    submitBtnToggle();
});

// user has chosen to receive newsletter
// enables submit btn if user has typed in email address and it's valid
yesBtn.addEventListener('click', () =>{
    newsletterAccept = true;
    yesBtn.classList.add('yn-highlight');
    noBtn.classList.remove('yn-highlight');
    submitBtnToggle();
});

// user has not chosen to receive newsletter
// disables submit btn regardless of email validity
noBtn.addEventListener('click', () =>{
    newsletterAccept = false;
    noBtn.classList.add('yn-highlight');
    yesBtn.classList.remove('yn-highlight');
    submitBtnToggle();
});