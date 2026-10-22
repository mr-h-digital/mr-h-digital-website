const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const mobileQuery = window.matchMedia("(max-width: 700px)");

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  mobileNav.hidden = isOpen;
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});

mobileQuery.addEventListener("change", () => {
  if (!mobileQuery.matches) closeMenu();
  updateTabOrientation();
});

const tabList = document.querySelector(".experience-tabs");
const tabs = [...tabList.querySelectorAll('[role="tab"]')];

function updateTabOrientation() {
  tabList.setAttribute("aria-orientation", mobileQuery.matches ? "horizontal" : "vertical");
}

function selectTab(selectedTab) {
  for (const tab of tabs) {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const nextKey = mobileQuery.matches ? "ArrowRight" : "ArrowDown";
    const previousKey = mobileQuery.matches ? "ArrowLeft" : "ArrowUp";
    let targetIndex;
    if (event.key === nextKey) targetIndex = (index + 1) % tabs.length;
    else if (event.key === previousKey) targetIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[targetIndex]);
    tabs[targetIndex].focus();
  });
});
updateTabOrientation();

const questions = [
  "Are all chemicals correctly labelled?",
  "Are reception floors clean and free from litter?",
  "Are storage shelves clean?"
];
const responses = [];
const responseButtons = [...document.querySelectorAll(".response-option")];
const nextButton = document.getElementById("demo-next");
const question = document.getElementById("demo-question");
const feedback = document.getElementById("demo-feedback");
const fieldset = document.getElementById("demo-fieldset");
const completion = document.getElementById("demo-complete");
const progressText = document.getElementById("demo-progress-text");
const progressBar = document.getElementById("demo-progress-bar");
let questionIndex = 0;
let selectedResponse = null;

function setNextLabel(label) {
  nextButton.replaceChildren(document.createTextNode(`${label} `));
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.classList.add("icon");
  arrow.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#i-arrow");
  arrow.append(use);
  nextButton.append(arrow);
}

function showQuestion() {
  selectedResponse = null;
  question.textContent = questions[questionIndex];
  progressText.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  progressBar.style.width = `${questionIndex / questions.length * 100}%`;
  responseButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  nextButton.disabled = true;
  setNextLabel(questionIndex === questions.length - 1 ? "Finish preview" : "Next check");
  feedback.textContent = "Select a response to continue.";
}

responseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedResponse = button.dataset.response;
    responseButtons.forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
    nextButton.disabled = false;
    feedback.textContent = `${selectedResponse} selected.`;
  });
});

nextButton.addEventListener("click", () => {
  if (questionIndex === questions.length) {
    questionIndex = 0;
    responses.length = 0;
    completion.hidden = true;
    fieldset.hidden = false;
    showQuestion();
    responseButtons[0].focus();
    return;
  }
  if (!selectedResponse) return;
  responses.push(selectedResponse);
  questionIndex += 1;
  if (questionIndex < questions.length) {
    showQuestion();
    responseButtons[0].focus();
    return;
  }
  fieldset.hidden = true;
  completion.hidden = false;
  progressText.textContent = "3 of 3 observations captured";
  progressBar.style.width = "100%";
  const compliant = responses.filter((response) => response === "Compliant").length;
  document.getElementById("demo-summary").textContent =
    `${compliant} compliant. ${questions.length - compliant} needing attention. No audit data saved.`;
  feedback.textContent = "Preview complete. No data saved.";
  setNextLabel("Try again");
});

document.getElementById("year").textContent = String(new Date().getFullYear());
