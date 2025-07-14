const habitInput = document.getElementById("habit-input");
const addBtn = document.getElementById("habit-add");
const list = document.getElementById("habit-list");
const filters = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");
let themeIcon = document.getElementById("theme-icon");
const noHabitMessage = document.getElementById("no-habit-message");
const noMatchMessage = document.getElementById("no-match-message");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let filter = "all";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function render() {
  list.innerHTML = "";
  noHabitMessage.style.display = "none";
  noMatchMessage.style.display = "none";

  const visible = habits.filter((habit) => {
    const checked = habit.days[todayIdx];
    if (filter === "complete") return checked;
    if (filter === "incomplete") return !checked;
    return true;
  });

  if (habits.length === 0) {
    if (filter === "all") {
      noHabitMessage.style.display = "block";
    } else {
      noMatchMessage.style.display = "block";
    }
    return;
  }

  if (visible.length === 0) {
    noMatchMessage.style.display = "block";
    return;
  }

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
    del.textContent = "🗑️";
    del.onclick = () => {
      if (confirm("Are you sure you want to delete this habit?")) {
        habits = habits.filter((h) => h.id !== habit.id);
        save();
        render();
        alert("Item has been successfully removed");
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
  themeIcon.textContent = dark ? "☀️" : "🌙";
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
