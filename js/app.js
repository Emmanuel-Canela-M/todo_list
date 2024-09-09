const formulario = document.querySelector("#formulario");
const lista_tareas = document.querySelector("#lista-tareas");
const input = document.querySelector("#input");
const template = document.querySelector("#template").content;
const fragment = document.createDocumentFragment();
let tareas = {};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("tareas")) {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }
  pintarTareas();
});

lista_tareas.addEventListener("click", (e) => {
  btnAction(e);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  setTarea(e);
});

const setTarea = (e) => {
  if (input.value.trim() === "") {
    // ? mdlEmpty()
    return;
  }

  let tarea = {
    id: Date.now(),
    texto: input.value,
    estado: false,
  };

  tareas[tarea.id] = tarea;
  formulario.reset();
  input.focus();
  pintarTareas(tarea);
};

const pintarTareas = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));

  if (Object.values(tareas).length === 0) {
    lista_tareas.innerHTML = `<div class="alert alert-dark">No hay tareas pendientes</div>`;
    return;
  }

  lista_tareas.innerHTML = "";
  Object.values(tareas).forEach((tarea) => {
    const clone = template.cloneNode(true);
    clone.querySelector("p").textContent = tarea.texto;

    if (tarea.estado) {
      clone
        .querySelector(".alert")
        .classList.replace("alert-warning", "alert-primary");
      clone
        .querySelectorAll(".fa-solid")[0]
        .classList.replace("fa-circle-check", "fa-rotate-right");
      clone.querySelector("p").style.textDecoration = "line-through";
    }

    clone.querySelectorAll(".fa-solid")[0].dataset.id = tarea.id;
    clone.querySelectorAll(".fa-solid")[1].dataset.id = tarea.id;
    fragment.appendChild(clone);
  });
  lista_tareas.appendChild(fragment);
};

const btnAction = (e) => {
  if (e.target.classList.contains("fa-circle-check")) {
    tareas[e.target.dataset.id].estado = true;
    pintarTareas();
  }

  if (e.target.classList.contains("fa-circle-minus")) {
    delete tareas[e.target.dataset.id];
    pintarTareas();
  }
  if (e.target.classList.contains("fa-rotate-right")) {
    tareas[e.target.dataset.id].estado = false;
    pintarTareas();
  }

  e.stopPropagation();
};
