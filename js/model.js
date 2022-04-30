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

  dropTask = (taskId, authorId, date) => {
    const index = this.backlog.findIndex((task) => task.id == taskId);
    const task = this.backlog.splice(index, 1)[0];
    task.executor = authorId;
    const firstName = this.users.find(
      (user) => user.id == task.creationAuthor
    ).firstName;
    if (date) {
      task.planStartDate = date;
    }
    this.tasks.push(task);
    return { task: task, firstName: firstName };
  };

  sortTasksByDate = (firstDay, countDays) => {
    const firstDayString = firstDay.toISOString().slice(0, 10);
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + countDays);
    const lastDayString = lastDay.toISOString().slice(0, 10);
    return this.tasks.filter(
      (task) =>
        task.planStartDate >= firstDayString &&
        task.planStartDate <= lastDayString
    );
  };
}
