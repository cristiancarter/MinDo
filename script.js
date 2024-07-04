const inputBox = document.getElementById("inputBox");
const priorityBox = document.getElementById("priorityBox");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("Please enter a task");
  } else if (priorityBox.value === "none") {
    alert("Please select a priority");
  } else {
    let li = document.createElement("li");
    li.innerText = inputBox.value;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    let priorityLabel = document.createElement("span");
    priorityLabel.className = "priority-label " + priorityBox.value;
    priorityLabel.innerText = priorityBox.value.charAt(0).toUpperCase();
    li.appendChild(priorityLabel);

    listContainer.appendChild(li);

    inputBox.value = "";
    priorityBox.value = "none";

    sortTasks();
    saveData();
  }
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (
      e.target.tagName === "SPAN" &&
      e.target.className.includes("priority-label")
    ) {
      showTooltip(e.target.parentElement, e.target.innerText.toLowerCase());
    } else if (
      e.target.tagName === "SPAN" &&
      !e.target.className.includes("priority-label")
    ) {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
  sortTasks();
}

function sortTasks() {
  let tasks = Array.from(listContainer.getElementsByTagName("li"));
  tasks.sort((a, b) => getPriority(b) - getPriority(a));
  listContainer.innerHTML = "";
  tasks.forEach((task) => listContainer.appendChild(task));
}

function getPriority(task) {
  if (task.querySelector(".priority-label")) {
    const priority = task
      .querySelector(".priority-label")
      .innerText.toLowerCase();
    switch (priority) {
      case "urgent":
        return 3;
      case "important":
        return 2;
      case "today":
        return 1;
      default:
        return 0;
    }
  }
  return 0;
}

showTask();
