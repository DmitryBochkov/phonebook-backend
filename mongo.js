const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-dnmkn.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(response => {
    console.log('phonebook')
    response.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3 && process.argv.length < 6) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(person => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length >= 6) {
  console.log('You can pass three command-line arguments only (the first is the password)')
  console.log('E. g.: node mongo.js yourpassword Anna 040-1234556')
  process.exit(1)
}