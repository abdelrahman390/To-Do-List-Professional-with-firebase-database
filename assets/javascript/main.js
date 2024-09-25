// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore , collection,getDoc, deleteDoc, doc, getDocs, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
let module = {}

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
const db = getFirestore(app);  // for modern Firebase version 9+


 // Add a new document in collection "Tasks"
async function addTask(id, taskData) {
    let user = localStorage.getItem("user")
    try {
        await setDoc(doc(db, `users/${user}/tasks/${id}`), {
            id: id ,
            taskData
        });

    } catch (error) {
        console.error('Error adding user: ', error);
    }
}

async function addUser(userName, password) {
    try {
        let date = new Date();
        let addedDate = date.toLocaleString();
        let id = date.getTime();
        await setDoc(doc(db, "users", userName), {
            userName: userName,
            id: id,
            password: password,
            addedDate: addedDate,
            tasks: {}
        });
        location.reload();
    } catch (error) {
        console.error('Error adding user: ', error);
    }
}

async function deleteTaskFromDatabase(taskId) {
    try {
        let user = localStorage.getItem("user")
        await deleteDoc(doc(db, `users/${user}/tasks/${taskId}`));
    } catch (error) {
        console.error('Error adding user: ', error);
    }
}

let tasksData,
    slider = document.querySelector("section main .slider"),
    sliderButton = document.querySelector("section main .slider span img"),
    sliderDeleteHistoryButton = document.querySelector("section main .slider .bottom .delete-history"),
    date = document.querySelector("section header .max-width .date"),
    section = document.querySelector("section"),
    deletedTaskMain = document.querySelector("section main .deleted-task-main"),
    deletedTaskContainer = document.querySelector("section main .deleted-task-main .deleted-tasks-container"),
    deletedTaskExitButton = document.querySelector("section main .deleted-task-main .exit"),
    tasksContainer = document.querySelector("section main .tasks-container"),
    deleteTaskButton = document.querySelector("section main .slider .clear-tasks"),
    noButton = document.querySelector("section .overlay .alertBox .mainBox .buttonsBox .noButton"),
    confirmButton = document.querySelector("section .overlay .alertBox .mainBox .buttonsBox .confirmButton"),
    settingButton,
    ChangeLoginPageButton = document.querySelector(".container > .Register"),
    settingBox,
    deleteButton,
    editButton = null,
    running = false,
    user;


async function getAllUsersAsBlock() {
    const querySnapshot = await getDocs(collection(db, "users")); // Replace 'collectionName'
    let allUsers = {};
    querySnapshot.forEach((doc) => {
        allUsers[doc.id] = doc.data()
    });
    sessionStorage.setItem("allUsers", JSON.stringify(allUsers))
    checkIfLogged(user)
    handleLaudingLayout()
}
getAllUsersAsBlock()

async function getAllMessagesAsBlock() {
    let user = localStorage.getItem("user")
    const querySnapshot = await getDocs(collection(db, `users/${user}/tasks`)); // Replace 'collectionName'
    let allTasks = {};
    querySnapshot.forEach((doc) => {
        allTasks[doc.id] = doc.data()
        sessionStorage.setItem("allTasks", JSON.stringify(allTasks))
        addTasksFromDataBase(doc.id, doc.data())
    });
    sessionStorage.setItem("allTasks", JSON.stringify(allTasks))
    tasksMain()
    addSettingToTasksBox()
    tasksSetting()
    handleTasksViewInPage()
    handleEveryNestedTaskData()
}

if(localStorage.getItem('user') !== null){
    user = localStorage.getItem('user');
} else {
    localStorage.setItem('user', "null")
}
if(localStorage.getItem('loggedIn') == null){
    localStorage.setItem("loggedIn", String(false))
} 

function handleLaudingLayout() {
    let loadingOverlay = document.querySelector(".loadingOverlay");
    let section = document.querySelector("section");
    loadingOverlay.style.display = "none";
    section.style.visibility = 'unset';
}

//  check if loggedIn
function checkIfLogged(check) {
    let before_login = document.querySelector('.before_login')
    handleMainSectionHight()
    // if not logged in
    if(String(check) == "null" || String(check) == "false" || String(check) == "undefined"){
        localStorage.setItem("loggedIn", String(false))
        before_login.style.cssText = "display: flex"
        loginAndRegister()
    // if logged in
    } else if(String(check) == "true" || String(check) != "null" || String(check) !== "undefined") {
        user = localStorage.getItem('user')
        localStorage.setItem("loggedIn", String(true))
        before_login.style.cssText = "display: none"
        getAllMessagesAsBlock()
        handleAccountSection()
    }
}

// handle account part and logout button
function handleAccountSection() {
    let accountSection = document.querySelector("section header .max-width .account"),
    tasksContainer = document.querySelector("section main .tasks-container "),
    userName = accountSection.querySelector(".userName"),
    user = localStorage.getItem("user"),
    logoutButton = accountSection.querySelector(".logOut");

    accountSection.style.visibility = "unset"
    userName.innerText = user

    logoutButton.addEventListener("click", function(){
        accountSection.style.visibility = "hidden"
        localStorage.setItem("loggedIn", false)
        localStorage.removeItem("user")
        checkIfLogged("false")
        sessionStorage.removeItem("allTasks")
        tasksContainer.innerHTML = ""
    })

}

// login and register handle
function loginAndRegister() {
    let all_users = JSON.parse(sessionStorage.getItem('allUsers'))

    // handle hide and show password
    let hidePassword = document.querySelectorAll(".before_login > .container .box form .cont .container img")
    hidePassword.forEach(element => {
            element.addEventListener("click", function() {
                const parent = element.parentElement;

                if (parent) {  // Check if parentElement is not null
                    let input = parent.querySelector("input");
                    
                    if (input && input.type === "text") {  // Check if input is not null
                        input.type = "password";
                    } else if (input) {
                        input.type = "text";
                    }
                } else {
                    console.error("Parent element not found.");
                }
            })
    });

    /************** register **************/ 
    let registerCard = document.querySelector(".before_login .container .register");
    let registerForm = document.querySelector(".register form");
    let userName = registerCard.querySelector(" .before_login .container .box .cont  .name")
    let password = registerCard.querySelector(" .before_login .container .box .cont  .password")
    let registerButton = document.querySelector(".before_login .container .box  .register_button")
    let confirmPassword  = document.querySelector(".before_login .container .box .cont  .confirm_password")
    let registrationPasswordAlarm = document.querySelector(".before_login .container .box.register .cont .alarm.password")
    let registrationUserNameAlarm = document.querySelector(".before_login .container .box.register .cont .alarm.userName")
    let passwordCheck = false;

    // check password
    confirmPassword.addEventListener("input", function() {
        if(password.value.length <= confirmPassword.value.length && confirmPassword.value !== password.value){
            registrationPasswordAlarm.style.cssText = 'display: block; background: #f29999;'
            confirmPassword.style.cssText = "background-color: #f29999;"
            passwordCheck = false
        } else if(confirmPassword.value == password.value){
            registrationPasswordAlarm.style.display = 'none'
            confirmPassword.style.cssText = "background-color: #1296d1;"
            passwordCheck = true
        }
    })
    // send new user
    registerButton.addEventListener("click", function() {
        let allCheck = userName.value.length > 2 && passwordCheck && registerForm.checkValidity(); // return boolean 
        let userExists = false;
        let key;
        for (const key in all_users) {
            // Check if the username matches
            if (userName.value === all_users[key].user_name) {
                userExists = true;  // Set flag if the user exists
                registrationUserNameAlarm.classList.add("open")
                break;  // Stop the loop if a match is found
            } else {
                registrationUserNameAlarm.classList.remove("open")
            }
        }
        if (!userExists && allCheck) {
            addUser(userName.value, password.value);

            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("user", userName.value);
            checkIfLogged('true');
            userName.value = "";
            password.value = "";
            confirmPassword.value = "";
            ChangeLoginPageButton.click();
        } 
    })

    /************** login **************/ 
    let userNameInput = document.querySelector(".before_login .container .box.logIn form .cont .name")
    let passwordInput = document.querySelector("section main .before_login > .container .box form .cont .container input")
    let loginAlarm = document.querySelector(".before_login .container .box.logIn .cont .alarm")
    let loginButton = document.querySelector(".before_login .container .box.logIn  .login_button")

    loginButton.addEventListener("click", function() {
        for (const key in all_users) {
            if(userNameInput.value == all_users[key].userName && passwordInput.value == all_users[key].password){
                loginAlarm.classList.remove("open")
                localStorage.setItem("loggedIn", 'true')
                localStorage.setItem("user", userNameInput.value)
                checkIfLogged('true')
                userNameInput.value = ""
                passwordInput.value = ""
                return
            } else if(userNameInput.value.length > 0 && passwordInput.value.length > 0){
                // error
                loginAlarm.classList.add("open")
            }
        }
    })
}

// register button handle
ChangeLoginPageButton.addEventListener("click", function() {
    let loginBox = document.querySelector(".logIn");
    let registerBox = document.querySelector(".register");
    if(loginBox.style.display == "none"){
        loginBox.style.cssText = 'display: flex'
        registerBox.style.cssText = 'display: none'
        ChangeLoginPageButton.innerHTML = 'Register'
    } else {
        loginBox.style.cssText = 'display: none'
        registerBox.style.cssText = 'display: flex'
        ChangeLoginPageButton.innerHTML = 'Login'
    }
})

// handle main section automatic hight
function handleMainSectionHight() {
    if(window.innerWidth <= 600) {
        let viewportHeight = window.innerHeight,
        header = document.querySelector("header"),
        footer = document.querySelector("footer"),
        slider = document.querySelector("section main .slider"),
        TasksMain = document.querySelector("section main .tasks-container"),
        mainWantedHight,
        TasksWantedHight;
        console.log(window.innerHeight)
        console.log(header.offsetHeight)
        console.log(slider.offsetHeight)
        console.log(footer.offsetHeight)

        TasksWantedHight = viewportHeight - (header.offsetHeight + footer.offsetHeight + slider.offsetHeight + 5)
        const root = document.documentElement;
        root.style.setProperty('--tasks-hight', `${TasksWantedHight}px` ); // Change to tomato color
        
        mainWantedHight = viewportHeight - (header.offsetHeight + footer.offsetHeight)
        root.style.setProperty('--main-hight', `${mainWantedHight}px` ); // Change to tomato color


    } else {
        let viewportHeight = window.innerHeight,
        header = document.querySelector("header"),
        footer = document.querySelector("footer"),
        mainWantedHight,
        TasksWantedHight;
        console.log(window.innerHeight)
        console.log(header.offsetHeight)
        console.log(footer.offsetHeight)
    
        TasksWantedHight = viewportHeight - (header.offsetHeight + footer.offsetHeight + 85)
        const root = document.documentElement;
        root.style.setProperty('--tasks-hight', `${TasksWantedHight}px` ); // Change to tomato color
        
        mainWantedHight = viewportHeight - (header.offsetHeight + footer.offsetHeight)
        root.style.setProperty('--main-hight', `${mainWantedHight}px` ); // Change to tomato color
    }

}

function time() {
        let now = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        date.innerHTML = now.toLocaleString('en-US', options);
}
time()
setInterval(time(), 500);

function sliderMain() {
        slider.addEventListener('mouseover', function (){
            slider.classList.add('open');
        })
        
        slider.addEventListener('mouseout', function (){
            slider.classList.remove('open');
        })

        if(window.innerWidth <= 600){
            sliderButton.addEventListener("click", function() {
                slider.classList.toggle("open")
            })
        }
}
sliderMain()

// change this function algorithm 
function checkIfAllTasksAreDone(task){
    // console.log(task) //{"0": {}, "1": {}, "2": {}} every Task?
    let allTasksDone = true;

    task.forEach(task => {
        if (task.getAttribute("data-status") !== "complete") {
            allTasksDone = false;
        }
    });

    let allTasks = JSON.parse(sessionStorage.getItem("allTasks"))

        if (allTasksDone) {
            // Set opacity to 0.7

            task[0].parentElement.parentElement.setAttribute("data-status", "complete")
            let taskId = task[0].parentElement.parentElement.getAttribute("data-id");
            let div = document.createElement("div");
            div.classList = 'complete-date';
            div.innerText = `completed at:   ${allTasks[taskId]['taskData']['completeDate']}`
            task[0].parentElement.parentElement.appendChild(div)
        } else {
            // Set opacity to 1 and exit the loop
            task[0].parentElement.parentElement.setAttribute("data-status", "false")
            task[0].parentElement.parentElement.setAttribute("complete-date", 'not-completed')
            if(task[0].parentElement.parentElement.querySelector(".complete-date") != null){
                task[0].parentElement.parentElement.querySelector(".complete-date").remove()
            } 
        }
} 

function addTasksFromDataBase(id, taskData, oldTasksAfterEdit) {
    let taskCars ;

    try {
        // get data
        let task = taskData['taskData'];
        function createTaskCard() {
            // Create the main task card div
            const taskCardDiv = document.createElement('div');
            taskCardDiv.className = 'task-card';
            taskCardDiv.setAttribute('data-id', `${id}`);
            taskCardDiv.setAttribute("complete-date", `${task['completeDate']}`)

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

                const upperTaskCont = document.createElement("div")
                upperTaskCont.classList = "upperTaskCont"
                
                const bottomTaskCont = document.createElement("div")
                bottomTaskCont.classList = "bottomTaskCont"

                const addedDate = document.createElement("h1")
                addedDate.classList = "added_date"
                addedDate.innerText = `Added date: ${task['data'][i]["added_date"]}`

                const completedDate = document.createElement("h1")
                completedDate.classList = "complete_date"
                if (task['data'][i]["complete_date"] !== undefined){
                    completedDate.innerText = `Complete date: ${task['data'][i]["complete_date"]}`
                }

                containerDiv.appendChild(taskDiv);
                contDiv.appendChild(TaskNum);
                contDiv.appendChild(TaskData);
                upperTaskCont.appendChild(contDiv)
                upperTaskCont.appendChild(taskContentCheckBox)
                taskDiv.appendChild(upperTaskCont);
                taskDiv.appendChild(bottomTaskCont);
                bottomTaskCont.appendChild(addedDate)
                bottomTaskCont.appendChild(completedDate)

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
            taskCardDiv.appendChild(DoneMessage)
            if(oldTasksAfterEdit !== undefined){
                oldTasksAfterEdit.replaceWith(taskCardDiv)
                addSettingToTasksBox()
                tasksSetting()
                handleEveryNestedTaskData()
                tasksMain()
            } else{
                tasksContainer.appendChild(taskCardDiv);
            }
            taskCars = taskCardDiv
            checkIfAllTasksAreDone(taskCardDiv.querySelectorAll(".task"));
        }
        createTaskCard();

    } catch (error) {
        console.error(`Error parsing JSON for key "":`, error);
    }
}

function tasksMain(){
    let DeleteTaskButton  = null;

    function createTask() {
        if(window.innerWidth < 600){
            var addTaskButton = document.querySelector("section .add-task-photo");
        } else {
            var addTaskButton = document.querySelector("section .add-task");
        }

        addTaskButton.addEventListener("click", function() {

            // if(window.innerWidth <= 600){
                slider.classList.remove("open")
            // }

            let overlay = document.createElement("div")
            overlay.className = 'overlay';
            section.appendChild(overlay)

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
                deleteTaskImg.src = 'assets/imgs/close.png'
                DeleteTaskButton = deleteTaskImg

                // Create the task-content input
                const taskContentInput = document.createElement('input');
                taskContentInput.className = 'TaskData';
                taskContentInput.placeholder = '...';

                // Append numDiv and taskContentInput to contDiv
                contDiv.appendChild(numDiv);
                contDiv.appendChild(taskContentInput);
                contDiv.appendChild(deleteTaskImg);
                upperTaskCont.appendChild(contDiv)

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
                getAllDeleteTaskButton()
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

            getAllDeleteTaskButton()

            function getAllDeleteTaskButton() {
                DeleteTaskButton = overlay.querySelectorAll(".deleteImg");

                DeleteTaskButton.forEach(element => {
                    element.addEventListener("click", function() {

                        if(element.parentElement.parentElement.parentElement.parentElement != null && element.parentElement.parentElement.parentElement.parentElement.children.length - 1 != 1){
                            element.parentElement.parentElement.parentElement.remove();
                        }

                        addTaskButton.parentElement.querySelectorAll(".task").forEach((element ,index)=> {
                            element.querySelector(".cont").querySelector(".num").innerHTML = `${index + 1} -` 
                        });
                    })
                });
            }

            // ####################################################

            // when press create task button 
            createTaskButton.addEventListener("click", function() {
                let taskTitle = overlay.querySelector(".title")
                let tasksContent = overlay.querySelectorAll(".task")
                let now = new Date();
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                const formattedDate = now.toLocaleString('en-US', options);
                let allTasksData = {};
                tasksContent.forEach((element , index) => { 
                    let num = element.querySelector(".num").textContent
                    let taskContent = element.querySelector(".TaskData").value
                    let tasksData = {num: num , content: taskContent, "status": "false", "added_date": formattedDate}
                    allTasksData[index] = tasksData
                });

                let NewTask = {
                    title: `${taskTitle.value}`,
                    date: `${formattedDate}`,
                    data: allTasksData
                }
                
                function addDataToDataBase() {

                    function getRandomThreeDigitNumber() {
                        if  (localStorage.length == 0 ){
                            let idNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
                            return idNum;
                        } else {
                            for (let i = 0; i < localStorage.length; i++) {
                                let idNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
                                if(localStorage.key(i) != idNum){
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
                    }
                    addTasksFromDataBase(randomNumber, handledData)

                    let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                    allTasks[randomNumber] = {
                        id: randomNumber,
                        taskData: NewTask
                    }
                    sessionStorage.setItem("allTasks" , JSON.stringify(allTasks))
                }
                handleEveryNestedTaskData() 
                addDataToDataBase()
                overlay.remove()
                completeTasks()
                handleTasksViewInPage()
                addSettingToTasksBox()
                tasksSetting()
            })

            // when press cancel button 
            cancelButton.addEventListener("click", function() {
                overlay.remove()
            })

        })
    }
    createTask()

    function completeTasks() {
        let completeTasksInput = document.querySelectorAll(".task-card .container .task  input");
        
        completeTasksInput.forEach(element => {
            element.addEventListener("click", function() {

                // add complete of false Attribute for task && add complete date to complete task
                let now = new Date();
                const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                let completeDate = now.toLocaleString('en-US', options);
                if(element.checked){
                    element.parentElement.parentElement.setAttribute("data-status", 'complete')

                    if(element.parentElement.parentElement.querySelector(".complete_date") != null){
                        element.parentElement.parentElement.children[1].querySelector(".complete_date").remove()
                    }

                    let completedDate = document.createElement("h1")
                    completedDate.className = "complete_date"
                    completedDate.innerHTML = `Complete date: ${completeDate}`

                    let bottomTaskCont = element.parentElement.parentElement.querySelector(".bottomTaskCont")
                    bottomTaskCont.appendChild(completedDate)
                } else {
                    element.parentElement.parentElement.setAttribute("data-status", 'false')
                    if(element.parentElement.parentElement.querySelector(".complete_date") != null){
                        element.parentElement.parentElement.children[1].querySelector(".complete_date").innerHTML = "Complete date: Not completed"
                    }
                }

                let id = element.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id")
                let taskData = JSON.parse(sessionStorage.getItem("allTasks"))[id]['taskData']
                let EditedTaskTitle = taskData['title']
                let EditedTaskDate = taskData['date']
                let allTasksData = {}

                element.parentElement.parentElement.parentElement.querySelectorAll(".task").forEach((element, index) => {
                    
                    let addedDate = element.querySelector(".added_date").innerHTML.split(":").slice(1).toLocaleString()
                    let num = element.querySelector(".cont").firstChild.innerText;
                    let taskContent = element.querySelector(".cont").lastChild.innerText
                    let status = element.getAttribute("data-status")

                    if(element.querySelector("input").checked){
                        const completedDate = element.querySelector(".bottomTaskCont").querySelector(".complete_date").innerHTML.split(":").slice(1).toLocaleString()
                        var tasksData = {num: num , content: taskContent, "status": status, "added_date" : addedDate, "complete_date": completedDate}
                    } else{
                        var tasksData = {num: num , content: taskContent, "status": status, "added_date" : addedDate, "complete_date": "Not completed"}
                    }

                    allTasksData[index] = tasksData
                });

                let editedTask = {
                    title: `${EditedTaskTitle}`,
                    date: `${EditedTaskDate}`,
                    data: allTasksData
                }

                let allTasksInput = element.parentElement.parentElement.parentElement.querySelectorAll(".task ")

                // check if all tasks are done
                let allTasksDone = true;
                allTasksInput.forEach(task => {
                    if (task.getAttribute("data-status") !== "complete") {
                        allTasksDone = false;
                    }
                });

                // put all task complete date
                if(allTasksDone){
                    let now = new Date();
                    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                    editedTask["completeDate"] = now.toLocaleString('en-US', options);
                } else {
                    delete editedTask["completeDate"];
                }

                let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                allTasks[id] = {
                    id: id,
                    taskData: editedTask
                }

                addTask(id, editedTask)
                sessionStorage.setItem("allTasks" , JSON.stringify(allTasks))
                const elements = element.parentElement.parentElement.parentElement.querySelectorAll(".task");
                checkIfAllTasksAreDone(elements)
            })
            
        });

    }
    completeTasks()
}

function addSettingToTasksBox() {

    let tasksCard = document.querySelectorAll("section main .tasks-container .task-card")

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

function tasksSetting(){
    settingButton.forEach((settingButton, index) => {

        let didntDelete = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .boxesCont .no"),
        confirmDelete = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .boxesCont .delete"),
        DeleteButton = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .delete"),
        taskContainer = settingButton.parentElement.parentElement.querySelector(".container"),
        editButton = settingButton.parentElement.parentElement.querySelector(".trash  .settingBox .edit"),
        TaskCard = settingButton.parentElement.parentElement,
        TitleDiv = settingButton.parentElement.parentElement.querySelector(".title"),
        containerDiv = settingButton.parentElement.parentElement.querySelectorAll(".container .task"),
        dateDiv = settingButton.parentElement.parentElement.querySelector(".date "),
        deleteImg = settingButton.parentElement.parentElement.querySelector(".deleteImg"),
        EditedTaskDate = null;


        settingButton.addEventListener("click", function(){
            settingButton.parentElement.classList.toggle('open');

            function deleteTask() {

                DeleteButton.addEventListener("click", function(){
                    settingButton.parentElement.querySelector(".task-card .trash  .settingBox ").querySelector('.deleteBox').classList.toggle('open');
                    return;
                }) 
    
                didntDelete.addEventListener("click", function(){
                    settingButton.parentElement.querySelector(".task-card .trash  .settingBox ").querySelector('.deleteBox').classList.remove('open')
                })
    
                confirmDelete.addEventListener("click", function(){
                    let elementId = settingButton.parentElement.parentElement.getAttribute('data-id')
                    deleteTaskFromDatabase(elementId)
                    settingButton.parentElement.parentElement.remove()
                    handleTasksViewInPage()
                    let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                    delete allTasks[elementId];
                    sessionStorage.setItem("allTasks" , JSON.stringify(allTasks))
                })

                return;
            }
            deleteTask()

            // ######################## Edit Task ########################
            function editTask() {
                let elementId = settingButton.parentElement.parentElement.getAttribute('data-id');
                let editedTasks = settingButton.parentElement.parentElement;
                let cancelButton = null;

                editButton.addEventListener("click", function() {

                    settingButton.parentElement.style = "display: none"

                    // let removeBottomTaskCont = document.querySelectorAll(".tasks-container .task-card .container .task")
                    // removeBottomTaskCont.forEach(element => {
                    //     // element.querySelector(".bottomTaskCont").remove()
                    // })

                    let taskCard = editButton.parentElement.parentElement.parentElement;
                    taskCard.setAttribute("edit", "true")

                    if(settingButton.parentElement.parentElement.getAttribute("data-status") == 'complete'){
                        settingButton.parentElement.parentElement.classList.add("on-edit")
                    }

                    function editTaskHandle() {

                        settingButton.parentElement.classList.toggle('open');
                        editedTasks.style.opacity = "1"

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
                        TaskCard.insertBefore(addTaskButton , buttonsDiv)

                        function HandleTasksArrangeWhenDeleteOne() {
                            taskContainer.querySelectorAll(".task").forEach((element ,index)=> {
                                element.querySelector(".cont").querySelector(".num").innerHTML = `${index + 1} -` 
                            });
                        }

                        let tasksNum = containerDiv.length;
                        addTaskButton.addEventListener("click", function() {
                            tasksNum ++ 

                            // Create the task div
                            const taskDiv = document.createElement('div');
                            taskDiv.className = 'task';
                            taskDiv.setAttribute("data-status" , 'false')

                            // Create the cont div
                            const contDiv = document.createElement('div');
                            contDiv.className = 'cont';

                            const TaskNum = document.createElement('div');
                            TaskNum.className = 'num';
                            TaskNum.innerText = `${tasksNum} - `

                            const TaskData = document.createElement('input');
                            TaskData.className = 'TaskData';
                            TaskData.placeholder = '...'

                            const deleteTaskImg = document.createElement('img');
                            deleteTaskImg.className = 'deleteImg';
                            deleteTaskImg.src = 'assets/imgs/close.png'
                            deleteImg = deleteTaskImg;

                            const upperTaskCont = document.createElement('div');
                            upperTaskCont.className = 'upperTaskCont';

                            contDiv.appendChild(TaskNum)
                            contDiv.appendChild(TaskData)
                            upperTaskCont.appendChild(contDiv)
                            upperTaskCont.appendChild(deleteTaskImg)
                            taskDiv.appendChild(upperTaskCont)
                            
                            taskContainer.appendChild(taskDiv)

                            // ################## delete new added tasks ################
                            deleteTaskImg.addEventListener("click", function() {
                                deleteTaskImg.parentElement.parentElement.remove();
                                tasksNum--
                                HandleTasksArrangeWhenDeleteOne()
                            })

                            handleEveryNestedTaskData() 
                        })

                        containerDiv.forEach(element => {
                            let taskClass = element.querySelector(".cont").children[1].className;
                            let taskValue = element.querySelector(".cont").children[1].innerText;
                            let taskInput = document.createElement("input");
                            taskInput.classList.add(`${taskClass}`);
                            taskInput.value = taskValue;
                            element.querySelector(".cont").children[1].replaceWith(taskInput);

                            let deleteTaskImg = document.createElement('img');
                            deleteTaskImg.className = 'deleteImg';
                            deleteTaskImg.src = 'assets/imgs/close.png'
                            deleteImg = deleteTaskImg;

                            element.querySelector(".cont").parentElement.lastChild.replaceWith(deleteTaskImg)

                            // ################## delete current task ################
                            deleteTaskImg.addEventListener("click", function() {
                                element.querySelector(".cont").parentElement.parentElement.remove();
                                tasksNum--
                                HandleTasksArrangeWhenDeleteOne()
                            })

                        });

                    }
                    editTaskHandle()

                    function SaveEditedTask() {
                        let DoneButtonB = settingButton.parentElement.parentElement.querySelector(".DoneButton");

                        DoneButtonB.addEventListener("click", function() {
                            let num = null,
                                taskContent = null,
                                status = null,
                                taskData = {},
                                id ,
                                allTasksData = {};
    
                            settingButton.parentElement.parentElement.querySelectorAll(".task").forEach((element , index) => {

                                id = element.parentElement.parentElement.getAttribute("data-id");
                                let alreadyExistTasks = JSON.parse(sessionStorage.getItem("allTasks"))[id]['taskData']['data']
                                let alreadyExistTasksLength = Object.keys(alreadyExistTasks).length;
                                let addedDate ;

                                if(index < alreadyExistTasksLength){
                                    addedDate = alreadyExistTasks[index]["added_date"]
                                } else{
                                    let now = new Date();
                                    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                                    let NewAddedDate = now.toLocaleString('en-US', options);
                                    addedDate = NewAddedDate;
                                }

                                num = `${index + 1} -`;
                                taskContent = element.querySelector(".cont").querySelector("input").value
                                status = element.getAttribute("data-status");

                                if(alreadyExistTasks[index] === undefined){
                                    taskData = {num: num , content: taskContent, "status": `${status}`, "added_date": addedDate}
                                } else {
                                    if (alreadyExistTasks[index]['complete_date'] == undefined){
                                        taskData = {num: num , content: taskContent, "status": `${status}`, "added_date": addedDate}
                                    } else {
                                        let completeDate = alreadyExistTasks[index]['complete_date']
                                        taskData = {num: num , content: taskContent, "status": `${status}`, "added_date": addedDate, "complete_date": completeDate}
                                    }
                                }
                                allTasksData[index] = taskData                                    
                            });

                            let editedTask = {
                                title: `${editedTasks.querySelector(".title").value}`,
                                date: `${JSON.parse(sessionStorage.getItem("allTasks"))[id]["taskData"]["date"]}`,
                                data: allTasksData
                            }

                            // error with sending data to database
                            addTask(elementId, editedTask);
                            let handledData = {
                                id: elementId,
                                taskData: editedTask
                            }
                            addTasksFromDataBase(elementId, handledData, taskCard)
                            let allTasks = JSON.parse(sessionStorage.getItem("allTasks"));
                            allTasks[elementId] = {
                                id: elementId,
                                taskData: editedTask
                            }
                            sessionStorage.setItem("allTasks" , JSON.stringify(allTasks))
                        })
                    }
                    SaveEditedTask()

                    function cancelEdit() {
                        cancelButton.addEventListener("click", function() {
                            window.location.reload();
                        })
                    }
                    cancelEdit()

                    handleEveryNestedTaskData()

                })
            }
            editTask()

        })
    });
}

function handleTasksViewInPage() {

    let allTasksCard = document.querySelectorAll(".tasks-container .task-card")
    if(allTasksCard.length !== 0) {
        
        let tasksContainerWidth = allTasksCard[0].parentElement.offsetWidth
        let taskWidth = allTasksCard[0].offsetWidth
        let gap = 20;
    
        let numberOfBoxes = 1;
        while (tasksContainerWidth / numberOfBoxes >= (taskWidth + gap)) {
            numberOfBoxes++ 
        }
        let freeSpace = tasksContainerWidth - (taskWidth * (numberOfBoxes - 1)) - (gap * numberOfBoxes - 1);
    
        allTasksCard.forEach((element, index) => {
            if(numberOfBoxes > 3){
                if((index + 2) <= numberOfBoxes){
                    if(index == 0){
                        element.style.cssText = `left: ${0} `
                    } else {
                        element.style.cssText = `left: ${(index * (taskWidth + gap)) + ((freeSpace / (numberOfBoxes - 1)) * index) }px`
                    }
                } else {
                    let topElement = (allTasksCard[(index + 1) - numberOfBoxes].clientHeight + 10)
                    let styles = window.getComputedStyle(allTasksCard[(index + 1) - numberOfBoxes]);
                    let topElementTopPosition = styles.getPropertyValue("top").split("px")[0]
                    element.style.cssText = `top: ${+topElementTopPosition + +topElement + gap}px; left: ${styles.getPropertyValue('left')}`
                }
            } else if(numberOfBoxes == 3) {
                if((index + 2) <= numberOfBoxes){
                    if(index == 0){
                        element.style.cssText = `left: ${freeSpace / 3}px `
                    } else {
                        element.style.cssText = `left: ${(index * (taskWidth + gap)) + ((freeSpace / 3) * 2) }px`
                    }
                } else {
                    let topElement = (allTasksCard[(index + 1) - numberOfBoxes].clientHeight + 10)
                    let styles = window.getComputedStyle(allTasksCard[(index + 1) - numberOfBoxes]);
                    let topElementTopPosition = styles.getPropertyValue("top").split("px")[0]
                    element.style.cssText = `top: ${+topElementTopPosition + +topElement + gap}px; left: ${styles.getPropertyValue('left')}`
                }
            } else if(numberOfBoxes == 2){
                if(index == 0) {
                    if(index == 0){
                        element.style.cssText = `left: ${freeSpace / 2 + gap}px `
                    }
                } else {
                    let topElement = (allTasksCard[(index + 1) - numberOfBoxes].clientHeight + 10)
                    let styles = window.getComputedStyle(allTasksCard[(index + 1) - numberOfBoxes]);
                    let topElementTopPosition = styles.getPropertyValue("top").split("px")[0]
                    element.style.cssText = `top: ${+topElementTopPosition + topElement + gap + 10}px; left: ${styles.getPropertyValue('left')}`
                }
            }
        });
    }

}

function handleEveryNestedTaskData() {
    let test = document.querySelectorAll(".tasks-container .task-card .container .task")
    test.forEach(element => {
        element.addEventListener("click", function (){
            element.classList.toggle("open")
        })

        // Create a ResizeObserver instance
        let resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            // let height = entry.contentRect.height;
            handleTasksViewInPage()
        }
        });
        resizeObserver.observe(element);
    });
}
