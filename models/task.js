const Task = (title, description, isCompleted) => {
  return {
    title: title,
    description: description,
    isCompleted: isCompleted,
    user: "User_ID",
    createdAt: Date.now(),
  };
};
