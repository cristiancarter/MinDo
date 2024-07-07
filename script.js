const inputBox = document.getElementById("inputBox");
        const priorityBox = document.getElementById("priorityBox");
        const taskGroups = document.getElementById("taskGroups");

        const priorities = ["urgent", "important", "today", "other"];

        function addTask() {
            if (inputBox.value === "") {
                alert("Please enter a task");
            } else {
                const priority = priorityBox.value;
                createTaskElement(inputBox.value, priority);
                inputBox.value = "";
                priorityBox.value = "other";
                saveData();
            }
        }

        function createTaskElement(taskText, priority) {
            const taskElement = document.createElement("li");
            taskElement.innerHTML = `
                <span class="task-text">${taskText}</span>
                <div class="actions">
                    <button onclick="editTask(this.closest('li'))"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteTask(this.closest('li'))"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;

            const groupId = `${priority}-group`;
            let group = document.getElementById(groupId);

            if (!group) {
                group = createTaskGroup(priority);
            }

            const taskList = group.querySelector("ul");
            taskList.appendChild(taskElement);
            sortTasks(taskList);
        }

        function createTaskGroup(priority) {
            const group = document.createElement("div");
            group.className = "task-group";
            group.id = `${priority}-group`;
            group.innerHTML = `
                <div class="group-header" onclick="toggleGroup(this.parentElement)">
                    <i class="fas fa-chevron-down"></i>
                    <h2>${priority.charAt(0).toUpperCase() + priority.slice(1)}</h2>
                </div>
                <div class="group-tasks">
                    <ul></ul>
                </div>
            `;
            taskGroups.appendChild(group);
            return group;
        }

        function toggleGroup(group) {
            const tasksDiv = group.querySelector(".group-tasks");
            const icon = group.querySelector(".group-header i");
            tasksDiv.classList.toggle("show");
            icon.classList.toggle("fa-chevron-down");
            icon.classList.toggle("fa-chevron-up");
        }

        function editTask(li) {
            const taskSpan = li.querySelector(".task-text");
            const newText = prompt("Edit task:", taskSpan.textContent);
            if (newText !== null && newText.trim() !== "") {
                taskSpan.textContent = newText.trim();
                saveData();
            }
        }

        function deleteTask(li) {
            if (confirm("Are you sure you want to delete this task?")) {
                const group = li.closest(".task-group");
                li.remove();
                if (group.querySelector("ul").children.length === 0) {
                    group.remove();
                }
                saveData();
            }
        }

        taskGroups.addEventListener("click", function(e) {
            if (e.target.tagName === "LI" || e.target.className === "task-text") {
                const li = e.target.closest("li");
                li.classList.toggle("checked");
                saveData();
            }
        });

        function saveData() {
            localStorage.setItem("data", taskGroups.innerHTML);
        }

        function showTask() {
            const savedData = localStorage.getItem("data");
            if (savedData) {
                taskGroups.innerHTML = savedData;
                document.querySelectorAll(".task-group").forEach(group => {
                    const tasksDiv = group.querySelector(".group-tasks");
                    if (tasksDiv.children.length > 0) {
                        tasksDiv.classList.add("show");
                    }
                });
            } else {
                priorities.forEach(createTaskGroup);
            }
        }

        function sortTasks(taskList) {
            const tasks = Array.from(taskList.children);
            tasks.sort((a, b) => {
                const textA = a.querySelector(".task-text").textContent.toLowerCase();
                const textB = b.querySelector(".task-text").textContent.toLowerCase();
                return textA.localeCompare(textB);
            });
            taskList.innerHTML = "";
            tasks.forEach(task => taskList.appendChild(task));
        }

showTask();