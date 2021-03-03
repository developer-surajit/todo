const express = require('express');
const taskController = require('./../controllers/taskController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.get('/tasks', authController.tasks);
// router.post('/tasks', authController.tasks);

// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// router.put(
//   '/tasks/:id',
//   authController.protect,
//   authController.updateTask
// );

// router.patch('/updateMe', authController.protect, userController.updateMe);
// router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(authController.protect, taskController.getAllTasks)
  .post(authController.protect, taskController.addTask);

router
  .route('/:id')
  .put(authController.protect, taskController.updateTask)
  .delete(authController.protect, taskController.deleteTask);

router.get(
  '/dashboard',
  authController.protect,
  taskController.getDashboardData
);

module.exports = router;
