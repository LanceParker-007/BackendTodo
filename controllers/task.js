import Task from "../models/task.js";
import ErrorHandler from "../middlewares/error.js";
import admin from "../databaseConnection/firebaseConfig.js";
const db = admin.firestore();
const taskCollectionRef = db.collection("Tasks");

export const newTask = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.json({
      success: false,
      message: "The fields are empty.",
    });
  }

  try {
    const newTask = new Task(title, description, false);
    await taskCollectionRef.add({ userId: req.user.id, ...newTask });
    // await taskCollectionRef.add({ user: req.user.data(), ...newTask });

    return res.status(201).json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Some error occured while adding the task!",
      Error: error,
    });
  }
};

export const getMyTasks = async (req, res, next) => {
  const user = req.user;
  const allTasks = await taskCollectionRef.where("userId", "==", user.id).get();
  if (allTasks.empty) {
    console.log("Empty");
  }

  const tasks = allTasks.docs.map((task) => {
    return task.data();
  });

  return res.status(200).json({
    success: true,
    allTasks: tasks,
  });
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskCollectionRef.doc(id).get();
    if (!task.exists) return next(new ErrorHandler("Task not found", 404));

    await taskCollectionRef.doc(id).update({
      isCompleted: !task.data().isCompleted,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, error: error });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await taskCollectionRef.doc(id).delete();

    if (!task.exists) return next(new ErrorHandler("Task not found", 404));

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({ success: false, error: error });
  }
};
