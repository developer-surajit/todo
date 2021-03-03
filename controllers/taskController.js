const Task = require('./../models/taskModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Task.find({ user: req.user._id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  // Task.findOne({ _id: req.params.id })

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

exports.addTask = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const newTour = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      task: newTour
    }
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getDashboardData = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    {
      $match: {
        user: req.user._id
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $group: {
        _id: null,
        totalTasks: {
          $sum: 1
        },
        latestTasks: {
          $push: '$$ROOT'
        }
      }
    },
    {
      $addFields: {
        tasksCompleted: {
          $size: {
            $filter: {
              input: '$latestTasks',
              as: 'item',
              cond: {
                $eq: ['$$item.completed', true]
              }
            }
          }
        }
      }
    },
    {
      $project: {
        totalTasks: 1,
        latestTasks: {
          $slice: ['$latestTasks', 3]
        },
        tasksCompleted: 1,
        _id: 0
      }
    }
  ]);
  console.log({ stats });
  res.status(200).json({
    status: 'success',
    data: stats[0]
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Task.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tasks: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
