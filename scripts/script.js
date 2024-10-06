const wrapper = document.querySelector(".tasks");
const filters = document.querySelector(".filters");
const taskInput = document.querySelector("#task__input");
const taskCreateForm = document.querySelector("#task__form");

let tasksStorage = JSON.parse(localStorage.getItem("tasks")) || [];

// =============== helper functions ===============
function saveAndRerenderTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasksStorage));
	renderTasks(tasksStorage);
}

function rerenderTasksWithoutSave(arrToRerender) {
	renderTasks(arrToRerender);
}

function randomId(length = 6) {
	return Math.random()
		.toString(36)
		.substring(2, length + 2);
}

const taskMethods = {
	changeTaskStatus(taskId) {
		tasksStorage = tasksStorage.map((element) => {
			if (element.id === taskId) {
				return { ...element, status: !element.status };
			}

			return element;
		});

		saveAndRerenderTasks(tasksStorage);
	},
	deleteTask(taskId) {
		tasksStorage = tasksStorage.filter((element) => {
			if (element.id !== taskId) return true;
		});

		saveAndRerenderTasks(tasksStorage);
	},
	makeImportant(taskId) {
		tasksStorage = tasksStorage.map((element) => {
			if (element.id === taskId) {
				return { ...element, important: !element.important };
			}

			return element;
		});

		saveAndRerenderTasks(tasksStorage);
	}
};

const filterMethods = {
	done() {
		const filteredTasks = tasksStorage.filter((element) => element.status);
		rerenderTasksWithoutSave(filteredTasks);
	},
	important() {
		const filteredTasks = tasksStorage.filter((element) => element.important);
		rerenderTasksWithoutSave(filteredTasks);
	},
	all() {
		rerenderTasksWithoutSave(tasksStorage);
	}
};

function createTask(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const taskData = Object.fromEntries(formData.entries());

	if (!taskData.task.trim()) return;

	tasksStorage = [...tasksStorage, { ...taskData, id: randomId(), status: false, important: false }];

	saveAndRerenderTasks(tasksStorage);
	taskInput.value = null;
}

function renderTasks(arr) {
	let template = "";

	arr.forEach((element) => {
		template += `
			<div class="tasks__item ${element.important ? "red" : ""}" data-id=${element.id}>
					<div class="tasks__left">
						${element.task}
					</div>
					
					<div class="tasks__right">
						<input 
							type="checkbox" 
							name="status" 
							class="task__status" 
							data-method="changeTaskStatus"
							${element.status && "checked"}
						/> 
						<button data-method="deleteTask">delete</button>
						<button data-method="makeImportant">Important</button>
					</div>
			</div>
		`;
	});

	wrapper.innerHTML = template;
}

renderTasks(tasksStorage);

function taskFunctionality(event) {
	const currentElement = event.target;
	const parent = currentElement.closest(".tasks__item");

	if (!parent) return;

	const currentTaskId = parent.dataset.id;
	const currentTaskMethod = currentElement.dataset.method;

	if (!currentTaskMethod) return;

	taskMethods[currentTaskMethod](currentTaskId);
}

function filterFunctionality(event) {
	const filterType = event.target.dataset.filter;

	if (!filterType) return;

	filterMethods[filterType]();
}

taskCreateForm.addEventListener("submit", createTask);
document.addEventListener("click", taskFunctionality);
filters.addEventListener("click", filterFunctionality);
