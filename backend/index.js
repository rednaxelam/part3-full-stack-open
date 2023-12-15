require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('json-data', (req, res) => JSON.stringify({'name':req.body.name, 'number':req.body.number}));
app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :json-data'));


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons))
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}<p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person));
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  
  response.status(204).end();
  return;
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body;

  if (!newPerson) {
    response.status(400).json({error: 'Content missing'});
    return;
  } else if (!newPerson.name || newPerson.name.length === 0) {
    response.status(400).json({error: 'Name missing'});
    return;
  } else if (!newPerson.number || newPerson.number.length === 0) {
    response.status(400).json({error: 'Number missing'});
    return;
  } else if (persons.findIndex(person => person.name.toLowerCase() === newPerson.name.toLowerCase()) !== -1) {
    response.status(400).json({error: 'Person already in phonebook'});
    return;
  }
  
  newPerson.id = generateID();
  persons = persons.concat(newPerson);

  response.json(newPerson);
  return;
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})