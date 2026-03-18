document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Back to Top button functionality
const backToTopButton = document.getElementById("backToTop");

window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("menu-toggle").addEventListener("click", function () {
  let menu = document.getElementById("menu");

  // Toggle classes
  menu.classList.toggle("hidden");
  menu.classList.toggle("opacity-0");
  menu.classList.toggle("-translate-y-2");
  menu.classList.toggle("opacity-100");
  menu.classList.toggle("translate-y-0");
});
