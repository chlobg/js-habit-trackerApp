const habitInput = document.getElementById("habit-input");
const addBtn = document.getElementById("habit-add");
const list = document.getElementById("habit-list");
const filters = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");
let themeIcon = document.getElementById("theme-icon");
const emptyMessage = document.getElementById("empty-message");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let filter = "all";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = new Date().getDay() - 1;

function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function render() {
  list.innerHTML = "";
  const visible = habits.filter((habit) => {
    const checked = habit.days[todayIdx];
    if (filter === "complete") return checked;
    if (filter === "incomplete") return !checked;
    return true;
  });

  emptyMessage.style.display = visible.length === 0 ? "block" : "none";

  visible.forEach((habit) => {
    const card = document.createElement("div");
    card.className = "habit-card";

    const title = document.createElement("div");
    title.className = "habit-title";
    title.textContent = habit.name;
    card.appendChild(title);

    const daysRow = document.createElement("div");
    daysRow.className = "habit-days";

    days.forEach((day, i) => {
      const el = document.createElement("div");
      el.className = "habit-day";
      if (habit.days[i]) el.classList.add("checked");
      if (i === todayIdx) el.classList.add("today");
      const label = document.createElement("span");
      label.className = "day-label";
      label.textContent = day;
      el.appendChild(label);

      el.onclick = () => {
        habit.days[i] = !habit.days[i];
        save();
        render();
      };
      daysRow.appendChild(el);
    });

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 24 24">
        <path d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm1 2h4v1H10V5zm-1 3v10h2V8H9zm4 0v10h2V8h-2z"/>
      </svg>
    `;
    del.onclick = () => {
      if (confirm("Are you sure you want to delete this habit?")) {
        habits = habits.filter((h) => h.id !== habit.id);
        save();
        render();
      }
    };

    card.appendChild(daysRow);
    card.appendChild(del);
    list.appendChild(card);
  });
}

addBtn.onclick = () => {
  const name = habitInput.value.trim();
  if (!name) return;
  habits.push({ id: Date.now(), name, days: Array(7).fill(false) });
  habitInput.value = "";
  save();
  render();
};

filters.forEach((btn) => {
  btn.onclick = () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  };
});

function setThemeIcon(dark) {
  const svg = dark
    ? `<svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>`
    : `<svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79z"/></svg>`;
  themeIcon.outerHTML = svg;
  themeIcon = document.getElementById("theme-icon");
}

themeToggle.onclick = () => {
  const dark = document.body.classList.toggle("dark");
  setThemeIcon(dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  setThemeIcon(true);
} else {
  setThemeIcon(false);
}

render();
