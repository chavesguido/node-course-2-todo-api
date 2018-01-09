var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp' || process.env.MONGODB_URI, {
  useMongoClient: true
});

module.exports = { mongoose };
