const express = require('express');
const app = express();
const db = require('./db');
const { models: { Task } } = db;


app.get('/api/tasks', async(req, res, next)=> {
  try {
    res.send(await Task.findAll({
      include: [
        { model: Task, as: 'parent' },
        { model: Task, as: 'childTasks' }
      ]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/tasks/:id/childTasks', async(req, res, next)=> {
  try {
    const parentTask = await Task.findByPk(req.params.id);
    res.send(await parentTask.findChildTasks());
  }
  catch(ex){
    next(ex);
  }
});

const setUp = async()=> {
  try {
    await db.syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

setUp();

