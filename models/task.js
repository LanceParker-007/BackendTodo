class Task {
  constructor(title, description, isCompleted) {
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.createdAt = new Date().toLocaleString();
  }
}

export default Task;
