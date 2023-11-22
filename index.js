const express = require('express');
const app = express();

app.use(express.json());

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
];

let generateID = () => {
  return Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
}

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}<p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
    return;
  } else {
    response.status(404).end();
    return;
  }
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})