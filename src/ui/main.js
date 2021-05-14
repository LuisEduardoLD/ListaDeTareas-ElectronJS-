const taskForm = document.querySelector('#taskForm')
const taskName = document.querySelector('#taskName')
const taskDescription = document.querySelector('#taskDescription')
const taskList = document.querySelector('#taskList')

const { ipcRenderer, inAppPurchase } = require('electron')
let tasks = [];
let updateStatus = false;
let idTaskToUpdate = '';

function editTask(id){
    updateStatus = true;
    idTaskToUpdate = id;
    const task = tasks.find(task => task._id === id);
    taskName.value = task.name;
    taskDescription.value = task.description;
}

function deleteTask(id){
    const result = confirm("Are you sure you want to delete it?");
    if(result){
        ipcRenderer.send('delete-task',id);
    }
    return;
}

function renderTasks(tasks){
    taskList.innerHTML = '';
    tasks.map(t => {
        taskList.innerHTML += `
        <li>
            <h4>Task Id: ${t._id}</h4>
            <p>Task Name: ${t.name}</p>
            <p>Task Description: ${t.description}</p>
            <button onClick=deleteTask('${t._id}');>
                Delete
            </button>
            <button onClick=editTask('${t._id}');>
                Edit
            </button>
        </li>
        `; 
    })
}

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const task = {
        name: taskName.value,
        description: taskDescription.value
    }
    
    if(!updateStatus){
        ipcRenderer.send('new-task', task);
    }else{
        ipcRenderer.send('update-task', {...task, idTaskToUpdate});
    }
    taskForm.reset();
});

ipcRenderer.on('new-task-created',(e, args) => {
    const newTask = JSON.parse(args);
    tasks.push(newTask);
    renderTasks(tasks);
    taskName.focus();
})

ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args) => {
    const taskReceived = JSON.parse(args);
    tasks = taskReceived;
    renderTasks(tasks);
});

ipcRenderer.on('delete-task-success', (e,args)=>{
    const deletedTask = JSON.parse(args);
    const newTask = tasks.filter(t => {
        return t._id !==deletedTask._id;
    });
    tasks = newTasks;
    renderTasks(tasks);
})

ipcRenderer.on('update-task-success', (e, args)=>{
    const updatedTask = JSON.parse(args);
    tasks = tasks.map(t => {
        if(t._id === updatedTask._id){
            t.name = updatedTask.name;
            t.description = updatedTask.description;
        }
        return t;
    })
    renderTasks(tasks);
})