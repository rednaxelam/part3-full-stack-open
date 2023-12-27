const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://michaelalexander0008:${password}@cluster0.sjsgq91.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({ name: process.argv[3], number: process.argv[4] })
  person.save().then(savedDocument => {
    console.log(`Added ${savedDocument.name} with number ${savedDocument.number} to the phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Unexpected number of arguments')
  mongoose.connection.close()
}

