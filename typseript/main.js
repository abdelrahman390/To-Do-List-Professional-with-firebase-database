var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, deleteDoc, doc, getDocs, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
let module = {};
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtk_y7igrRmQwWhRVR27wWAyVKtHuJfIo",
    authDomain: "to-do-web-app-database.firebaseapp.com",
    projectId: "to-do-web-app-database",
    storageBucket: "to-do-web-app-database.appspot.com",
    messagingSenderId: "916322817429",
    appId: "1:916322817429:web:c9df81a22100de535b529c"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app); // for modern Firebase version 9+
// function convertData(){
//     let id = '978'
//     let data = {
//         "title": "حجات لتحضيرات السفر للدراسه",
//         "date": "8/11/2024, 4:27:18 PM",
//         "data": [
//             [
//                 {
//                     "num": "1 -",
//                     "content": "test As لتقويه المجموع بتاعي في ثانوي",
//                     "status": "false"
//                 },
//                 {
//                     "num": "2 -",
//                     "content": "take ilets course",
//                     "status": "false"
//                 }
//             ]
//         ],
//         "completeDate": "not-completed"
//     }
//     let newData = {}
//     for (let i = 0; i < data.data[0].length; i++) {
//         newData[i] = data.data[0][i]
//     }
//     let NewTask = {
//         title: `${data.title}`,
//         date: `${data.date}`,
//         data: newData
//     }
//     console.log(NewTask)
//     addTask(id, NewTask)
// }
// convertData()
// Add a new document in collection "Tasks"
function addTask(id, taskData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id, taskData);
        try {
            yield setDoc(doc(db, "tasks", id), {
                id: id,
                taskData
            });
        }
        catch (error) {
            console.error('Error adding user: ', error);
        }
    });
}
function addUser(id, taskData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id, taskData);
        try {
            yield setDoc(doc(db, "tasks", id), {
                id: id,
                taskData
            });
        }
        catch (error) {
            console.error('Error adding user: ', error);
        }
    });
}
function getAllTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersCollection = collection(db, 'tasks');
            const querySnapshot = yield getDocs(usersCollection);
            let allTasks = {};
            querySnapshot.forEach((doc) => {
                // console.log(`${doc.id} =>`, doc.data());
                let id = doc.id;
                let data = doc.data();
                addTasksFromDataBase(id, data);
                allTasks[id] = data;
            });
            sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
            tasksMain();
            handleEveryNestedTaskData();
            handleTasksViewInPage();
            addSettingToTasksBox();
            tasksSetting();
        }
        catch (error) {
            console.error("Error getting documents: ", error);
        }
    });
}
getAllTasks();
function deleteTaskFromDatabase(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(taskId);
            yield deleteDoc(doc(db, "tasks", taskId));
        }
        catch (error) {
            console.error('Error adding user: ', error);
        }
    });
}
let tasksData, slider = document.querySelector("section main .slider"), sliderButton = document.querySelector("section main .slider span img"), sliderDeleteHistoryButton = document.querySelector("section main .slider .bottom .delete-history"), date = document.querySelector("section header .max-width .date"), section = document.querySelector("section"), deletedTaskMain = document.querySelector("section main .deleted-task-main"), deletedTaskContainer = document.querySelector("section main .deleted-task-main .deleted-tasks-container"), deletedTaskExitButton = document.querySelector("section main .deleted-task-main .exit"), tasksContainer = document.querySelector("section main .tasks-container"), deleteTaskButton = document.querySelector("section main .slider .clear-tasks"), noButton = document.querySelector("section .overlay .alertBox .mainBox .buttonsBox .noButton"), confirmButton = document.querySelector("section .overlay .alertBox .mainBox .buttonsBox .confirmButton"), settingButton, settingBox, deleteButton, editButton = null, running = false, user;
if (sessionStorage.getItem('sender') !== null) {
    user = sessionStorage.getItem('sender');
}
else {
    sessionStorage.setItem('sender', "null");
}
if (sessionStorage.getItem('loggedIn') == null) {
    sessionStorage.setItem("loggedIn", String(false));
}
function checkIfLogIn() {
}
checkIfLogIn();
function time() {
    let now = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    date.innerHTML = now.toLocaleString('en-US', options);
}
time();
setInterval(time, 500);
function handleTasksViewInPage() {
    // console.log("test")
    // window.addEventListener('resize', function() {
    let allTasksCard = document.querySelectorAll(".tasks-container .task-card");
    let tasksContainerWidth = allTasksCard[0].parentElement.offsetWidth;
    let taskWidth = allTasksCard[0].offsetWidth;
    let gap = 20;
    let numberOfBoxes = 1;
    while (tasksContainerWidth / numberOfBoxes >= (taskWidth + gap)) {
        numberOfBoxes++;
    }
    let freeSpace = tasksContainerWidth - (taskWidth * (numberOfBoxes - 1)) - (gap * numberOfBoxes - 1);
    allTasksCard.forEach((element, index) => {
        if (numberOfBoxes > 3) {
            if ((index + 2) <= numberOfBoxes) {
                if (index == 0) {
                    element.style.cssText = `left: ${0} `;
                }
                else {
                    element.style.cssText = `left: ${(index * (taskWidth + gap)) + ((freeSpace / (numberOfBoxes - 1)) * index)}px`;
                }
            }
            else {
                let topElement = (allTasksCard[(index + 1) - numberOfBoxes].clientHeight + 10);
                let styles = window.getComputedStyle(allTasksCard[(index + 1) - numberOfBoxes]);
                let topElementTopPosition = styles.getPropertyValue("top").split("px")[0];
                element.style.cssText = `top: ${+topElementTopPosition + +topElement + gap}px; left: ${styles.getPropertyValue('left')}`;
            }
        }
        else if (numberOfBoxes == 3) {
            if ((index + 2) <= numberOfBoxes) {
                if (index == 0) {
                    element.style.cssText = `left: ${freeSpace / 3}px `;
                }
                else {
                    element.style.cssText = `left: ${(index * (taskWidth + gap)) + ((freeSpace / 3) * 2)}px`;
                }
            }
            else {
                let topElement = (allTasksCard[(index + 1) - numberOfBoxes].clientHeight + 10);
                let styles = window.getComputedStyle(allTasksCard[(index + 1) - numberOfBoxes]);
                let topElementTopPosition = styles.getPropertyValue("top").split("px")[0];
                element.style.cssText = `top: ${+topElementTopPosition + +topElement + gap}px; left: ${styles.getPropertyValue('left')}`;
            }
        }
        else if (numberOfBoxes == 2) {
            if (index == 0) {
                if (index == 0) {
                    element.style.cssText = `left: ${freeSpace / 2 + gap}px `;
                }
            }
            else {
                let topElement = (allTasksCard[(index + 1) - numberOfBoxes].clientHeight + 10);
                let styles = window.getComputedStyle(allTasksCard[(index + 1) - numberOfBoxes]);
                let topElementTopPosition = styles.getPropertyValue("top").split("px")[0];
                element.style.cssText = `top: ${+topElementTopPosition + topElement + gap + 10}px; left: ${styles.getPropertyValue('left')}`;
            }
        }
    });
    // });
}
function sliderMain() {
    function sliderHandle() {
        slider.addEventListener('mouseover', function () {
            slider.classList.add('open');
        });
        slider.addEventListener('mouseout', function () {
            slider.classList.remove('open');
        });
        if (window.innerWidth <= 600) {
            sliderButton.addEventListener("click", function () {
                slider.classList.toggle("open");
            });
        }
    }
    sliderHandle();
}
sliderMain();
function checkIfAllTasksAreDone(task) {
    // console.log(task) //{"0": {}, "1": {}, "2": {}} every Task?
    let allTasksDone = true;
    task.forEach(task => {
        if (task.getAttribute("data-status") !== "complete") {
            allTasksDone = false;
        }
    });
    let taskId = task[0].parentElement.parentElement.getAttribute("data-id");
    let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
    if (allTasksDone) {
        // Set opacity to 0.7
        task[0].parentElement.parentElement.setAttribute("data-status", "complete");
        let taskId = task[0].parentElement.parentElement.getAttribute("data-id");
        let div = document.createElement("div");
        div.classList = 'complete-date';
        div.innerText = `completed at:   ${allTasks[taskId]['taskData']['completeDate']}`;
        // if (TaskData["taskData"]['completeDate'] == undefined ){
        //     // let now = new Date();
        //     // const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        //     // let completeTime = now.toLocaleString('en-US', options);
        //     // TaskData['taskData']['completeDate'] = `${completeTime}`
        //     // div.innerText = `completed at:   ${completeTime}`
        //     // console.log(TaskData["taskData"])
        //     // addTask(taskId, TaskData["taskData"])
        // } else{
        //     // TaskData['taskData']['completeDate'] = TaskData["taskData"]['completeDate']
        //     // div.innerText = `completed at:   ${TaskData["taskData"]['completeDate']}`
        //     // console.log(TaskData["taskData"])
        // }
        // TaskData['taskData']['completeDate'] = `${completeTime}`
        // console.log(TaskData["taskData"])
        task[0].parentElement.parentElement.appendChild(div);
    }
    else {
        // Set opacity to 1 and exit the loop
        task[0].parentElement.parentElement.setAttribute("data-status", "false");
        task[0].parentElement.parentElement.setAttribute("complete-date", 'not-completed');
        // let taskId = task[0].parentElement.parentElement.getAttribute("data-id"),
        // TaskData = JSON.parse(sessionStorage.getItem("allTasks"))[taskId];
        // TaskData = JSON.parse(localStorage.getItem(`${taskId}`))
        // TaskData.completeDate = 'not-completed'
        // console.log(TaskData['taskData']['completeDate'])
        // if(TaskData['taskData']['completeDate'] !== undefined){
        //     // delete TaskData['taskData']['completeDate'];
        //     // console.log(TaskData)
        //     // addTask(taskId, TaskData["taskData"])
        // }
        if (task[0].parentElement.parentElement.querySelector(".complete-date") != null) {
            task[0].parentElement.parentElement.querySelector(".complete-date").remove();
        }
    }
    // console.log("$$$$$$$$$")
}
function addTasksFromDataBase(id, taskData, oldTasksAfterEdit) {
    let taskCars;
    try {
        // get data
        let task = taskData['taskData'];
        function createTaskCard() {
            // Create the main task card div
            const taskCardDiv = document.createElement('div');
            taskCardDiv.className = 'task-card';
            taskCardDiv.setAttribute('data-id', `${id}`);
            taskCardDiv.setAttribute("complete-date", `${task['completeDate']}`);
            // Create the title
            const title = document.createElement('div');
            title.className = 'title';
            title.innerText = task['title'];
            // Create the container div
            const containerDiv = document.createElement('div');
            containerDiv.className = 'container';
            for (let i = 0; i < Object.keys(task['data']).length; i++) {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';
                taskDiv.setAttribute('data-status', `${task['data'][i]["status"]}`);
                // Create the cont div
                const contDiv = document.createElement('div');
                contDiv.className = 'cont';
                // Create the num div
                const TaskNum = document.createElement('div');
                TaskNum.className = 'num';
                TaskNum.innerText = `${task['data'][i]["num"]} `;
                // Create the TaskData div
                const TaskData = document.createElement('div');
                TaskData.className = 'TaskData';
                TaskData.innerText = ` ${task['data'][i]["content"]}`;
                // Create the task-content input
                const taskContentCheckBox = document.createElement('input');
                taskContentCheckBox.type = 'checkbox';
                task['data'][i]["status"] == 'complete' ? taskContentCheckBox.checked = true : taskContentCheckBox.checked = false;
                const upperTaskCont = document.createElement("div");
                upperTaskCont.classList = "upperTaskCont";
                const bottomTaskCont = document.createElement("div");
                bottomTaskCont.classList = "bottomTaskCont";
                const addedDate = document.createElement("h1");
                addedDate.classList = "added_date";
                addedDate.innerText = `Added date: ${task['data'][i]["added_date"]}`;
                const completedDate = document.createElement("h1");
                completedDate.classList = "complete_date";
                if (task['data'][i]["complete_date"] !== undefined) {
                    completedDate.innerText = `Complete date: ${task['data'][i]["complete_date"]}`;
                }
                containerDiv.appendChild(taskDiv);
                contDiv.appendChild(TaskNum);
                contDiv.appendChild(TaskData);
                upperTaskCont.appendChild(contDiv);
                upperTaskCont.appendChild(taskContentCheckBox);
                taskDiv.appendChild(upperTaskCont);
                taskDiv.appendChild(bottomTaskCont);
                bottomTaskCont.appendChild(addedDate);
                bottomTaskCont.appendChild(completedDate);
            }
            // Create the task done alarm H2
            const DoneMessage = document.createElement('h2');
            DoneMessage.classList.add("DoneAlarm");
            DoneMessage.innerText = "Done";
            const date = document.createElement('div');
            date.className = 'date';
            date.innerText = task["date"];
            taskCardDiv.appendChild(title);
            taskCardDiv.appendChild(containerDiv);
            taskCardDiv.appendChild(date);
            taskCardDiv.appendChild(DoneMessage);
            if (oldTasksAfterEdit !== undefined) {
                oldTasksAfterEdit.replaceWith(taskCardDiv);
                addSettingToTasksBox();
                tasksSetting();
                handleEveryNestedTaskData();
                tasksMain();
            }
            else {
                tasksContainer.appendChild(taskCardDiv);
            }
            taskCars = taskCardDiv;
            checkIfAllTasksAreDone(taskCardDiv.querySelectorAll(".task"));
        }
        createTaskCard();
    }
    catch (error) {
        console.error(`Error parsing JSON for key "":`, error);
    }
}
function tasksMain() {
    let DeleteTaskButton = null;
    function createTask() {
        // console.log(window.innerWidth < 600)
        if (window.innerWidth < 600) {
            var addTaskButton = document.querySelector("section .add-task-photo");
        }
        else {
            var addTaskButton = document.querySelector("section .add-task");
        }
        addTaskButton.addEventListener("click", function () {
            // if(window.innerWidth <= 600){
            slider.classList.remove("open");
            // }
            let overlay = document.createElement("div");
            overlay.className = 'overlay';
            section.appendChild(overlay);
            // Create the main task card div
            const taskCardDiv = document.createElement('div');
            taskCardDiv.className = 'task-card';
            // Create the title input
            const titleInput = document.createElement('input');
            titleInput.className = 'title';
            titleInput.placeholder = '...';
            // Create the container div
            const containerDiv = document.createElement('div');
            containerDiv.className = 'container';
            // Function to create a task element
            function createTask(num) {
                // Create the task div
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';
                // Create the cont div
                const contDiv = document.createElement('div');
                contDiv.className = 'cont';
                // Create the num div
                const numDiv = document.createElement('div');
                numDiv.className = 'num';
                numDiv.textContent = num + ' - ';
                // Create the upperTaskCont div
                const upperTaskCont = document.createElement('div');
                upperTaskCont.className = 'upperTaskCont';
                const deleteTaskImg = document.createElement('img');
                deleteTaskImg.className = 'deleteImg';
                deleteTaskImg.src = 'assets/imgs/close.png';
                DeleteTaskButton = deleteTaskImg;
                // Create the task-content input
                const taskContentInput = document.createElement('input');
                taskContentInput.className = 'TaskData';
                taskContentInput.placeholder = '...';
                // Append numDiv and taskContentInput to contDiv
                contDiv.appendChild(numDiv);
                contDiv.appendChild(taskContentInput);
                contDiv.appendChild(deleteTaskImg);
                upperTaskCont.appendChild(contDiv);
                // Append contDiv to taskDiv
                taskDiv.appendChild(upperTaskCont);
                return taskDiv;
            }
            // Create and append the first task element to the container div
            containerDiv.appendChild(createTask(1));
            // Create the add-task button
            const addTaskButton = document.createElement('button');
            addTaskButton.className = 'add-task';
            addTaskButton.textContent = 'add task';
            // Add event listener to the add-task button to add new tasks
            addTaskButton.addEventListener('click', () => {
                const taskCount = containerDiv.getElementsByClassName('task').length + 1;
                containerDiv.insertBefore(createTask(taskCount), addTaskButton);
                // DeleteTaskButton = overlay.querySelectorAll(".deleteImg");
                getAllDeleteTaskButton();
            });
            // Append titleInput, containerDiv, and addTaskButton to taskCardDiv
            taskCardDiv.appendChild(titleInput);
            taskCardDiv.appendChild(containerDiv);
            containerDiv.appendChild(addTaskButton);
            let createTaskButton = document.createElement("button");
            createTaskButton.className = 'done-task';
            createTaskButton.innerHTML = 'Create Task';
            let cancelButton = document.createElement("button");
            cancelButton.className = 'cancel-button';
            cancelButton.innerHTML = 'Cancel';
            overlay.appendChild(taskCardDiv);
            overlay.appendChild(createTaskButton);
            overlay.appendChild(cancelButton);
            getAllDeleteTaskButton();
            function getAllDeleteTaskButton() {
                DeleteTaskButton = overlay.querySelectorAll(".deleteImg");
                DeleteTaskButton.forEach(element => {
                    element.addEventListener("click", function () {
                        if (element.parentElement.parentElement.parentElement.parentElement != null && element.parentElement.parentElement.parentElement.parentElement.children.length - 1 != 1) {
                            element.parentElement.parentElement.parentElement.remove();
                        }
                        addTaskButton.parentElement.querySelectorAll(".task").forEach((element, index) => {
                            element.querySelector(".cont").querySelector(".num").innerHTML = `${index + 1} -`;
                        });
                    });
                });
            }
            // ####################################################
            // when press create task button 
            createTaskButton.addEventListener("click", function () {
                let taskTitle = overlay.querySelector(".title");
                let tasksContent = overlay.querySelectorAll(".task");
                let now = new Date();
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                const formattedDate = now.toLocaleString('en-US', options);
                let allTasksData = {};
                tasksContent.forEach((element, index) => {
                    let num = element.querySelector(".num").textContent;
                    let taskContent = element.querySelector(".TaskData").value;
                    let tasksData = { num: num, content: taskContent, "status": "false", "added_date": formattedDate };
                    allTasksData[index] = tasksData;
                });
                let NewTask = {
                    title: `${taskTitle.value}`,
                    date: `${formattedDate}`,
                    data: allTasksData
                };
                function addDataToDataBase() {
                    function getRandomThreeDigitNumber() {
                        if (localStorage.length == 0) {
                            let idNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
                            return idNum;
                        }
                        else {
                            for (let i = 0; i < localStorage.length; i++) {
                                let idNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
                                if (localStorage.key(i) != idNum) {
                                    return idNum;
                                }
                            }
                        }
                    }
                    let randomNumber = getRandomThreeDigitNumber();
                    addTask(String(randomNumber), NewTask);
                    let handledData = {
                        id: randomNumber,
                        taskData: NewTask
                    };
                    addTasksFromDataBase(randomNumber, handledData);
                    let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                    allTasks[randomNumber] = {
                        id: randomNumber,
                        taskData: NewTask
                    };
                    sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
                }
                addDataToDataBase();
                overlay.remove();
                completeTasks();
                handleTasksViewInPage();
                addSettingToTasksBox();
                tasksSetting();
            });
            // when press cancel button 
            cancelButton.addEventListener("click", function () {
                overlay.remove();
            });
        });
    }
    createTask();
    function completeTasks() {
        let completeTasksInput = document.querySelectorAll(".task-card .container .task  input");
        completeTasksInput.forEach(element => {
            element.addEventListener("click", function () {
                console.log(element);
                // add complete of false Attribute for task && add complete date to complete task
                let now = new Date();
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                let completeDate = now.toLocaleString('en-US', options);
                if (element.checked) {
                    element.parentElement.parentElement.setAttribute("data-status", 'complete');
                    if (element.parentElement.parentElement.querySelector(".complete_date") != null) {
                        element.parentElement.parentElement.children[1].querySelector(".complete_date").remove();
                    }
                    // console.log("adding complete date", element.parentElement.parentElement.children[1].querySelector(".complete_date"))
                    let completedDate = document.createElement("h1");
                    completedDate.className = "complete_date";
                    completedDate.innerHTML = `Complete date: ${completeDate}`;
                    let bottomTaskCont = element.parentElement.parentElement.querySelector(".bottomTaskCont");
                    bottomTaskCont.appendChild(completedDate);
                }
                else {
                    element.parentElement.parentElement.setAttribute("data-status", 'false');
                    // console.log(element.parentElement.parentElement.querySelector(".complete_date"))
                    if (element.parentElement.parentElement.querySelector(".complete_date") != null) {
                        element.parentElement.parentElement.children[1].querySelector(".complete_date").innerHTML = "Complete date: Not completed";
                    }
                }
                let id = element.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id");
                // console.log(JSON.parse(sessionStorage.getItem("allTasks")))
                // console.log(JSON.parse(sessionStorage.getItem("allTasks"))[id]['taskData'] )
                let taskData = JSON.parse(sessionStorage.getItem("allTasks"))[id]['taskData'];
                let EditedTaskTitle = taskData['title'];
                let EditedTaskDate = taskData['date'];
                let allTasksData = {};
                element.parentElement.parentElement.parentElement.querySelectorAll(".task").forEach((element, index) => {
                    let addedDate = element.querySelector(".added_date").innerHTML.split(":").slice(1).toLocaleString();
                    let num = element.querySelector(".cont").firstChild.innerText;
                    let taskContent = element.querySelector(".cont").lastChild.innerText;
                    let status = element.getAttribute("data-status");
                    if (element.querySelector("input").checked) {
                        const completedDate = element.querySelector(".bottomTaskCont").querySelector(".complete_date").innerHTML.split(":").slice(1).toLocaleString();
                        var tasksData = { num: num, content: taskContent, "status": status, "added_date": addedDate, "complete_date": completedDate };
                    }
                    else {
                        var tasksData = { num: num, content: taskContent, "status": status, "added_date": addedDate, "complete_date": "Not completed" };
                    }
                    allTasksData[index] = tasksData;
                });
                let editedTask = {
                    title: `${EditedTaskTitle}`,
                    date: `${EditedTaskDate}`,
                    data: allTasksData
                };
                let allTasksInput = element.parentElement.parentElement.parentElement.querySelectorAll(".task ");
                // check if all tasks are done
                let allTasksDone = true;
                allTasksInput.forEach(task => {
                    if (task.getAttribute("data-status") !== "complete") {
                        allTasksDone = false;
                    }
                });
                // put all task complete date
                if (allTasksDone) {
                    let now = new Date();
                    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                    editedTask["completeDate"] = now.toLocaleString('en-US', options);
                }
                else {
                    delete editedTask["completeDate"];
                }
                let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                allTasks[id] = {
                    id: id,
                    taskData: editedTask
                };
                addTask(id, editedTask);
                sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
                const elements = element.parentElement.parentElement.parentElement.querySelectorAll(".task");
                checkIfAllTasksAreDone(elements);
            });
        });
    }
    completeTasks();
}
function addSettingToTasksBox() {
    let tasksCard = document.querySelectorAll("section main .tasks-container .task-card");
    tasksCard.forEach(element => {
        // Create the container div with class 'trash'
        const trashDiv = document.createElement('div');
        trashDiv.className = 'trash';
        // Create the img element
        const imgElement = document.createElement('img');
        imgElement.src = 'assets/imgs/settings.png';
        imgElement.alt = 'settings';
        trashDiv.appendChild(imgElement);
        // Create the settingBox div
        const settingBoxDiv = document.createElement('div');
        settingBoxDiv.className = 'settingBox';
        // Create the first delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete Task';
        // Create the deleteBox div
        const deleteBoxDiv = document.createElement('div');
        deleteBoxDiv.className = 'deleteBox';
        // Create the h4 element
        const h4Element = document.createElement('h4');
        h4Element.textContent = 'Are you sure?';
        deleteBoxDiv.appendChild(h4Element);
        // Create the boxesCont div
        const boxesContDiv = document.createElement('div');
        boxesContDiv.className = 'boxesCont';
        // Create the second delete button inside deleteBox
        const confirmDeleteButton = document.createElement('button');
        confirmDeleteButton.className = 'delete';
        confirmDeleteButton.textContent = 'Delete';
        // Create the no button
        const noButton = document.createElement('button');
        noButton.className = 'no';
        noButton.textContent = 'No';
        // Append buttons to boxesCont div
        boxesContDiv.appendChild(confirmDeleteButton);
        boxesContDiv.appendChild(noButton);
        // Append boxesCont div to deleteBox div
        deleteBoxDiv.appendChild(boxesContDiv);
        // Create the edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Edit';
        // Append elements to settingBox div
        settingBoxDiv.appendChild(deleteButton);
        settingBoxDiv.appendChild(deleteBoxDiv);
        settingBoxDiv.appendChild(editButton);
        // Append settingBox div to trash div
        trashDiv.appendChild(settingBoxDiv);
        // Append trash div to the body or any other container
        element.appendChild(trashDiv);
    });
    settingButton = document.querySelectorAll(".task-card .trash  img");
    settingBox = document.querySelectorAll(".task-card .trash  .settingBox");
    deleteButton = document.querySelectorAll(".task-card .trash  .settingBox .delete");
}
function tasksSetting() {
    settingButton.forEach((settingButton, index) => {
        let didntDelete = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .boxesCont .no"), confirmDelete = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .boxesCont .delete"), DeleteButton = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .delete"), taskContainer = settingButton.parentElement.parentElement.querySelector(".container"), editButton = settingButton.parentElement.parentElement.querySelector(".trash  .settingBox .edit"), TaskCard = settingButton.parentElement.parentElement, TitleDiv = settingButton.parentElement.parentElement.querySelector(".title"), containerDiv = settingButton.parentElement.parentElement.querySelectorAll(".container .task"), dateDiv = settingButton.parentElement.parentElement.querySelector(".date "), deleteImg = settingButton.parentElement.parentElement.querySelector(".deleteImg"), EditedTaskDate = null;
        settingButton.addEventListener("click", function () {
            settingButton.parentElement.classList.toggle('open');
            function deleteTask() {
                DeleteButton.addEventListener("click", function () {
                    settingButton.parentElement.querySelector(".task-card .trash  .settingBox ").querySelector('.deleteBox').classList.toggle('open');
                    return;
                });
                didntDelete.addEventListener("click", function () {
                    settingButton.parentElement.querySelector(".task-card .trash  .settingBox ").querySelector('.deleteBox').classList.remove('open');
                });
                confirmDelete.addEventListener("click", function () {
                    let elementId = settingButton.parentElement.parentElement.getAttribute('data-id');
                    deleteTaskFromDatabase(elementId);
                    settingButton.parentElement.parentElement.remove();
                    handleTasksViewInPage();
                    let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                    delete allTasks[elementId];
                    sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
                });
                return;
            }
            deleteTask();
            // ######################## Edit Task ########################
            function editTask() {
                let elementId = settingButton.parentElement.parentElement.getAttribute('data-id');
                let editedTasks = settingButton.parentElement.parentElement;
                let cancelButton = null;
                editButton.addEventListener("click", function () {
                    settingButton.parentElement.style = "display: none";
                    // let removeBottomTaskCont = document.querySelectorAll(".tasks-container .task-card .container .task")
                    // removeBottomTaskCont.forEach(element => {
                    //     // console.log(element)
                    //     // element.querySelector(".bottomTaskCont").remove()
                    // })
                    let taskCard = editButton.parentElement.parentElement.parentElement;
                    taskCard.setAttribute("edit", "true");
                    if (settingButton.parentElement.parentElement.getAttribute("data-status") == 'complete') {
                        settingButton.parentElement.parentElement.classList.add("on-edit");
                    }
                    function editTaskHandle() {
                        settingButton.parentElement.classList.toggle('open');
                        editedTasks.style.opacity = "1";
                        let titleClass = TitleDiv.className;
                        let titleValue = TitleDiv.innerText;
                        let titleInput = document.createElement("input");
                        titleInput.classList.add(`${titleClass}`);
                        titleInput.value = titleValue;
                        let DoneButton = document.createElement("button");
                        DoneButton.classList.add('DoneButton');
                        DoneButton.innerText = "Save Edit";
                        cancelButton = document.createElement("button");
                        cancelButton.classList.add('cancel-button');
                        cancelButton.innerText = "Cancel";
                        let addTaskButton = document.createElement("button");
                        addTaskButton.classList.add('addTaskButton');
                        addTaskButton.innerText = "Add Task";
                        let buttonsDiv = document.createElement("div");
                        buttonsDiv.classList.add('buttons-div');
                        buttonsDiv.appendChild(cancelButton);
                        buttonsDiv.appendChild(DoneButton);
                        TaskCard.appendChild(buttonsDiv);
                        TitleDiv.replaceWith(titleInput);
                        dateDiv.replaceWith(buttonsDiv);
                        TaskCard.insertBefore(addTaskButton, buttonsDiv);
                        function HandleTasksArrangeWhenDeleteOne() {
                            taskContainer.querySelectorAll(".task").forEach((element, index) => {
                                // let everyMessageValue =  element.querySelector(".cont").querySelector(".TaskData").value.slice(4)
                                console.log(element);
                                element.querySelector(".cont").querySelector(".num").innerHTML = `${index + 1} -`;
                            });
                        }
                        let tasksNum = containerDiv.length;
                        addTaskButton.addEventListener("click", function () {
                            tasksNum++;
                            // Create the task div
                            const taskDiv = document.createElement('div');
                            taskDiv.className = 'task';
                            taskDiv.setAttribute("data-status", 'false');
                            // Create the cont div
                            const contDiv = document.createElement('div');
                            contDiv.className = 'cont';
                            const TaskNum = document.createElement('div');
                            TaskNum.className = 'num';
                            TaskNum.innerText = `${tasksNum} - `;
                            const TaskData = document.createElement('input');
                            TaskData.className = 'TaskData';
                            TaskData.placeholder = '...';
                            const deleteTaskImg = document.createElement('img');
                            deleteTaskImg.className = 'deleteImg';
                            deleteTaskImg.src = 'assets/imgs/close.png';
                            deleteImg = deleteTaskImg;
                            const upperTaskCont = document.createElement('div');
                            upperTaskCont.className = 'upperTaskCont';
                            contDiv.appendChild(TaskNum);
                            contDiv.appendChild(TaskData);
                            upperTaskCont.appendChild(contDiv);
                            upperTaskCont.appendChild(deleteTaskImg);
                            taskDiv.appendChild(upperTaskCont);
                            taskContainer.appendChild(taskDiv);
                            // ################## delete new added tasks ################
                            deleteTaskImg.addEventListener("click", function () {
                                // console.log(deleteTaskImg.parentElement.parentElement)
                                deleteTaskImg.parentElement.parentElement.remove();
                                tasksNum--;
                                HandleTasksArrangeWhenDeleteOne();
                            });
                            handleEveryNestedTaskData();
                        });
                        containerDiv.forEach(element => {
                            let taskClass = element.querySelector(".cont").children[1].className;
                            let taskValue = element.querySelector(".cont").children[1].innerText;
                            let taskInput = document.createElement("input");
                            taskInput.classList.add(`${taskClass}`);
                            taskInput.value = taskValue;
                            element.querySelector(".cont").children[1].replaceWith(taskInput);
                            let deleteTaskImg = document.createElement('img');
                            deleteTaskImg.className = 'deleteImg';
                            deleteTaskImg.src = 'assets/imgs/close.png';
                            deleteImg = deleteTaskImg;
                            element.querySelector(".cont").parentElement.lastChild.replaceWith(deleteTaskImg);
                            // ################## delete current task ################
                            deleteTaskImg.addEventListener("click", function () {
                                element.querySelector(".cont").parentElement.parentElement.remove();
                                tasksNum--;
                                HandleTasksArrangeWhenDeleteOne();
                            });
                        });
                    }
                    editTaskHandle();
                    function SaveEditedTask() {
                        let DoneButtonB = settingButton.parentElement.parentElement.querySelector(".DoneButton");
                        DoneButtonB.addEventListener("click", function () {
                            let num = null, taskContent = null, status = null, taskData = {}, id, allTasksData = {};
                            settingButton.parentElement.parentElement.querySelectorAll(".task").forEach((element, index) => {
                                id = element.parentElement.parentElement.getAttribute("data-id");
                                let alreadyExistTasks = JSON.parse(sessionStorage.getItem("allTasks"))[id]['taskData']['data'];
                                let alreadyExistTasksLength = Object.keys(alreadyExistTasks).length;
                                let addedDate;
                                if (index < alreadyExistTasksLength) {
                                    addedDate = alreadyExistTasks[index]["added_date"];
                                }
                                else {
                                    let now = new Date();
                                    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                                    let NewAddedDate = now.toLocaleString('en-US', options);
                                    addedDate = NewAddedDate;
                                }
                                num = `${index + 1} -`;
                                taskContent = element.querySelector(".cont").querySelector("input").value;
                                status = element.getAttribute("data-status");
                                if (alreadyExistTasks[index] === undefined) {
                                    taskData = { num: num, content: taskContent, "status": `${status}`, "added_date": addedDate };
                                }
                                else {
                                    if (alreadyExistTasks[index]['complete_date'] == undefined) {
                                        taskData = { num: num, content: taskContent, "status": `${status}`, "added_date": addedDate };
                                    }
                                    else {
                                        let completeDate = alreadyExistTasks[index]['complete_date'];
                                        taskData = { num: num, content: taskContent, "status": `${status}`, "added_date": addedDate, "complete_date": completeDate };
                                    }
                                }
                                allTasksData[index] = taskData;
                            });
                            let editedTask = {
                                title: `${editedTasks.querySelector(".title").value}`,
                                date: `${JSON.parse(sessionStorage.getItem("allTasks"))[id]["taskData"]["date"]}`,
                                data: allTasksData
                            };
                            // error with sending data to database
                            addTask(elementId, editedTask);
                            let handledData = {
                                id: elementId,
                                taskData: editedTask
                            };
                            addTasksFromDataBase(elementId, handledData, taskCard);
                            let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                            allTasks[elementId] = {
                                id: elementId,
                                taskData: editedTask
                            };
                            sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
                        });
                    }
                    SaveEditedTask();
                    function cancelEdit() {
                        cancelButton.addEventListener("click", function () {
                            window.location.reload();
                        });
                    }
                    cancelEdit();
                    handleEveryNestedTaskData();
                });
            }
            editTask();
        });
    });
}
function handleEveryNestedTaskData() {
    let test = document.querySelectorAll(".tasks-container .task-card .container .task");
    test.forEach(element => {
        element.addEventListener("click", function () {
            element.classList.toggle("open");
        });
        // Create a ResizeObserver instance
        let resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                // let height = entry.contentRect.height;
                // console.log('Element height changed to: ' + height + 'px');
                handleTasksViewInPage();
            }
        });
        resizeObserver.observe(element);
    });
}
