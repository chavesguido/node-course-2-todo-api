const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Testeando';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(todos[1]._id.toHexString()).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo',(done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text:'Actualizado para test',
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Actualizado para test');
        expect(res.body.todo.completed).toBe(true);
        expect(typeof(res.body.todo.completedAt)).toEqual('number');
      })
      .end(done)
  });

  it('Should not update the todo created by other user',(done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text:'Actualizado para test',
        completed: true
      })
      .expect(404)
      .end(done)
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text:'Actualizado para testear el 2do',
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Actualizado para testear el 2do');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done)
  });
});

describe('GET /users/me', () => {
  it('Should return a user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
      var email = 'example@example.com';
      var password = '123mbn!';

      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if(err){
            return done(err);
          }
          User.findOne({email}).then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          }).catch((e) => done(e));;
        });
  });

  it('Should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email:'asd',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('Should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123abc!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  // it('Should login user and return auth token', (done) => {
  //     request(app)
  //     .post('/users/login')
  //     .send({
  //       email:users[1].email,
  //       password: users[1].password
  //     })
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.headers['x-auth']).toBeTruthy();
  //     })
  //     .end((err, res) => {
  //       if(err){
  //         return done(err);
  //       }
  //
  //       User.findById(users[1]._id).then((user) => {
  //         expect(user.tokens[1]).toInclude({
  //           access: 'auth',
  //           token: res.headers['x-auth']
  //         });
  //         done();
  //       }).catch((e) => done(e));
  //     });
  // });

  it('Should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password: users[1].password + '1'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).not.toBeTruthy();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
})
