const projects = [{
    title: "Project One",
    description: "First project description",
    tags: ["HTML", "CSS", "JS"],
    background: "Images/project1.webp",
  },
  {
    title: "Project Two",
    description: "Second project description",
    tags: ["React", "Node"],
    background: "Images/project2.webp",
  },
  {
    title: "Project Three",
    description: "Third project description",
    tags: ["Figma", "UX"],
    background: "Images/project3.webp",
  },
];

let currentIndex = 0;
let firstLoad = true;
let animationFrameId;

const title = document.querySelector("#main__project-info h2");
const desc = document.querySelector("#main__project-info p");
const tagsContainer = document.querySelector("#project-tags-ctn");
const dotsContainer = document.getElementById("nav-dots");
const img = document.querySelector("#main__project-bg img");

const radius = 8;
const circumference = 2 * Math.PI * radius;

function setProgress(circle, progress) {
  const offset = circumference * progress;
  circle.style.strokeDashoffset = offset;
}

function renderDots() {
  dotsContainer.innerHTML = projects
    .map(
      (_, i) => `
      <button class="nav-dot ${i === currentIndex ? "active" : ""}" data-index="${i}" aria-label="Go to ${projects[i].title}" 
        ${i === currentIndex ? 'aria-current="true"' : ''} style="position: relative;">
        ${
          i === currentIndex
            ? `<svg class="progress-ring" width="24" height="24" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); pointer-events:none;">
                <circle
                  class="progress-ring__circle"
                  stroke="white"
                  stroke-width="2"
                  fill="transparent"
                  r="${radius}"
                  cx="12"
                  cy="12"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${circumference}"
                />
              </svg>`
            : ""
        }
      </button>
    `
    )
    .join("");

  document.querySelectorAll(".nav-dot").forEach((dot) => {
    dot.addEventListener("click", (e) => {
      cancelAnimationFrame(animationFrameId);
      currentIndex = parseInt(e.target.dataset.index);
      updateCarousel(currentIndex);
    });
  });
}

function startProgressAnimation() {
  cancelAnimationFrame(animationFrameId);

  const circle = dotsContainer.querySelector(".progress-ring__circle");
  if (!circle) return;

  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    let progress = Math.min(elapsed / 5000, 1); // 5 seconds per slide

    setProgress(circle, progress);

    if (elapsed < 5000) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setTimeout(() => nextSlide(), 300);
    }
  }

  setProgress(circle, 0);
  animationFrameId = requestAnimationFrame(animate);
}

function updateCarousel(index) {
  const project = projects[index];

  if (!firstLoad) {
    // Animate text out only after first load
    [title, desc, tagsContainer].forEach((el) => {
      el.classList.remove("fade-slide-in");
      el.classList.add("fade-slide-out");
    });
  }

  setTimeout(() => {
    if (!firstLoad) {
      [title, desc, tagsContainer].forEach((el) => {
        el.classList.remove("fade-slide-out");
        void el.offsetWidth;
      });
    }

    // Preload image
    const preload = new Image();
    preload.src = project.background;

    preload.onload = () => {
      img.classList.remove("img-fade-in");
      void img.offsetWidth;
      img.src = preload.src;
      img.alt = project.title;
      img.classList.add("img-fade-in");
    };

    // Update text content
    title.textContent = project.title;
    desc.textContent = project.description;
    tagsContainer.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");

    // Animate text in
    [title, desc, tagsContainer].forEach((el, i) => {
      el.style.animationDelay = `${0.3 + i * 0.1}s`;
      el.classList.add("fade-slide-in");
    });

    renderDots();
    startProgressAnimation();

    firstLoad = false;
  }, firstLoad ? 0 : 800);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % projects.length;
  updateCarousel(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  updateCarousel(currentIndex);
}

// Event listeners
document.getElementById("next-btn").addEventListener("click", nextSlide);
document.getElementById("prev-btn").addEventListener("click", prevSlide);

// Initialize carousel
updateCarousel(currentIndex);