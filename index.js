import { bioSection } from "./bioSection.js";
import { workSection } from "./work.js";
import { experiment } from "./experiment.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetID = this.getAttribute("data-target");

      if (targetID) {
        // Hide all sections first
        document.querySelectorAll(".section").forEach((section) => {
          section.classList.remove("active");
          section.classList.add("hidden");
          section.style.display = "none";
        });

        const targetSection = document.querySelector(targetID);
        if (targetSection) {
          targetSection.style.display = "block";
          setTimeout(() => {
            targetSection.classList.remove("hidden");
            targetSection.classList.add("active");
          }, 10);
        } else {
          console.error("Target section not found:", targetID);
        }

        document.querySelectorAll(".nav-link").forEach((navLink) => {
          navLink.classList.remove("active");
          navLink.style.opacity = "0.5";
        });

        this.style.opacity = "1";
        this.classList.add("active");
      }
    });
  });
});

function handleResponsiveBioInfo() {
  const bioInfo = document.getElementById("bio_info");
  const workSection = document.getElementById("workSection");
  const expSection = document.getElementById("expSection");

  if (!bioInfo || !workSection || !expSection) return;

  if (window.innerWidth >= 821) {
    bioInfo.classList.remove("active");
    bioInfo.style.display = "none";
    bioInfo.classList.add("hidden");

    setTimeout(() => {
      if (!expSection.classList.contains("active")) {
        workSection.classList.remove("hidden");
        workSection.style.display = "block";
        workSection.classList.add("active");
      }
    }, 20);
  } else if (bioInfo.classList.contains("active")) {
    bioInfo.style.display = "flex";
  }

  if (expSection.classList.contains("active")) {
    workSection.classList.add("hidden");
    workSection.style.display = "none";
  } else if (workSection.classList.contains("active")) {
    expSection.classList.add("hidden");
    expSection.style.display = "none";
  }
}

window.addEventListener("resize", handleResponsiveBioInfo);
document.addEventListener("DOMContentLoaded", handleResponsiveBioInfo);

let currentIndex = 0;
function changeColors() {
  fetch("color-palette.json")
    .then((response) => response.json())
    .then((colorData) => {
      const currentColor = colorData.colors[currentIndex];

      document.body.style.backgroundColor = currentColor["bg-color"];
      document.body.style.color = currentColor["body-color"];

      const tabButtons = document.querySelectorAll(".navbar");
      const navLinks = document.querySelectorAll(".nav-link");
      const navLink = document.querySelectorAll(".link");
      const textSection = document.querySelectorAll(".text-section");
      const projectSection = document.querySelectorAll(".project");
      const nameSection = document.querySelectorAll(".name_section");
      tabButtons.forEach((a) => {
        a.style.backgroundColor = currentColor["bg-color"];
        a.style.color = currentColor["body-color"];
        a.style.borderBottom = `1px solid ${currentColor["body-color"]}`;
      });
      navLinks.forEach((a) => {
        a.style.color = currentColor["body-color"];
        a.offsetHeight;
      });
      navLink.forEach((a) => {
        a.style.color = currentColor["body-color"];
        a.offsetHeight;
      });
      textSection.forEach((a) => {
        a.style.backgroundColor = currentColor["bg-color"];
        a.style.color = currentColor["body-color"];
        a.style.borderBottom = `1px solid ${currentColor["body-color"]}`;
        console.log("Updated tab button color:", a.style.color);
        a.offsetHeight;
      });
      projectSection.forEach((a) => {
        a.style.backgroundColor = currentColor["bg-color"];
        a.style.color = currentColor["body-color"];
        a.style.borderBottom = `1px solid ${currentColor["body-color"]}`;

        a.offsetHeight;
      });
      nameSection.forEach((a) => {
        a.style.backgroundColor = currentColor["bg-color"];
        a.style.color = currentColor["body-color"];
        a.style.borderBottom = `1px solid ${currentColor["body-color"]}`;

        a.offsetHeight;
      });

      currentIndex = (currentIndex + 1) % colorData.colors.length;
    })
    .catch((error) => {
      console.error("Error loading color data:", error);
    });
}

document
  .querySelectorAll("#color-changer-button, #color-changer-button_mbl")
  .forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      changeColors();
    });
  });

workSection();
experiment();
bioSection();
