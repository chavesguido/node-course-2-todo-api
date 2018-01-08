// const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const myDB = db.db('TodoApp');

    //deleteMany
     // myDB.collection('Users').deleteMany({nombre: 'Guido Chaves'}).then((result) => {
     //   console.log(result);
     // });

    //deleteOne
    // myDB.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });

    //findOneAndDelete
    // myDB.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
    //   console.log(JSON.stringify(result, undefined, 2));
    // });

    // db.close();
});
