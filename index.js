const express = require('express');
const path = require('path');
const fs = require('fs/promises');


const app = express();
const jsonPath = path.resolve('./files/tasks.json');

app.use(express.json());

app.get('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf-8');

    res.send(jsonFile);
});

app.post('/tasks', async (req, res) => {
    const task = req.body;
    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const lastIndex = taskArray.length - 1;
    const newId = taskArray[lastIndex].id + 1;
    taskArray.push({ ...task, id: newId });
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.end();

});

app.put('/tasks', async (req, res) => {
    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const { status, id} = req.body;
    const taskIndex = taskArray.findIndex(task => task.id === id);

    if (taskIndex >= 0){
        taskArray[taskIndex].status = status;
    }

    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.send('Tarea Actualizada');
});

app.delete('/tasks', async (req,res) => {
    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const {id} = req.body;
    const taskIndex = taskArray.findIndex(task => task.id === id);
    taskArray.splice(taskIndex, 1);
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.end();

});


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor Escuchando en el puerto ${PORT}`);
});
