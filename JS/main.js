let iconStatus = [`fa-regular fa-circle-check`, `fa-solid fa-hourglass-end`];

let addTask = document.querySelector(".container .list .add-task"); // add task field
let tasksHolder = document.querySelector(".container .list .holder");

let userData = Array.from(
  document.querySelectorAll(".container .profile .back section")
); // User Data Section [button & span]

let User = [];

let dataType = ["Name", "Email", "Phone", "Brief"];
let asset = false;

let Tasks = []; // Array Of All Tasks

getLocalStorage();

class TaskTemp {
  constructor(name, details, status) {
    this.name = name || "Unknown";
    this.details = details || "Anything";
    this.status = status;
    this.id = Date.now();
  }
  ShowDetails() {
    // Sweet Alert Here To Show All Data
  }
}

// document.querySelector(".container .profile").onmouseover = ()=>{ // OnClick Show Details
//   document.querySelector(".container .profile").style = 'transform:rotateY(180deg)'
// }
// document.querySelector(".container .profile").onmouseout = ()=>{ // OnClick Show Details
//   document.querySelector(".container .profile").style = 'transform:rotateY(0)'
// }

document.ondblclick;

document.querySelector(".container .profile").ondblclick = () => {
  if (!asset) {
    document.querySelector(".container .profile").style =
      "transform:rotateY(180deg)";
    asset = true;
  } else {
    document.querySelector(".container .profile").style =
      "transform:rotateY(0)";
    asset = false;
  }
};

userData.forEach((el, index) => {
  el.firstElementChild.onclick = async () => {
    // let newData = await EditData(dataType[index]);

    new Promise((resolve) => {
      resolve(
        Swal.fire({
          title: "Edite Your Information ",
          input: "text",
          inputLabel: `Your ${dataType[index]}`,
          inputPlaceholder: "Enter New Info",
          inputAttributes: {
            maxlength: 3 == index ? 200 : 25,
            autocapitalize: "on",
            autocorrect: "on",
          },
        })
      );
    }).then(({ value }) => {
      User[index] = value;
      addUserInfoToLocal(User);
    });
  };
});

// Get User Data
window.onload = () => {
  GitUserInfo();
};

function GitUserInfo(anyway = false) {
  User = JSON.parse(window.localStorage.getItem("user"));
  if (!User || anyway) {
    new Promise((resolve) => {
      resolve(
        Swal.fire({
          title: "Some Data",
          html:
            '<input type="text" placeholder="Your Name" id="swal-userName" class="swalInput">' +
            '<input type="email" placeholder="Your Email" id="swal-email" class="swalInput">' +
            '<input type="phone" placeholder="Your Phone" id="swal-phone" class="swalInput">' +
            '<input type="text" placeholder="Brief About You" id="swal-brief" class="swalInput">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById("swal-userName").value,
              document.getElementById("swal-email").value,
              document.getElementById("swal-phone").value,
              document.getElementById("swal-brief").value,
            ];
          },
        })
      );
    }).then(({ value }) => {
      if (value[0] == "") value = null;
      addUserInfoToLocal(value);
    });
  } else {
    DisplayUser(User);
  }
}

function addUserInfoToLocal(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
  GitUserInfo();
}

function DisplayUser([user, email, phone, brief]) {
  document.querySelector(".container .profile h1").textContent = [
    user.split(" ")[0],
    user.split(" ")[1],
  ].join(" ");
  document.querySelector(".container .profile p").textContent = brief;

  userData[0].lastElementChild.textContent = user || "Unknown";
  userData[1].lastElementChild.textContent = email || "Unknown";
  userData[2].lastElementChild.textContent = phone || "Unknown";
  userData[3].lastElementChild.textContent = brief || "Unknown";
  userData[3].lastElementChild.setAttribute("title", brief);
}

// Change User Data

function createTask({ name, id, status }) {
  let Div = document.createElement("div"); // Create Main Div
  let statusIcone = document.createElement("i"); // icon status done | pending
  let deleteIcone = document.createElement("i"); // delete icon to delete task
  let section = document.createElement("section"); //TO Hold Icons
  let taksName = document.createElement("p"); // Task Name
  let btnshow = document.createElement("button");
  let btndelete = document.createElement("button");

  taksName.innerHTML = name; // Assign Name To Element

  deleteIcone.classList = `fa-solid fa-xmark delete`; // Put Class Name To Icon Delete

  Div.classList.add("task"); // Add Default Class To Element

  Div.setAttribute("data-id", id); // Add Id to main element

  if (status == "done") {
    // if Taks Done
    Div.classList.add("done"); // Add Class done To Main Element
    statusIcone.classList = iconStatus[0]; // Add Icon Done
  } else {
    // Else
    Div.classList.add("pending"); // Add Class pending To Main Element
    statusIcone.classList = iconStatus[1]; // add icon pending
  }
  btndelete.setAttribute("title", "Delete Task");
  btnshow.setAttribute("title", "Show Details");

  btndelete.appendChild(deleteIcone);
  btnshow.appendChild(statusIcone);

  section.appendChild(btndelete); // Append Icon
  section.appendChild(btnshow); // Append Icon

  Div.appendChild(taksName);

  Div.appendChild(section);

  tasksHolder.appendChild(Div); // Add Task Element To PAge
}

addTask.lastElementChild.onclick = () => {
  // Add New Task
  let taskName = addTask.firstElementChild.value; // Get Task Name From Input Field

  if (!taskName) {
    return;
  }

  new Promise((resolve) => {
    resolve(
      Swal.fire({
        // Get Task Details From User
        input: "textarea",
        inputLabel: "Details",
        inputPlaceholder: "Type Task Details ...",
        inputAttributes: {
          "aria-label": "Type your message here",
        },
        showCancelButton: false,
      })
    );
  })
    .then(({ value: text }) => {
      if (text) {
        // Show Message Add New Task
        Swal.fire(`You Add New Task :${taskName}`);
      }

      const Task = new TaskTemp(taskName, text, "pending");

      Tasks.push(Task); // Add Task To Tasks
      return Tasks;
    })
    .then(addLocalStorage_)
    .then(() => {
      addTask.firstElementChild.value = "";
    });
};

function addLocalStorage_(TASKS = []) {
  window.localStorage.setItem("Tasks", JSON.stringify(TASKS));
  getLocalStorage(TASKS);
}

function getLocalStorage(TASKS) {
  Tasks = TASKS = JSON.parse(window.localStorage.getItem("Tasks")) || [];
  TASKS ? AddToPage(TASKS) : null;
}

function AddToPage(TASKS = []) {
  tasksHolder.innerHTML = "";
  for (let i = 0; i < TASKS.length; i++) {
    createTask(TASKS[i]);
  }
  ShowDeleteEvent();
}

async function ShowDeleteEvent() {
  Array.from(tasksHolder.children).forEach((el) => {
    let task;
    for (const ta of Tasks) {
      if (+el.getAttribute("data-id") == ta.id) {
        task = ta;
      }
    }

    el.firstElementChild.onclick = async () => {
      // Show Details Event

      await Swal.fire({
        icon: task.status == "done" ? "success" : "warning",
        title: task.name,
        text: task.details,
        footer: new Date(task.id).toString().slice(0, 25),
      });
    };

    el.lastElementChild.firstElementChild.onclick = () => {
      // Delete Specific Task
      Tasks = Tasks.filter((task) => {
        return +el.getAttribute("data-id") != task.id;
      });
      addLocalStorage_(Tasks);
    };

    el.lastElementChild.lastElementChild.onclick = () => {
      // Change Status Of Specific Task
      if (+el.getAttribute("data-id") == task.id) {
        let inputOptions = { done: "Done", pending: "Pending" };
        new Promise((resolve) => {
          resolve(
            Swal.fire({
              title: "Change Status",
              input: "radio",
              inputOptions: inputOptions,
              inputValidator: (value) => {
                if (!value) {
                  return "You need to choose something!";
                }
              },
            })
          );
        })
          .then(({ value: status }) => {
            task.status = status;
          })
          .then(() => {
            addLocalStorage_(Tasks);
          });
      }
    };
  });
}
