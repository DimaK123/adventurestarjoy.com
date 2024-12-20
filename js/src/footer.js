function updateFooterHeight() {
  const contacts = document.querySelector('.contacts');
  const footer = document.querySelector('.footer');

  const footerHeight = footer.offsetHeight;

  if (contacts) {
    contacts.style.paddingBottom = `${footerHeight}px`;
  }

  return footerHeight;
}

let footerHeight = updateFooterHeight();

window.addEventListener('resize', () => {
  footerHeight = updateFooterHeight();
});