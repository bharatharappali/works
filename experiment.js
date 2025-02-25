export const experiment = async () => {
  try {
    const response = await fetch("experiment.json");
    const data = await response.json();

    const exp = document.getElementById("expSection");
    const columns = document.querySelectorAll(".column");
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    const lightboxFooter = document.getElementById("lightboxFooter");
    const prevButton = document.querySelector(".lightbox .prev");
    const nextButton = document.querySelector(".lightbox .next");
    const closeButton = document.getElementById("closeButton");

    let currentIndex = 0;

    const textSection = document.createElement("div");
    textSection.className = "exp-text-section";
    textSection.textContent =
      "All work and No play makes Jack a dull boy, Here's an archive of WIPs, BTSs, fuck-ups and more";
    exp.insertBefore(textSection, exp.firstChild);

    data.forEach((item, index) => {
      let mediaElement;
      if (item.type === "image") {
        mediaElement = document.createElement("img");
        mediaElement.src = item.url;
        mediaElement.alt = item.alt;
      } else if (item.type === "video") {
        mediaElement = document.createElement("video");
        mediaElement.src = item.url;
        mediaElement.loop = true;
        mediaElement.autoplay = true;
        mediaElement.controls = false;
        mediaElement.muted = true;
        mediaElement.setAttribute("preload", "auto");
        mediaElement.setAttribute("playsinline", "");
        mediaElement.setAttribute("webkit-playsinline", "");
      }

      const columnIndex = index % columns.length;
      columns[columnIndex].appendChild(mediaElement);

      mediaElement.addEventListener("click", () => openLightbox(index));
    });

    function openLightbox(index) {
      currentIndex = index;
      const item = data[currentIndex];
      lightboxMedia.innerHTML = "";

      let mediaElement;
      if (item.type === "image") {
        mediaElement = document.createElement("img");
        mediaElement.src = item.url;
        mediaElement.alt = item.alt;
      } else if (item.type === "video") {
        mediaElement = document.createElement("video");
        mediaElement.src = item.url;
        mediaElement.controls = true;
        mediaElement.loop = true;
        mediaElement.autoplay = true;
      }

      lightboxMedia.appendChild(mediaElement);
      lightboxFooter.textContent = `Item ${currentIndex + 1} of ${data.length}`;

      lightbox.style.display = "flex";
      lightbox.classList.add("show");
    }

    function navigateLightbox(direction) {
      currentIndex = (currentIndex + direction + data.length) % data.length;
      openLightbox(currentIndex);
    }

    function closeLightbox() {
      lightbox.style.display = "none";
      lightbox.classList.remove("show");
    }

    prevButton.addEventListener("click", () => navigateLightbox(-1));
    nextButton.addEventListener("click", () => navigateLightbox(1));
    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        navigateLightbox(-1);
      } else if (e.key === "ArrowRight") {
        navigateLightbox(1);
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
