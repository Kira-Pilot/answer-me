const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require ('morgan');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));


const questions = [];

// retrieves all questions
app.get('/', (req, res) => {
    const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers: q.answers.length

    }));

    res.send(qs);
});

// get a specific question
app.get('/:id', (req, res) => {
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    
    if (question.length > 1) return res.status(500).send();
    if (question.length === 0) return res.status(404).send();
    
    res.send(question[0]);
});

// insert a new question
app.post('/', (req, res) => {
    const {title, description} = req.body; // object destructuring

    if (!title || !description) return res.status(500).send();

    const newQuestion = {
        id: questions.length + 1,
        title,
        description,
        answers: []
    };

    debugger;
    questions.push(newQuestion);
    res.status(200).send();
});

// insert a new answer to a question
app.post('/answer/:id', (req, res) => {
    const {answer} = req.body;

    const question = questions.filter(q => (q.id === parseInt(req.params.id))); // implicit return (can we omit entirely?)
    
    if (question.length > 1) return res.status(500).send();
    if (question.length === 0) return res.status(404).send();
    
    question[0].answers.push(answer);
    return res.status(200).send();
});

// start the server
app.listen(8081, () => {
    console.log('listening on port 8081');
})