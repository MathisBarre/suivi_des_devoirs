"use strict"
/* Data */

const sddDoElt = document.getElementById("sdd_do");
const sddToDoElt = document.getElementById("sdd_todo");
const btnMajDataElt = document.getElementById("btn_data-maj");
const txtareaDataElt = document.getElementById("data_textarea");
const btnOpenDataBoxElt = document.getElementById("open_data-box");
const btnAddTaskElt = document.getElementById("btn_add-task");
const defaultParam = [
    {
        title: "Exemple #1",
        endingDate: {
            forecast: "20 sept 2019"
        },
        isDone: false
    },
    {
        title: "Exemple #2",
        endingDate: {
            real: "30 sept 2019"
        },
        isDone: true
    },
]
const localDateOption = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var data;

/* Init */

if (localStorage.getItem("data") === null ) {
    localStorage.setItem("data", JSON.stringify(defaultParam) );
    data =  defaultParam;
    console.info("Données par défaut initialisées")
} else {
    data = JSON.parse(localStorage.getItem("data"));
}

btnMajDataElt.addEventListener("click", update_data);
btnOpenDataBoxElt.addEventListener("click", open_databox);
btnAddTaskElt.addEventListener("click", auto_add_data);

render_page();

if (location.hash === "#data_box") {
    open_databox();
}

/* App */

function render_page ()  {
    sddDoElt.innerHTML = ""; sddToDoElt.innerHTML = "";

    let sortedData = data.sort((a,b) => {
        return Date.parse(a.endingDate.forecast) - Date.parse(b.endingDate.forecast);
    });
    
    sortedData.forEach( (task) => {
        if ( task.isDone ) {
            let realEndingDate = new Date(Date.parse(task.endingDate.real)).toLocaleDateString('fr-FR', localDateOption );
            let divElt = createTaskElt("img/x.svg", mark_undone, `Terminé le ${realEndingDate}`, task.title );
            sddDoElt.appendChild(divElt);
        } else {
            let taskForecastDate = new Date(Date.parse(task.endingDate.forecast));
            let dayRemaining = Math.ceil( ( taskForecastDate.getTime() - Date.now() ) / 1000 / 60 / 60 / 24 );
            let isLate = dayRemaining < 0
            let divElt = createTaskElt("img/v.svg", mark_done, `A avoir terminé dans ${dayRemaining} jours`, task.title, isLate );
            sddToDoElt.appendChild(divElt);                
        }
    });
    console.info("Page rendered");
}

function mark_done (e) { mark(true, e) };
function mark_undone (e) { mark(false, e)};

function mark(markDone, e) {
    data.forEach( (task) => {
        if ( task.title === e.target.parentElement.firstChild.textContent ) {
            if (markDone) {
                task.endingDate.real = Date(Date.now()).toLocaleString("en-EN", localDateOption);
            } else {
                if (task.endingDate.forecast === undefined) {
                    task.endingDate.forecast = task.endingDate.real;
                }
            }
            task.isDone = markDone;
            save_data();
        }
    })
    render_page();
}

function createTaskElt (img, eventOnBtn, pText, taskTitle, isLate = false) {
    var divElt = document.createElement("div");
    var h2Elt = document.createElement("h2");
    var pElt = document.createElement("p");
    var imgElt = document.createElement("img");

    h2Elt.textContent = taskTitle;

    imgElt.src = img;
    imgElt.addEventListener("click", eventOnBtn);

    pElt.textContent = pText;
    pElt.style.color = isLate ? "#a60000" : "inherit";

    divElt.style.backgroundColor = isLate ? "rgba(166, 0, 0, 0.07)" : "inherit";
    divElt.classList.add("task");
    divElt.appendChild(h2Elt);
    divElt.appendChild(pElt);
    divElt.appendChild(imgElt);

    return divElt;
}

function add_data(array){
    data = data.concat(array);
    save_data();
    render_page()
}

function auto_add_data(e) {
    e.preventDefault();
    let newTitle = document.getElementById("newtask-title").value;
    let newDate = document.getElementById("newtask-date").value;
    let newTask = [
        {
            title: newTitle,
            endingDate: {
                forecast: newDate
            },
            isDone: false
        }
    ];
    add_data(newTask);
}

function save_data() {
    localStorage.setItem("data", JSON.stringify(data));
}

function open_databox() {
    txtareaDataElt.value = JSON.stringify(data, null, "   ");
}

function update_data(e) {
    e.preventDefault();
    (txtareaDataElt.value != "") ? data = JSON.parse(txtareaDataElt.value) : data = [];
    console.log(data);
    save_data();
    location.hash = "";
    render_page();
    console.info("Data update");
}

