import { ViewBacklog } from "./view-backlog.js";
import { createElement, getElement, removeElement } from "./common.js";
import { ViewTable } from "./view-table.js";

export class View {
  constructor() {
    this.container = getElement(".container");
    this.diagram = getElement(".diagram");
    this.countTd = Math.round(this.diagram.offsetWidth / 100) - 1;
    this.countTd = this.countTd < 7 ? 7 : this.countTd;
    this.getFirstDay();
    this.backlog = new ViewBacklog(this.container);
    this.table = new ViewTable(this.container, this.diagram, this.countTd);
  }
  getFirstDay() {
    this.firstDay = new Date();
    this.firstDay.setDate(this.firstDay.getDate() - 2);
    this.firstDay.setHours(0, 1, 0, 0);
  }
  displayError = (err) => {
    const errors = getElement(".error");
    const p = createElement("p");
    p.textContent = err;
    if (!errors) {
      errors = createElement("div", "error");
      errors.append(p);
      this.container.append(errors);
    } else {
      errors.append(p);
    }
  };
  displayApp = (data) => {
    this.backlog.displayBacklog(data.backlog);
    this.displayTable(data.tasks, data.users);
  };
  displayTable = (tasks, users) => {
    this.table.displayTable(tasks, users, this.firstDay);
  };
  displayDropTask = ({ task, firstName }) => {
    this.backlog.removeTask(task.id);
    this.table.setTask(task, firstName);
  };
  bindChangeDate = (handle) => {
    getElement(".buttons").addEventListener("click", (event) => {
      const value = event.target.classList;
      if (value.contains("button-left")) {
        this.firstDay.setDate(this.firstDay.getDate() - 7);
        handle(this.firstDay, this.countTd);
      } else if (value.contains("button-right")) {
        this.firstDay.setDate(this.firstDay.getDate() + 7);
        handle(this.firstDay, this.countTd);
      }
    });
  };
  bindDropTask = (handler) => {
    if (this.backlog.backlogIs) {
      this.diagram.addEventListener("drop", (event) => {
        let element;
        if (event.target.classList.contains("td")) {
          element = event.target;
        } else if (
          event.target.classList.contains("task-name") ||
          event.target.classList.contains("author") ||
          event.target.classList.contains("task")
        ) {
          const parents =
            event.path || (event.composedPath && event.composedPath());
          element = parents.find((el) => el.classList.contains("td"));
        }
        if (element && element.childNodes.length < 6) {
          element.classList.remove("hover");
          let data = element.id.split("-");
          handler(
            this.backlog.dropingTask,
            data[1],
            data[2] ? `${data[4]}-${data[3]}-${data[2]}` : null
          );
        }
      });
    }
  };
}
