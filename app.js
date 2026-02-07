const express = require('express');
const data = require('./task.json');

const app = express();
app.use(express.json());


/* ---------- PROMISE DELETE ---------- */
const del = (id) => {
    return new Promise((resolve, reject) => {

        const index = data.tasks.findIndex(t => t.id === id);
        if (index === -1) return reject();

        data.tasks.splice(index, 1);
        resolve();
    });
};


/* ---------- PROMISE UPDATE ---------- */
const update = (id, payload) => {
    return new Promise((resolve, reject) => {

        const index = data.tasks.findIndex(t => t.id === id);
        if (index === -1) return reject();

        data.tasks[index] = { id, ...payload };
        resolve();
    });
};


/* ---------- GET ALL ---------- */
app.get('/tasks', (req, res) => {
    console.log("end point hit",req.path);
    res.status(200).json(data.tasks);
});


/* ---------- GET BY ID ---------- */
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(404).send("Not Found");

    const task = data.tasks.find(t => t.id === id);
    if (!task) return res.status(404).send("Not Found");

    res.status(200).json(task);
});


/* ---------- CREATE ---------- */
app.post('/tasks', (req, res) => {
    console.log("end point hit",req.path);

    const payload = req.body;

    if (
        typeof payload.title !== "string" ||
        typeof payload.description !== "string" ||
        typeof payload.completed !== "boolean"
    ) {
        return res.status(400).send("Invalid data");
    }

    const newTask = {
        id: data.tasks.length
            ? data.tasks[data.tasks.length - 1].id + 1
            : 1,
        ...payload
    };

    data.tasks.push(newTask);

    res.status(201).json(newTask);
});


/* ---------- UPDATE ---------- */
app.put('/tasks/:id', async (req, res) => {

    const id = Number(req.params.id);
    const payload = req.body;

    if (
        typeof payload.title !== "string" ||
        typeof payload.description !== "string" ||
        typeof payload.completed !== "boolean"
    ) {
        return res.status(400).send("Invalid data");
    }

    try {
        await update(id, payload);
        res.status(200).send("Updated");
    } catch {
        res.status(404).send("Not Found");
    }
});


/* ---------- DELETE ---------- */
app.delete('/tasks/:id', async (req, res) => {

    const id = Number(req.params.id);

    try {
        await del(id);
        res.status(200).send("Deleted");
    } catch {
        res.status(404).send("Not Found");
    }
});

module.exports = app;
