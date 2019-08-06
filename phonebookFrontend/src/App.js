import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Form from './components/Form'
import Filter from './components/Filter'
import personsService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'

const findPerson = (persons, name) => {
  
  for(let i = 0; i < persons.length; i++){
    if (persons[i].name === name){
      return persons[i].id
    }
  }
  return -1
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ showAll, setShowAll] = useState(true)
  const [ notificationMessage, setNotificationMessage] = useState('')
  const [ errorMessage, setErrorMessage] = useState('')


  useEffect (() => {
    console.log('effect')
    personsService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
      })
  } , [])
  console.log('render', persons.length, 'persons')


  const contactsToShow = showAll ? persons : persons.filter(function(person) {
    return person.name.includes(newFilter) 
  })


  const handlePersonsRemoval = id => {
    var result = window.confirm("Do you really want to delete this person?")
    if(result){
        personsService
          .remove(id)
          .then(response => {
            setPersons(persons.filter(function(value){
              return value.id !== id
            }))
            setNotificationMessage(`Person deleted`)
            setTimeout(() => { setNotificationMessage('')}, 5000)
          })
          .catch(error => {
            setErrorMessage(`Couldn't delete this person`)
            setTimeout(() => { setErrorMessage('')}, 5000)
          })
    }

  }

  const rows = () => contactsToShow.map(person =>
        <Person 
          key={person.name}
          person={person}
          handlePersonsRemoval={() => handlePersonsRemoval(person.id)}
        />
    )

  const addContact = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const personsObject = {
      name: newName,
      number: newNumber
    }

    var personId = findPerson(persons, personsObject.name)

    if(personId === -1){
      personsService
        .create(personsObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNotificationMessage(`Added ${personsObject.name}`)
          setTimeout(() => { setNotificationMessage('')}, 5000)
        })
        .catch(error => {
          setErrorMessage(`Couldn't add ${personsObject.name}`)
          setTimeout(() => { setErrorMessage('')}, 5000)
        })
    }
    else{
      var result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(result){
        personsService
          .update(personId, personsObject)
          .then(response => {
            setPersons(persons.map(person =>  person.id !== personId ? person : response))
            setNotificationMessage(`Updated ${personsObject.name}'s number`)
            setTimeout(() => { setNotificationMessage('')}, 5000)
          })
          .catch(error => {
            setErrorMessage(`Couldn't update ${personsObject.name}'s number`)
            setTimeout(() => { setErrorMessage('')}, 5000)
          })
        }
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = () => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = () => {
    if(event.target.value === ''){
      setNewFilter('')
      setShowAll(true)
    }
    else{
      console.log(event.target.value)
      setNewFilter(event.target.value)
      setShowAll(false)
    }

  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Error message={errorMessage} />
      <Notification message={notificationMessage} />
      <Filter newFilter={newFilter}
              handleFilter={handleFilter}/>
      <h2>add new contact</h2>
      <Form addContact={addContact} 
            newName={newName} 
            handleNameChange={handleNameChange} 
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
        {rows()}
      </ul>
    </div>
  )
}

export default App
