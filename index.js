require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(bodyParser.json())
morgan.token('test', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :test'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Artur Hellas",
    number: "050-123456",
    id: 5
  }
]

const getRandomId = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

const nameExists = name => {
  return persons.some(p => p.name === name)
}

app.get('/info', (req, res) => {
  Person.find({})
    .then(result => {
      const string = `<p>Phonebook has info for ${result.length} people.</p><p>${new Date()}</p>`
      res.send(string)
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      console.log(person);
      if (person) {
        res.json(person.toJSON())    
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()      
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'Name is missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'Number is missing' })
  }

  // if (nameExists(body.name)) {
  //   return res.status(400).json({ error: 'Name must be unique.' })
  // }
  
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'Name is missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'Number is missing' })
  }

  // if (nameExists(body.name)) {
  //   return res.status(400).json({ error: 'Name must be unique.' })
  // }
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(err)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})