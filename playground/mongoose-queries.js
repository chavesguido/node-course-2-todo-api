const {ObjectID} = require ('mongodb');
const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');

var id = '5a54ff4bba74fb2584a0021511';

if(!ObjectID.isValid()){
    console.log('ID not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo by id', todo);
}).catch((e) => console.log(e));
