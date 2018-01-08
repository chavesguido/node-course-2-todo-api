// const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const myDB = db.db('TodoApp');

    // myDB.collection('Todos').find().toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    // myDB.collection('Todos').find({completed:false}).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    // myDB.collection('Todos').find({
    //   _id: new ObjectID('5a53b6835bbb040bd8be7899')
    // }).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });

    myDB.collection('Todos').find().count().then((count) => {
      console.log(`Todos count: ${count}`);
    }, (err) => {
      console.log('Unable to fetch todos', err);
    });

    // db.close();
});
