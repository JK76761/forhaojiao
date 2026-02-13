function enterExperience() {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("gallery").classList.remove("hidden");
  revealPhotos();
}

function revealPhotos() {
  const sections = document.querySelectorAll(".photo-section");
  sections.forEach((sec, index) => {
    setTimeout(() => {
      sec.classList.add("show");
    }, index * 1200);
  });
}

function finalReveal() {
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById("final").classList.remove("hidden");
}

function proposal() {
  alert("Every day with you feels like a five-star experience. I love you.");
}
