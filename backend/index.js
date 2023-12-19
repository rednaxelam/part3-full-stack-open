require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('json-data', (req, res) => JSON.stringify({'name':req.body.name, 'number':req.body.number}));
app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :json-data'));


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => response.json(persons)).catch(error => next(error));
})

app.get('/info', (request, response, next) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}<p>
  `)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => response.json(person)).catch(error => {console.log(error);next(error);});
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedDocument => {
      response.status(204).end();
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  }
  
  const newPersonDoc = new Person({
    name: newPerson.name,
    number: newPerson.number,
  })

  newPersonDoc.save().then(savedPerson => response.json(savedPerson)).catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = request.body;

  Person.replaceOne({_id: updatedPerson.id}, updatedPerson)
    .then(metaData => response.json(updatedPerson))
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && (new RegExp("\/api\/persons\/.*")).test(request.originalUrl)) {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})