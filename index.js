const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
morgan.token('test', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :test'))
app.use(cors())

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
  const string = `<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`
  res.send(string)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)    
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'Name is missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'Number is missing' })
  }

  if (nameExists(body.name)) {
    return res.status(400).json({ error: 'Name must be unique.' })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: getRandomId(10, 100000000)
  }

  persons = persons.concat(person)

  res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})