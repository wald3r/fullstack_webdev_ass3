import React from 'react'


const Person = ({person, handlePersonsRemoval}) => {

    //console.log('person is ', person)
    return (
        <li>
            {person.name}  
            {person.number}
            <button onClick={handlePersonsRemoval}>delete</button> 
        </li>

    )
}



export default Person