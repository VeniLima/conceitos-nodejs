const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
};

function checkTodoExists(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.uuid === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo does not exists" })
  }

  request.todo = todo;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists' });
  };

  const user = {
    name,
    username,
    id: uuidv4(),
    todos: []
  };


  users.push(user);


  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body;
  const { user } = request;

  const newTodoBody = {
    title,
    done: false,
    uuid: uuidv4(),
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(newTodoBody);

  return response.status(201).json(newTodoBody);
});

app.put('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body;

  const { todo } = request;



  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);


});

app.patch('/todos/:id/done', checksExistsUserAccount, checkTodoExists, (request, response) => {
  // Complete aqui
  const { todo } = request;

  todo.done = true;

  return response.status(201).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  // Complete aqui


  const { todo, user } = request;




  const index = user.todos.indexOf(todo);

  user.todos.splice(index, 1);

  return response.status(204).json(user.todos);
});

module.exports = app;