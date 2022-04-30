//   {id:"c2af31a1-4eca-4433-814f-5c6e32eab150",
//   subject:"Анализ",
//   "description":"",
//   "creationAuthor":1,
//   "executor":1,
//   "creationDate":"2022-04-25",
//   "planStartDate":"2022-04-25",
//   "planEndDate":"2022-04-27",
//   "endDate":"2022-04-25",
//   "status":1,
//   "order":1}

//   {"id":1,
//   "username":"user1",
//   "surname":"Смагин",
//   "firstName":"Иван",
//   "secondName":""}

export class Model {
  constructor() {
    this.users = [];
    this.usersUrl =
      "https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users?limit=15";
    this.tasks = [];
    this.backlog = [];
    this.tasksUrl =
      "https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks";
  }
  getTasksAndUsers = (firstDay, countDays, callback, err) => {
    this.getDataFromApi(
      "tasks",
      (tasks) => {
        this.sortTasks(tasks);
        if (this.users.length) {
          callback({
            tasks: this.sortTasksByDate(firstDay, countDays),
            backlog: this.backlog,
            users: this.users,
          });
        }
      },
      err
    );
    this.getDataFromApi(
      "users",
      (users) => {
        this.users = users;
        if (this.tasks.length) {
          callback({
            tasks: this.sortTasksByDate(firstDay, countDays),
            backlog: this.backlog,
            users: this.users,
          });
        }
      },
      err
    );
  };

  getDataFromApi = (typeData, callback, err) => {
    fetch(typeData == "users" ? this.usersUrl : this.tasksUrl)
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            callback(json);
            console.log(json);
          });
        } else {
          alert("Ошибка HTTP: " + response.status);
        }
      })
      .catch((reason) =>
        err(
          reason + ` by ${typeData == "users" ? this.usersUrl : this.tasksUrl}`
        )
      );
  };

  getTasks = (firstDay, countTd, handle) => {
    let tasks = this.sortTasksByDate(firstDay, countTd);
    handle(tasks, this.users);
  };

  sortTasks = (tasks) => {
    tasks.forEach((task) => {
      if (task.executor) {
        this.tasks.push(task);
      } else {
        this.backlog.push(task);
      }
    });
  };

  DropTask = (taskId, authorId, date) => {
    let index = this.backlog.findIndex((task) => task.id == taskId);
    let task = this.backlog.splice(index, 1)[0];
    task.executor = authorId;
    if (date) {
      task.planStartDate = date;
    }
    this.tasks.push(task);
    return task;
  };

  sortTasksByDate = (firstDay, countDays) => {
    let firstDayString = firstDay.toISOString().slice(0, 10);
    let lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + countDays);
    let lastDayString = lastDay.toISOString().slice(0, 10);
    return this.tasks.filter(
      (task) =>
        task.planStartDate >= firstDayString &&
        task.planStartDate <= lastDayString
    );
  };
}
