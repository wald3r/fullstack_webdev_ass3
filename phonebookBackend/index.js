const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
var morgan = require('morgan')

require('dotenv').config()
const Person = require('./models/person')

morgan.token('body', function getBody (req){
   return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/', (req, resp) => {
    resp.send('<h1>Hello World!</h1>')
  })
  

app.get('/api/persons', (req, resp, next) => {
    Person.find({})
        .then(persons => {
            resp.json(persons.map(person => person.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, resp, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                return resp.json(person.toJSON())
            }else{
                return resp.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, resp, next) => {

    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            resp.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (req, resp, error) => {
    let time = new Date
    Person
        .count({})
        .then(result => {
            let infoString = `Phonebook has info for ${result} people <br> ${time}`
            resp.send(infoString)
        })
        .catch(error => next(error))
    
})

app.post('/api/persons', (req, resp) => {
    const body = req.body
    if(!body.name || !body.number){
        return resp.status(404).json({
            error: 'name or number is missing'
        })
    }

    const person = new Person( {
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        resp.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (req, resp, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person)
      .then(updatedPerson => {
        resp.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
  })

const errorHandler = (error, req, resp, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return resp.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})