const projects = [{
    title: "Project One",
    description: "First project description",
    tags: ["HTML", "CSS", "JS"],
    background: "Images/project1.png",
  },
  {
    title: "Project Two",
    description: "Second project description",
    tags: ["React", "Node"],
    background: "Images/project2.png",
  },
  {
    title: "Project Three",
    description: "Third project description",
    tags: ["Figma", "UX"],
    background: "Images/project3.png",
  },
];

let currentIndex = 0;
const main = document.querySelector("main");
const title = document.querySelector("#main-project-info h2");
const desc = document.querySelector("#main-project-info p");
const tagsContainer = document.querySelector("#project-tags-ctn");
const dotsContainer = document.getElementById("nav-dots");

const radius = 8;
const circumference = 2 * Math.PI * radius;

let animationFrameId;

function setProgress(circle, progress) {
  const offset = circumference * progress;
  circle.style.strokeDashoffset = offset;
}

function renderDots() {
  dotsContainer.innerHTML = projects
    .map(
      (_, i) => `
      <button class="nav-dot ${i === currentIndex ? "active" : ""}" data-index="${i}" style="position: relative;">
        ${
          i === currentIndex
            ? `<svg class="progress-ring" width="24" height="24" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); pointer-events:none;">
                <circle
                  class="progress-ring__circle"
                  stroke="black"
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
    let progress = Math.min(elapsed / 5000, 1);

    setProgress(circle, progress);

    if (elapsed < 5000) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        nextSlide();
      }, 500);
    }
  }

  setProgress(circle, 0);
  animationFrameId = requestAnimationFrame(animate);
}

function updateCarousel(index) {
  const project = projects[index];
  main.style.backgroundImage = `url(${project.background})`;
  title.textContent = project.title;
  desc.textContent = project.description;
  tagsContainer.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  renderDots();
  startProgressAnimation();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % projects.length;
  updateCarousel(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  updateCarousel(currentIndex);
}

document.getElementById("next-btn").addEventListener("click", () => {
  nextSlide();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  prevSlide();
});

updateCarousel(currentIndex);