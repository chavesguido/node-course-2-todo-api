// const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const myDB = db.db('TodoApp');

    // myDB.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('5a53dc857c8218ff0b037f44')
    // }, {
    //    $set: {
    //      completed: true
    //    }
    // }, {
    //   returnOriginal: false
    // }).then((result) =>{
    //   console.log(result);
    // });

    myDB.collection('Users').findOneAndUpdate({
      _id: new ObjectID('5a53e69a309833148cff001c')
    }, {
       $set: {
         nombre: 'Jorge',
         localidad: 'Jorgelandia'
       },
       $inc:{
         edad: 1
       }
    }, {
      returnOriginal: false
    }).then((result) =>{
      console.log(result);
    });

    // db.close();
});
