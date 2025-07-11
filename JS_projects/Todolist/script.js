document.addEventListener("DOMContentLoaded", () => {
  // What ever moving elements you have first go and grab them

  const todoInput = document.getElementById("todo-input");
  const addTask = document.getElementById("add-task-button");
  // we also grab the list as here we will inject the task
  const myList = document.getElementById("todo-list");

  //after loading the site, load stuff from local storage. If not, then let the array be empty

  let tasks = JSON.parse(localStorage.getItem("local_storage_key")) || [];

  // now we want to render those tasks right
  for (let i = 0; i < tasks.length; i++) {
    renderTask(tasks[i]);
  }

  addTask.addEventListener("click", function () {
    const taskText = todoInput.value.trim();
    //now we just check if someone accidentaly skipped writing stuff in

    if (taskText === "") {
      return;
    }

    //now the list element we get, should be an object with 3 properties.
    //1. it has unique ID
    //2. it has some text
    //3. it has a boolean property(indicating if its completed)

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    //so everytime the button is clicked, a new object is created

    //now push this task in the task array
    tasks.push(newTask);
    saveTasks(); //sending stuff to local storage

    //we now also have to clean the todo input
    todoInput.value = "";
    console.log(tasks);
  });

  //we put out the tasks array onto the browser local storage. it only accepts strings. Stores stuff as key-value pairs.

  // WHY DO WE NEED IT THOUGH ? Because without it, everything resets on page reload. So for a simple web app like a to-do list, you'd lose all tasks unless you save them to local storage or a backend.

  function saveTasks() {
    localStorage.setItem("local_storage_key", JSON.stringify(tasks));
  }

  //now the job of this function is to read from local storage
  function renderTask(task) {
    console.log(task)
  }
});
