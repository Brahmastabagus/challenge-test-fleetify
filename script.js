// Toggle dark mode and save preference to localStorage
const darkModeToggle = document.getElementById("dark-mode-toggle");
const html = document.documentElement;

// Load dark mode preference from localStorage
if (localStorage.getItem("darkMode") === "enabled") {
  html.classList.add("dark");
}

// Event listener untuk toggle dark mode
darkModeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  if (html.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});

// Simpan todos ke localStorage
let todos = [];

// Load todos dari localStorage
function loadTodos() {
  const savedTodos = localStorage.getItem("todos");
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
    renderTodos();
  }
}

// Simpan todos ke localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render satu todo menggunakan template
function renderTodoItem(todo) {
  const template = document.querySelector("#todo-template");
  const clone = template.content.cloneNode(true);

  const todoTitle = clone.querySelector("#todo-title");
  const todoDesc = clone.querySelector("#todo-desc");

  todoTitle.textContent = todo.title;
  todoDesc.textContent = todo.desc;

  // Menambahkan id
  const todoItem = clone.querySelector(".todo-item");
  todoItem.dataset.id = todo.id;
  const deleteBtn = clone.querySelector("#delete-btn");
  deleteBtn.onclick = () => deleteTodo(todo.id);
  const completeBtn = clone.querySelector("#complete-btn");
  completeBtn.onclick = () => completeTodo(todo.id);
  const editBtn = clone.querySelector("#edit-btn");
  editBtn.onclick = () => editTodo(todo.id);

  todoItem.classList.toggle("completed", todo.completed);

  if (todoItem.classList.contains("completed")) editBtn.disabled = true;

  return clone;
}

// Render semua todos
function renderTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos"));
  const todoList = document.querySelector("#todo-list");
  const container = document.querySelector("#todo-container")
  todoList.innerHTML = "";

  todos.sort((a, b) => b.id - a.id);

  todos.forEach(todo => {
    todoList.appendChild(renderTodoItem(todo));
  });

  if (todos.length === 0 && savedTodos.length === 0) {
    container.classList.add("hidden");
  } else {
    container.classList.remove("hidden");
  }

  todoList.querySelectorAll('.todo-item').forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('show');
    }, index * 200);
  })
}

// Render satu todo menggunakan template
function templateTodo(text) {
  const template = document.querySelector("#todo-template");
  const clone = template.content.cloneNode(true);
  clone.querySelector("#todo-title").textContent = text.inputTitle;
  clone.querySelector("#todo-desc").textContent = text.inputDesc;

  document.querySelector("#todo-list").appendChild(clone);
}

// Tambahkan todo
function addTodo() {
  let inputTitle = document.querySelector("#todo-input-title")
  let inputDesc = document.querySelector("#todo-input-desc")
  const textTitle = inputTitle.value.trim();
  const textDesc = inputDesc.value.trim();

  if (textTitle && textDesc) {
    document.querySelector("#todo-filter").value = "all";
    filterTodo()
    loadTodos()
    const newTodo = {
      id: Date.now(),
      title: textTitle,
      desc: textDesc,
      completed: false
    }

    todos.push(newTodo);
    saveTodos();
    renderTodos();
  } else alert("Input tidak boleh kosong")

  inputTitle.value = "";
  inputDesc.value = "";
}

// Handle delete todo
function deleteTodo(id) {
  document.querySelector("#todo-filter").value = "all";
  const savedTodos = JSON.parse(localStorage.getItem("todos"));
  todos = savedTodos.filter(todo => todo.id !== id);
  saveTodos();
  loadTodos();
}

// Handle complete todo
function completeTodo(id) {
  const savedTodos = JSON.parse(localStorage.getItem("todos"));
  const index = savedTodos.findIndex(todo => todo.id === id);
  savedTodos[index].completed = !savedTodos[index].completed;
  todos = savedTodos;

  saveTodos();
  document.querySelector("#todo-filter").value = "all";
  loadTodos();
}

// Handle edit todo
function editTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  document.querySelector("#todo-input-title").value = todo.title;
  document.querySelector("#todo-input-desc").value = todo.desc;
  deleteTodo(id);
}

// Handle filter todo
function filterTodo() {
  const filter = document.querySelector("#todo-filter").value;
  const todoEmpty = document.querySelector("#todo-empty");

  if (filter === "all") {
    todoEmpty.classList.add("hidden");
    loadTodos();
  } else if (filter === "completed") {
    todoEmpty.classList.add("hidden");
    todos = todos.filter(todo => todo.completed);
    if (todos.length === 0) {
      todoEmpty.classList.remove("hidden");
      todoEmpty.textContent = "Tidak ada tugas yang sudah selesai";
    }
    renderTodos();
  } else if (filter === "uncompleted") {
    todoEmpty.classList.add("hidden");
    todos = todos.filter(todo => !todo.completed);
    if (todos.length === 0) {
      todoEmpty.classList.remove("hidden");
      todoEmpty.textContent = "Tidak ada tugas yang belum selesai";
    }
    renderTodos();
  }
}

loadTodos()