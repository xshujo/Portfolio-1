const projects = [{
    title: "Project One",
    description: "First project description",
    tags: ["HTML", "CSS", "JS"],
    background: "Images/project1.png"
  },
  {
    title: "Project Two",
    description: "Second project description",
    tags: ["React", "Node"],
    background: "Images/project2.png"
  },
  {
    title: "Project Three",
    description: "Third project description",
    tags: ["Figma", "UX"],
    background: "Images/project3.png"
  }
];

let currentIndex = 0;

const main = document.querySelector("main");
const title = document.querySelector("#main-project-info h2");
const desc = document.querySelector("#main-project-info p");
const tagsContainer = document.querySelector("#project-tags-ctn");

const dotsContainer = document.getElementById("nav-dots");

function updateCarousel(index) {
  const project = projects[index];
  main.style.backgroundImage = `url(${project.background})`;
  title.textContent = project.title;
  desc.textContent = project.description;
  tagsContainer.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join("");
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % projects.length;
  updateCarousel(currentIndex);
});

document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  updateCarousel(currentIndex);
});

updateCarousel(currentIndex);

function renderDots() {
  dotsContainer.innerHTML = projects.map((_, i) => `
    <button class="nav-dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></button>
  `).join("");

  document.querySelectorAll(".nav-dot").forEach(dot => {
    dot.addEventListener("click", (e) => {
      currentIndex = parseInt(e.target.dataset.index);
      updateCarousel(currentIndex);
      renderDots();
    });
  });
}

function updateCarousel(index) {
  const project = projects[index];
  main.style.backgroundImage = `url(${project.background})`;
  title.textContent = project.title;
  desc.textContent = project.description;
  tagsContainer.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join("");
  renderDots();
}