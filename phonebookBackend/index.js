const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
var morgan = require('morgan')

morgan.token('body', function getBody (req){
   return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(bodyParser.json())

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  

let persons = [

    { 
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1 
    },
    { 
        name: 'Ada Lovelace', 
        number: '39-44-5323523',
        id: 2 
    },
    { 
        name: 'Dan Abramov', 
        number: '12-43-234345',
        id: 3 
    },
    { 
        name: 'Mary Poppendieck', 
        number: '39-23-6423122',
        id: 4 
    }

]

app.get('/', (req, resp) => {
    resp.send('<h1>Hello World!</h1>')
  })
  

app.get('/api/persons', (req, resp) => {
    resp.json(persons)
})

app.get('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        resp.json(person)
    }
    else{
        resp.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    resp.status(204).end()
})

app.get('/info', (req, resp) => {
    let time = new Date
    let infoString = `Phonebook has info for ${persons.length} people <br> ${time}`
    resp.send(infoString)
})

app.post('/api/persons', (req, resp) => {
    const body = req.body
    if(!body.name || !body.number){
        return resp.status(404).json({
            error: 'name or number is missing'
        })
    }
    const duplicate = persons.filter(person => person.name === body.name)
    console.log(duplicate)
    if(duplicate.length !== 0){
        return resp.status(404).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(100000)
    }

    persons = persons.concat(person)
    return resp.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})