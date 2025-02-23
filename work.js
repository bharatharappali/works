function toCamelCase(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
export async function workSection() {
  try {
    const response = await fetch("work.json");
    const data = await response.json();
    const workSection = document.getElementById("workSection");
    const renderProjects = async (filter) => {
      workSection.querySelectorAll(".project").forEach((el) => el.remove());

      const filteredProjects = data.projects.filter(
        (project) => filter === "all" || project.projectType === filter
      );

      const fragment = document.createDocumentFragment();

      await Promise.all(
        filteredProjects.map(async (project, projectIndex) => {
          const projectDiv = document.createElement("div");
          projectDiv.className = "project d-flex gap-1 flex-column";
          projectDiv.style.borderBottom = "1px solid black";
          projectDiv.style.paddingBottom = "6px";

          const scrollWrapper = document.createElement("div");
          scrollWrapper.className = "scroll-wrapper";
          scrollWrapper.style.position = "relative";

          const prevButton = document.createElement("button");
          prevButton.innerText = "❮";
          prevButton.className = "scroll-button prev";

          const nextButton = document.createElement("button");
          nextButton.innerText = "❯";
          nextButton.className = "scroll-button next";

          const scrollContainer = document.createElement("div");
          scrollContainer.className = "scroll-container";

          const mediaElements = await Promise.all(
            project.carousel.map(async (item) => {
              const scrollItem = document.createElement("div");
              scrollItem.className = "scroll-item";

              let mediaEle;

              if (item.type === "image") {
                mediaEle = document.createElement("img");
                mediaEle.src = item.url;
                mediaEle.alt = item.alt;
                mediaEle.style.width = "auto";
                mediaEle.style.height = "100%";
              } else if (item.type === "video") {
                mediaEle = document.createElement("video");
                mediaEle.autoplay = true;
                mediaEle.loop = true;
                mediaEle.controls = false;
                mediaEle.muted = true;
                mediaEle.setAttribute("playsinline", "");
                mediaEle.setAttribute("webkit-playsinline", "");

                const sourceMp4 = document.createElement("source");
                sourceMp4.src = item.url;
                sourceMp4.type = "video/mp4";
                mediaEle.appendChild(sourceMp4);
              } else if (item.type === "iframe") {
                mediaEle = document.createElement("iframe");
                let url = new URL(item.url);
                url.searchParams.set("autoplay", "1");
                url.searchParams.set("loop", "1");

                mediaEle.src = url.toString();
                mediaEle.frameBorder = "0";
                mediaEle.allow =
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                mediaEle.allowFullscreen = true;
              }

              scrollItem.appendChild(mediaEle);
              mediaEle.addEventListener("click", (event) => {
                const mediaIndex = [...scrollContainer.children].indexOf(
                  event.currentTarget.parentElement
                );
                openLightbox(project.carousel, mediaIndex);
              });

              return scrollItem;
            })
          );

          mediaElements.forEach((el) => scrollContainer.appendChild(el));

          prevButton.addEventListener("click", () => {
            const itemWidth =
              scrollContainer.querySelector(".scroll-item")?.offsetWidth || 300;
            scrollContainer.scrollBy({ left: -itemWidth, behavior: "smooth" });
          });

          nextButton.addEventListener("click", () => {
            const itemWidth =
              scrollContainer.querySelector(".scroll-item")?.offsetWidth || 300;
            scrollContainer.scrollBy({ left: itemWidth, behavior: "smooth" });
          });

          scrollWrapper.appendChild(prevButton);
          scrollWrapper.appendChild(scrollContainer);
          scrollWrapper.appendChild(nextButton);

          projectDiv.appendChild(scrollWrapper);

          function openLightbox(mediaArray, index) {
            const lightbox = document.getElementById("lightbox");
            const lightboxMedia = document.getElementById("lightboxMedia");
            const lightboxFooter = document.getElementById("lightboxFooter");
            const prevButton = document.querySelector(".controls.prev");
            const nextButton = document.querySelector(".controls.next");
            const closeButton = document.getElementById("closeButton");

            function updateLightboxContent(index) {
              const item = mediaArray[index];
              lightboxMedia.innerHTML = "";

              let mediaEle;
              if (item.type === "image") {
                mediaEle = document.createElement("img");
                mediaEle.src = item.url;
                mediaEle.alt = item.alt;
                mediaEle.style.maxWidth = "90vw";
                mediaEle.style.maxHeight = "80vh";
              } else if (item.type === "video") {
                mediaEle = document.createElement("video");
                mediaEle.controls = true;
                mediaEle.autoplay = true;
                mediaEle.loop = true;
                mediaEle.muted = false;

                const sourceMp4 = document.createElement("source");
                sourceMp4.src = item.url;
                sourceMp4.type = "video/mp4";
                mediaEle.appendChild(sourceMp4);
              } else if (item.type === "iframe") {
                mediaEle = document.createElement("iframe");
                let url = new URL(item.url);
                url.searchParams.set("autoplay", "1");
                url.searchParams.set("loop", "1");

                mediaEle.src = url.toString();
                mediaEle.frameBorder = "0";
                mediaEle.allow =
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                mediaEle.allowFullscreen = true;
                mediaEle.style.width = "90vw";
                mediaEle.style.height = "80vh";
              }

              lightboxMedia.appendChild(mediaEle);
              lightboxFooter.innerHTML = `<p>Media ${index + 1} of ${
                mediaArray.length
              }</p>`;
            }

            updateLightboxContent(index);
            lightbox.style.display = "flex";

            prevButton.onclick = () => {
              index = (index - 1 + mediaArray.length) % mediaArray.length;
              updateLightboxContent(index);
            };

            nextButton.onclick = () => {
              index = (index + 1) % mediaArray.length;
              updateLightboxContent(index);
            };

            closeButton.onclick = () => {
              lightbox.style.display = "none";
            };

            window.onclick = (event) => {
              if (event.target === lightbox) {
                lightbox.style.display = "none";
              }
            };
            document.addEventListener("keydown", (e) => {
              if (e.key === "Escape") lightbox.style.display = "none";
            });
          }

          // Project Details
          const detailsDiv = document.createElement("div");
          detailsDiv.className = "project-details row mt-3";

          const titleInfoDiv = document.createElement("div");
          titleInfoDiv.className = "title-info";
          titleInfoDiv.innerHTML = `<p class="title">${project.title}</p>`;
          detailsDiv.appendChild(titleInfoDiv);

          const projectInfoDiv = document.createElement("div");
          projectInfoDiv.className = "project-info col-md-7 col-sm-12";
          projectInfoDiv.innerHTML = `<p class="sub-title" >${project.subTitle}</p>`;

          const projectYear = document.createElement("div");
          projectYear.className = "project-year ";
          projectYear.innerHTML = `<p>${project.year}</p>`;

          // Expandable Details
          const moreInfoButton = document.createElement("button");
          moreInfoButton.className = "more-info-btn";
          moreInfoButton.innerHTML =
            'More Info<span class="material-symbols-outlined expd-btn"> unfold_more </span>';
          moreInfoButton.style.cursor = "pointer";

          const showLessButton = document.createElement("button");
          showLessButton.className = "less-info-btn";
          showLessButton.innerHTML =
            'Less Info <span class="material-symbols-outlined expd-btn"> unfold_less </span>';
          showLessButton.style.cursor = "pointer";
          showLessButton.style.display = "none";

          const expandableDiv = document.createElement("div");
          expandableDiv.className = "expandable-info row";
          expandableDiv.style.display = "none";

          const descriptionDiv = document.createElement("div");
          descriptionDiv.className = "description-info col-md-6";
          descriptionDiv.innerHTML = `<p>${project.description}</p>`;

          //   const additionalInfoDiv = document.createElement("div");
          //   additionalInfoDiv.className = "additional-info col-md-6";
          //   additionalInfoDiv.innerHTML = `
          //   <p class="project-type">[Type: ${project.projectType}]</p>
          //   <p class="collab">[Collaboration: ${project.collab}]</p>
          //   <p class="client-status">[Status: ${project.clientStatus}]</p>
          // `;

          const additionalInfoDiv = document.createElement("div");
          additionalInfoDiv.className = "additional-info col-md-6";

          const additionalInfo = project.additionalInfo;
          if (additionalInfo) {
            let content = "";

            Object.entries(additionalInfo).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                content += `<p class="${key}">[${toCamelCase(key)}: `;
                content += value
                  .map((item) => {
                    if (item.name && item.plink) {
                      return `<a href="${item.plink}" target="_blank">${item.name}</a>`;
                    } else if (item.name) {
                      return item.name;
                    }
                    return "";
                  })
                  .join(", ");
                content += `]</p>`;
              } else if (value !== null && value !== undefined) {
                content += `<p class="${key}">[${toCamelCase(
                  key
                )}:${value}]</p>`;
              }
            });

            additionalInfoDiv.innerHTML = content;
          }

          expandableDiv.appendChild(descriptionDiv);
          expandableDiv.appendChild(additionalInfoDiv);

          moreInfoButton.addEventListener("click", () => {
            expandableDiv.style.display = "flex";
            moreInfoButton.style.display = "none";
            showLessButton.style.display = "flex";
          });
          showLessButton.addEventListener("click", () => {
            expandableDiv.style.display = "none";
            moreInfoButton.style.display = "flex";
            showLessButton.style.display = "none";
          });

          projectInfoDiv.appendChild(moreInfoButton);
          projectInfoDiv.appendChild(expandableDiv);
          projectInfoDiv.appendChild(showLessButton);
          detailsDiv.appendChild(projectYear);
          detailsDiv.appendChild(projectInfoDiv);

          projectDiv.appendChild(detailsDiv);
          fragment.appendChild(projectDiv);
        })
      );

      workSection.appendChild(fragment);
    };

    renderProjects("all");
  } catch (error) {
    console.error("Error fetching projects data:", error);
  }
}
