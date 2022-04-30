export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.render();
    this.view.bindDropTask(this.bindDropTask);
    this.view.bindChangeDate(this.bindChangeDate);
  }
  render = () => {
    this.model.getTasksAndUsers(
      this.view.firstDay,
      this.view.countTd,
      (data) => {
        this.view.displayApp(data);
      },
      (err) => {
        this.view.displayError(err);
      }
    );
  };

  bindDropTask = (taskId, authorId, date) => {
    this.view.displayDropTask(this.model.DropTask(taskId, authorId, date));
  };

  bindChangeDate = (firstDay, countTd) => {
    this.model.getTasks(firstDay, countTd, (tasks, users) => {
      this.view.displayTable(tasks, users);
    });
  };
}
