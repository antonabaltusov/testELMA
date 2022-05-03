import { backlog } from "./backlog-inner-html.js";
import { createElement, getElement, removeElement } from "./common.js";

export class ViewBacklog {
  constructor(container) {
    const body = getElement("body");
    this.backlogIs = false;
    if (body.offsetWidth > 500) {
      this.backlogIs = true;
      this.backlog = createElement("div", "backlog");
      this.backlog.innerHTML = backlog;
      container.append(this.backlog);
    }
  }
  displayBacklog = (tasks) => {
    if (this.backlogIs) {
      this.backlogList = getElement(".backlog-list");
      while (this.backlogList.firstChild) {
        this.backlogList.removeChild(this.backlogList.firstChild);
      }
      if (tasks.length === 0) {
        const li = createElement("li");
        li.textContent = "the list is empty";
        this.backlogList.append(li);
      } else {
        tasks.forEach((task) => {
          const li = createElement("li", "backlog-item");
          li.id = `id${task.id}`;
          li.draggable = true;
          const p = createElement("p", "backlog-item__name");
          p.textContent = `${task.subject}`;
          const d = createElement("p", "backlog-item__description");
          d.textContent = `${task.description}`;
          li.append(p, d);
          this.backlogList.append(li);
        });
      }
      this.addListenerOnDragStart();
    }
  };
  addListenerOnDragStart = () => {
    if (this.backlog) {
      this.backlogList.addEventListener("dragstart", (event) => {
        const value = event.target.id;
        this.dropingTask = value.slice(2);
      });
    }
  };
  removeTask = (id) => {
    removeElement(`#id${id}`);
  };
}
