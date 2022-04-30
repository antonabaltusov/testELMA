export class View {
  constructor() {
    this.container = this.getElement(".container");
    if (this.container.offsetWidth > 500) {
      this.backlog = this.createElement("div", "backlog");
      this.backlog.innerHTML = `
      <p class="backlog-name">Backlog</p>
      <div class="search">
      <input type="text" class="search-input" placeholder="поиск">
      <button class="search-button">
      <svg class="search-svg" version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="7pt" height="7pt" viewBox="0 0 1280.000000 1276.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.15, written by Peter Selinger 2001-2017
</metadata>
<g transform="translate(0.000000,1276.000000) scale(0.100000,-0.100000)"
 stroke="none">
<path d="M4600 12749 c-1217 -85 -2313 -580 -3160 -1429 -788 -790 -1271
-1788 -1404 -2905 -153 -1278 200 -2564 983 -3585 181 -237 501 -570 726 -759
316 -263 641 -473 1020 -657 537 -261 1052 -404 1715 -476 183 -19 720 -16
925 5 703 75 1359 282 1948 614 l98 56 87 -85 c48 -46 805 -782 1683 -1634
877 -853 1618 -1571 1646 -1596 227 -202 530 -311 818 -295 180 10 292 40 460
122 132 65 213 125 323 239 341 355 427 879 217 1323 -62 132 -134 231 -260
359 -60 61 -829 808 -1707 1658 -879 851 -1598 1551 -1598 1555 0 5 25 51 55
102 135 226 282 545 377 814 182 516 271 993 285 1540 20 806 -143 1565 -491
2280 -239 491 -521 893 -896 1279 -379 389 -794 695 -1275 942 -789 404 -1704
594 -2575 533z m502 -1973 c478 -20 1000 -194 1425 -475 1366 -904 1746 -2702
857 -4061 -221 -338 -521 -638 -864 -863 -892 -586 -2052 -635 -2983 -127
-736 401 -1266 1079 -1468 1877 -68 269 -83 398 -83 713 0 236 3 296 23 420
49 316 127 569 260 845 151 314 327 560 576 810 463 465 1049 757 1695 845 90
13 355 28 405 23 17 -1 87 -5 157 -7z"/>
</g>
</svg>
      </button>
      </div>
      <ul class="backlog-list"></ul>
    `;
      this.container.append(this.backlog);
    }
    this.diagram = this.getElement(".diagram");

    this.countTd = Math.round(this.diagram.offsetWidth / 100) - 1;
    this.countTd = this.countTd < 7 ? 7 : this.countTd;
    this.firstDay = new Date();
    this.firstDay.setDate(this.firstDay.getDate() - 2);
    this.firstDay.setHours(0, 1, 0, 0);
  }
  displayError = (err) => {
    const errors = this.getElement(".error");
    const p = this.createElement("p");
    p.textContent = err;
    if (!errors) {
      errors = this.createElement("div", "error");
      errors.append(p);
      this.container.append(errors);
    } else {
      errors.append(p);
    }
  };

  createElement = (tag, className) => {
    const element = document.createElement(tag);
    if (className) {
      if (className instanceof Array) {
        element.classList.add(...className);
      } else element.classList.add(className);
    }
    return element;
  };

  getElement = (selector) => {
    const element = document.querySelector(selector);
    return element;
  };

  removeElement = (selector) => {
    const element = this.getElement(selector);
    element.remove();
  };

  displayApp = (data) => {
    this.displayBacklog(data.backlog);
    this.displayTable(data.tasks, data.users);
  };

  displayTable = (tasks, users) => {
    const t = this.getElement(".table");
    if (t) {
      t.remove();
    }
    const table = this.createElement("div", "table");
    table.style.gridTemplateColumns = `repeat(${this.countTd + 1}, 1fr)`;
    table.style.gridTemplateRows = `auto repeat(${users.length}, minmax(100px, 1fr))`;

    //row of dates
    const dateArray = [];
    for (let i = 0; i <= this.countTd; i++) {
      if (i === 0) {
        table.append(this.createElement("div", "author-column"));
      } else {
        const date = new Date(this.firstDay);
        date.setDate(date.getDate() + i - 1);
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
        const th = this.createElement("p", "date-cell");
        th.textContent = `${_date[0]}.${_date[1]}`;
        table.append(th);
      }
    }
    //row of tasks
    users.forEach((user) => {
      const td = this.createElement("div", ["td", "td-author"]);
      td.id = `cell-${user.id}`;
      const p = this.createElement("p", "author");
      p.textContent = user.firstName;
      td.append(p);
      table.append(td);
      for (let i = 0; i < this.countTd; i++) {
        const td = this.createElement("div", ["td", "td-task"]);

        td.id = `cell-${user.id}-${dateArray[i]}`;
        table.append(td);
      }
    });
    this.diagram.append(table);
    this.addListenerOnDrag();
    this.setTasks(tasks, users);
  };
  displayBacklog = (tasks) => {
    if (this.backlog) {
      this.backlogList = this.getElement(".backlog-list");
      while (this.backlogList.firstChild) {
        this.backlogList.removeChild(this.backlogList.firstChild);
      }
      if (tasks.length === 0) {
        const li = this.createElement("li");
        li.textContent = "the list is empty";
        this.backlogList.append(li);
      } else {
        tasks.forEach((task) => {
          const li = this.createElement("li", "backlog-item");
          li.id = `id${task.id}`;
          li.draggable = true;
          const p = this.createElement("p", "backlog-item__name");
          p.textContent = `${task.subject}`;
          const d = this.createElement("p", "backlog-item__description");
          d.textContent = `${task.description}`;
          li.append(p, d);
          this.backlogList.append(li);
        });
      }
    }
  };
  setTask = (task, firstName) => {
    const cell = this.getElement(
      `#cell-${task.executor}-${new Date(task.planStartDate)
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/[/]/g, "-")}`
    );
    if (cell) {
      const taskElement = this.createElement("div", "task");
      const p = this.createElement("p", "task-name");
      p.textContent = task.subject;
      const description = this.createElement("div", "task-about");
      for (let [key, value] of Object.entries(task)) {
        if (key === "id") {
          continue;
        }
        if (key === "executor") {
          continue;
        }
        const p = this.createElement("p", "task-about__item");
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
    const table = this.getElement(".table");
    if (this.backlog) {
      this.getElement(".backlog-list").addEventListener(
        "dragstart",
        (event) => {
          const value = event.target.id;
          this.taskDroping = value.slice(2);
        }
      );
      table.addEventListener("dragenter", (event) => {
        if (event.target.classList.contains("td-task")) {
          event.target.classList.add("hover");
          console.log("enter", event.target);
        }
        // else if (
        //   event.target.classList.contains("task-name") ||
        //   event.target.classList.contains("author") ||
        //   event.target.classList.contains("task")
        // ) {
        //   const td = event.path.find((el) => el.classList.contains("td"));
        //   console.log("enter", event.target);
        //   td.classList.add("hover");
        // }
      });
      table.addEventListener("dragleave", (event) => {
        if (event.target.classList.contains("td-task")) {
          event.target.classList.remove("hover");
          console.log("leave", event.target);
        }
        // else if (
        //   event.target.classList.contains("author") ||
        //   event.target.classList.contains("task")
        // ) {
        //   console.log("leave", event.target);
        //   event.path[2].classList.remove("hover");
        // }
      });
      table.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
    }
  };
  bindGetTasks = (handler) => {
    this.getTasks = handler;
  };
  bindChangeDate = (handle) => {
    this.getElement(".buttons").addEventListener("click", (event) => {
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
  bindGetTasks = (handler) => {
    this.container.addEventListener("getTasks", () => {
      handler(this.firstDay);
    });
    this.container.dispatchEvent(this.getTasks);
  };
  bindDropTask = (handler) => {
    if (this.backlog) {
      this.getElement(".diagram").addEventListener("drop", (event) => {
        let element;
        if (event.target.classList.contains("td")) {
          element = event.target;
        } else if (
          event.target.classList.contains("task-name") ||
          event.target.classList.contains("author") ||
          event.target.classList.contains("task")
        ) {
          element = event.path.find((el) => el.classList.contains("td"));
        }
        if (element && element.childNodes.length < 6) {
          console.log(element.childNodes.length);
          element.classList.remove("hover");
          let data = element.id.split("-");
          handler(
            this.taskDroping,
            data[1],
            data[2] ? `${data[4]}-${data[3]}-${data[2]}` : null
          );
        }
      });
    }
  };
  displayDropTask = ({ task, firstName }) => {
    this.getElement(`#id${task.id}`).remove();
    this.setTask(task, firstName);
  };
}
