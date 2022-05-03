import { createElement, getElement, removeElement } from "./common.js";

export class ViewTable {
  constructor(container, diagram, countTd) {
    this.container = container;
    this.diagram = diagram;
    this.countTd = countTd;
  }

  displayTable = (tasks, users, firstDay) => {
    const t = getElement(".table");
    if (t) {
      t.remove();
    }
    const table = createElement("div", "table");
    table.style.gridTemplateColumns = `repeat(${this.countTd + 1}, 1fr)`;
    if (this.container.offsetWidth >= 768) {
      table.style.gridTemplateRows = `auto repeat(${users.length}, minmax(100px, 1fr))`;
    }
    //row of dates
    const dateArray = [];
    let today = -1;
    for (let i = 0; i <= this.countTd; i++) {
      if (i === 0) {
        table.append(createElement("div", "author-column"));
      } else {
        const date = new Date(firstDay);
        date.setDate(date.getDate() + i - 1);
        if (date.getDate() == new Date().getDate()) {
          today = i - 1;
        }
        dateArray.push(
          date
            .toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/[/]/g, "-")
        );
        const _date = date
          .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
          .split("/");
        const td = createElement(
          "div",
          i - 1 == today ? ["date-cell", "today"] : "date-cell"
        );
        td.textContent = `${_date[0]}.${_date[1]}`;
        table.append(td);
      }
    }
    //row of tasks
    users.forEach((user) => {
      const td = createElement("div", ["td", "td-author"]);
      td.id = `cell-${user.id}`;
      const p = createElement("p", "author");
      const div = createElement("div", "task");
      p.textContent = user.firstName;
      div.append(p);
      td.append(div);
      table.append(td);
      for (let i = 0; i < this.countTd; i++) {
        const td = createElement(
          "div",
          i == today ? ["td", "td-task", "today"] : ["td", "td-task"]
        );
        td.id = `cell-${user.id}-${dateArray[i]}`;
        table.append(td);
      }
    });
    this.diagram.append(table);
    this.addListenerOnDrag();
    this.setTasks(tasks, users);
  };
  setTask = (task, firstName) => {
    const cell = getElement(
      `#cell-${task.executor}-${new Date(task.planStartDate)
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/[/]/g, "-")}`
    );
    if (cell) {
      const taskElement = createElement("div", "task");
      const p = createElement("p", "task-name");
      p.textContent = task.subject;
      const description = createElement("div", "task-about");
      for (let [key, value] of Object.entries(task)) {
        if (key === "id") {
          continue;
        }
        if (key === "executor") {
          continue;
        }
        const p = createElement("p", "task-about__item");
        if (key === "creationAuthor") {
          value = firstName;
        }
        p.textContent = `${key}: ${value}`;
        description.append(p);
      }
      taskElement.append(p, description);
      cell.append(taskElement);
    }
  };
  setTasks = (tasks, users) => {
    tasks.forEach((task) => {
      const firstName = users.find(
        (user) => user.id == task.creationAuthor
      ).firstName;
      this.setTask(task, firstName);
    });
  };
  addListenerOnDrag = () => {
    if (getElement(".backlog-list")) {
      const table = getElement(".table");
      table.addEventListener("dragenter", (event) => {
        if (event.target.classList.contains("td-task")) {
          event.target.classList.add("hover");
        }
      });
      table.addEventListener("dragleave", (event) => {
        if (event.target.classList.contains("td-task")) {
          event.target.classList.remove("hover");
        }
      });
      table.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
    }
  };
}
