export const bioSection = async () => {
  try {
    const response = await fetch("bio.json");
    if (!response.ok) throw new Error("Failed to load bio.json");

    const bioData = await response.json();

    const updateBioContent = (element) => {
      if (!element) return;
      element.innerHTML = `
        <div class="bio__1">
            <p>${bioData.bio.description}</p>
        </div>
        <div class="bio_sec--1 bt-1">
            <p class="bio-text">${bioData.bio.focus}</p>
        </div>
        <div class="bio_sec--2 bt-1">
            <p class="bio-text availability">${bioData.bio.availability}</p>
            <div class="contact">
                <div class="email-section">
                    <div class="email contact_sec" id="copy-email">
                        <span>${bioData.bio.contact.email.label}</span>
                        <span class="material-symbols-outlined">content_copy</span>
                    </div>
                    <span class="material-symbols-outlined" id="mailto">north_east</span>
                    <div id="copy-message" class="copy-message">Email copied to clipboard!</div>
                </div>
                <div class="instagram-section">
                    <span>
                        <a class="contact_sec" href="${bioData.bio.contact.instagram.link}" target="_blank" rel="noopener noreferrer">
                            ${bioData.bio.contact.instagram.label}
                             <span class="material-symbols-outlined">north_east</span>
                        </a>
                       
                    </span>
                </div>
            </div>
        </div>
        <div class="bio_sec--3 bt-1">
            <a class="link cv" href="${bioData.bio.cv.file}" download="${bioData.bio.cv.file}">
                ${bioData.bio.cv.label} (${bioData.bio.cv.format}, ${bioData.bio.cv.size})
            </a>
        </div>
        <div class="bio_sec--4 bt-1">
            <p id="timeStamp"></p>
        </div>
        <div class="bio_sec--5 bt-1">
            <div class="dateTime">
                <p id="dateStamp">${bioData.bio.footer.last_updated}</p>
                <footer>
                    Developed by <a class="link" href="https://${bioData.bio.footer.linkedin}">
                        ${bioData.bio.footer.developer}
                    </a>
                </footer>
            </div>
        </div>
        <div class="bio_sec--6 wia_banner">
            <img src="${bioData.bio.image.src}" class="img-fluid" alt="${bioData.bio.image.alt}">
        </div>
      `;
    };

    const bioSectionEl = document.getElementById("bio_section");
    const bioInfoEl = document.getElementById("bio_info");

    updateBioContent(bioSectionEl);
    updateBioContent(bioInfoEl);

    const addEventListeners = (parent) => {
      if (!parent) return;

      parent
        .querySelector("#copy-email")
        ?.addEventListener("click", copyEmailAndOpen);
      parent.querySelector("#mailto")?.addEventListener("click", mailto);
      parent
        .querySelector("#timeStamp")
        ?.addEventListener("click", updateItalyTime);
    };

    addEventListeners(bioSectionEl);
    addEventListeners(bioInfoEl);

    function copyEmailAndOpen() {
      const email = bioData.bio.contact.email.value;

      navigator.clipboard
        .writeText(email)
        .then(() => showCopyMessage())
        .catch((err) => console.error("Failed to copy email:", err));
    }

    function mailto() {
      const email = bioData.bio.contact.email.value;
      navigator.clipboard
        .writeText(email)
        .then(() => (window.location.href = `mailto:${email}`))
        .catch((err) => console.error("Failed to copy email:", err));
    }

    function showCopyMessage() {
      document.querySelectorAll("#copy-message").forEach((messageElement) => {
        messageElement.style.display = "block";
        setTimeout(() => {
          messageElement.style.display = "none";
        }, 2000);
      });
    }

    function updateItalyTime() {
      const italyTime = new Date().toLocaleTimeString("it-IT", {
        timeZone: "Europe/Rome",
      });
      document.querySelectorAll("#timeStamp").forEach((el) => {
        el.textContent = `Milan [IT]: ${italyTime}`;
      });
    }

    updateItalyTime();
    setInterval(updateItalyTime, 1000);

    function updateDate() {
      const date = new Date();
      const options = { month: "short", year: "numeric" };
      document.querySelectorAll("#dateStamp").forEach((el) => {
        el.textContent = `last updated on ${date.toLocaleDateString(
          "en-US",
          options
        )}`;
      });
    }

    updateDate();
  } catch (error) {
    console.error("Error loading bio section:", error);
    document.querySelectorAll("#bio_section, #bio_info").forEach((el) => {
      if (el) el.innerHTML = `<p>Error loading content. Please try again.</p>`;
    });
  }
};
