// Переменные
const navButton = document.querySelector('.nav__button');
const navList = document.querySelector('.nav__list');
const header = document.querySelector('.header');
const heroInner = document.querySelector('.hero__inner');
const heroText = document.querySelector('.hero__text');
const menuBackground = document.querySelector('.menu-background');
const page = document.querySelector('.page');
const pageBody = document.querySelector('.page__body');
const pagePolicyTerms = document.querySelector('.page__policy-terms');
const arrOfNavLinks = document.querySelectorAll('.nav__link');

// Вычисления
const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

// Функция: Переключение меню
function toggleMenu() {
  navButton.classList.toggle('nav__button--close');
  navList.classList.toggle('nav__list--menu');
  header.classList.toggle('header--menu');
  heroText.classList.toggle('hero__text--hidden');
  pageBody.classList.toggle('page__body--fixed');
}

// Функция: Прокрутка страницы и добавление цвета шапке
function handleScroll() {
  if (window.scrollY > headerHeight) {
    header.classList.add('header--pink');
  } else {
    header.classList.remove('header--pink');
  }
}

//
function updateHeaderHeight() {
  const headerHeight = header.offsetHeight;

  page.style.scrollPaddingTop = `${headerHeight}px`;

  if (pagePolicyTerms) {
    pagePolicyTerms.style.paddingTop = `${headerHeight}px`;
  }

  if (heroInner) {
    heroInner.style.paddingTop = `${headerHeight}px`;
  }

  return headerHeight;
}

let headerHeight = updateHeaderHeight();

// События
navButton.addEventListener('click', toggleMenu);

arrOfNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (isSmallScreen) {
      toggleMenu();
    }
  });
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', () => {
  headerHeight = updateHeaderHeight();
});