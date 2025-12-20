const slider = document.getElementById("slider");
const images = slider.querySelectorAll("img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxBg = document.getElementById("lightbox-bg");

let currentIndex = 0;

/* ===== INFINITE SCROLL ===== */
slider.addEventListener("scroll", () => {
  if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
    images.forEach(img => {
      slider.appendChild(img.cloneNode(true));
    });
  }
});

/* ===== LIGHTBOX ===== */
function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "auto";
}

function updateLightbox() {
  const src = images[currentIndex % images.length].src;
  lightboxImg.src = src;
  lightboxBg.style.backgroundImage = `url(${src})`;
}

function nextImage() {
  currentIndex++;
  updateLightbox();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
}

/* KEYBOARD */
document.addEventListener("keydown", e => {
  if (lightbox.style.display !== "flex") return;
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "Escape") closeLightbox();
});