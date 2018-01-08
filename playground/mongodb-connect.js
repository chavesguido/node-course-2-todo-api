// const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const myDB = db.db('TodoApp');

    // myDB.collection('Todos').insertOne({
    //   text:'Something todo',
    //   completed: false
    // }, (err, result) => {
    //   if(err){
    //     return console.log('Unable no insert todo', err);
    //   }
    //
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    for(var i=0; i<=99;i++){
      myDB.collection('Users').insertOne({
        nombre:'Guido Chaves',
        edad: 23,
        localidad: 'Bernal'
      }, (err, result) => {
        if(err){
          return console.log('Unable no insert todo', err);
        }

        // console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
      });
    }


    db.close();
});
