const Task = require('../models/task');
const Joi = require('joi');


const getTasksQuerySchema = Joi.object({
    completed: Joi.string().valid('true', 'false'),
    completed: Joi.string().required(),


    // search: Joi.string().min(1).optional(), 
    // page: Joi.number().integer().min(1).default(1), 
    // limit: Joi.number().integer().min(1).default(10), 
});

// Données initiales
let tasks = [
    new Task(1, 'Apprendre Node.js', false),
    new Task(2, 'Pratiquer Express', true)
];

// Obtenir toutes les tâches
exports.getTasks = (req, res) => {

    const { error } = getTasksQuerySchema.validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message }); 
    }

    const { completed, search, page = 1, limit = 10 } = req.query;

    let filteredTasks = tasks;

    // Filtrer par statut (completed)
    if (completed) {
        filteredTasks = filteredTasks.filter(task => String(task.completed) === completed);
    }

    // Recherche par titre
    if (search) {
        filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    res.json(paginatedTasks);
};

// Ajouter une tâche
exports.createTask = (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Le titre est requis.' });
    }

    const newTask = new Task(tasks.length + 1, title.trim(), false);
    tasks.push(newTask);
    res.status(201).json(newTask);
};

// Mettre à jour une tâche
exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée.' });

    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    res.json(task);
};

// Supprimer une tâche
exports.deleteTask = (req, res) => {
    const { id } = req.params;

    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Tâche non trouvée.' });

    const deletedTask = tasks.splice(index, 1);
    res.json(deletedTask);
};