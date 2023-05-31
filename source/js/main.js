const mobileMenuButton = document.querySelector(".main-header__button");
const mobileMenu = document.querySelector(".main-menu__list");
const mobileMenuButtonClose = document.querySelector(".main-menu__close") ;

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.add("main-menu__list--open") ;
})
mobileMenuButtonClose.addEventListener("click", () => {
  mobileMenu.classList.remove("main-menu__list--open") ;
})
