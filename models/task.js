const mongoose = require('mongoose');
const Schema=mongoose.Schema;


const taskSchema = new Schema({
  author:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true,'Owner is required']
  },
  task: {
    type: String,
    required: [true,'task is required'],
  }
});


const Task = mongoose.model('Task', taskSchema);

module.exports=Task;
