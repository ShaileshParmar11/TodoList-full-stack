const express = require("express");
const fs = require("fs");
const { isEmpty } = require("lodash");

const port = 8000;

const app = express();
const route = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// list todo
app.get(`${route}/todo`, (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({
        status: 500,
        message: err,
      });
    }
    res.status(200).send(data);
  });
});
// todo with id
app.get(`${route}/todo/:id`, (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({
        status: 500,
        message: err,
      });
    }

    const apiData =
      JSON.parse(data).filter((d) => d.id === req.params.id) || [];

    if (apiData.length) {
      res.status(200).send(apiData[0]);
    }

    res.status(404).send({
      status: 404,
      message: `Data with id ${req.params.id} not found`,
    });
  });
});

// add todo
app.post(`${route}/todo`, (req, res) => {
  const bodyData = req.body;
  console.log(bodyData);
  if (bodyData?.todo) {
    fs.readFile("./db.json", "utf-8", (err, data) => {
      if (err) {
        res.status(500).send({
          status: 500,
          message: err,
        });
      }

      try {
        let todoList = [];
        if (!isEmpty(data)) {
          todoList = JSON.parse(data);
        }

        const newTodo = {
          todo: bodyData.todo,
          id: Date.now(),
        };

        todoList.push(newTodo);

        const jsonStringify = JSON.stringify(todoList);

        fs.writeFile("./db.json", jsonStringify, (err) => {
          if (err) {
            res.status(500).send({
              status: 500,
              message: err,
            });
          }
          res.status(201).send(todoList);
        });
      } catch (error) {
        res.status(500).send({
          status: 500,
          message: error || "Unexpected error!",
        });
      }
    });
  } else {
    res.status(400).send({
      status: 400,
      message: `todo is required fiels to create todo list`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
