document.addEventListener("DOMContentLoaded", () => {
  //first lets capture the data I enter
  const textCaptured = document.getElementById("input_text");
  myList = document.getElementById('listarea');

  let tasks = JSON.parse(localStorage.getItem("key")) || []; //a global array to store task objects

  for (let i = 0; i < tasks.length; i++) {
    renderTask(tasks[i]);
  }

  const addButtonClick = document
    .getElementById("add_task_button")
    .addEventListener("click", function () {
      //in this function, you will capture the text and firstly print it out in console
      const content = textCaptured.value.trim();

      if (content === "") {
        return;
      }

      const NewTask = {
        id: Date.now(),
        value: content,
        completionstatus: false,
      };

      //lets store this in the global array
      tasks.push(NewTask);

      //lets save this state to local storage now
      saveTasks();
      renderTask(NewTask);
    });

  function saveTasks() {
    localStorage.setItem("key", JSON.stringify(tasks));
  }

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id); //this will help us look for the element later, when we want to delete it

    if (task.completionstatus) {
      li.classList.add("completed");
    }

    li.innerHTML = `
        <span>${task.value}</span>   
        <button>Delete</button>`;

    li.addEventListener("click", (e) => {
      if (e.target.tagName == "BUTTON") return;

      //ELSE
      task.completionstatus = !task.completionstatus;
      li.classList.toggle("completed");
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter((t) => t.id != task.id); //prevents toggle from firing
      //so this returns all those, whose task.id is not t.id.
      li.remove();
      saveTasks();
    });

    //allows you to set multiple elements at once using a string of HTML.
    myList.appendChild(li);
  }
});
