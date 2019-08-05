import React from 'react'



const Error = ({message}) => {

    const ErrorStyle = {
        color: 'red',
        fontStyle: 'italic',
        fontSize: 25,
        backgroundColor: 'gainsboro',
        border: '1px solid red',
        padding: '35px',
        fontWeight: 'bold'

    }

    if(message === ''){
        return null
    }
    else{
        return (
            <div style={ErrorStyle}>
               {message} 
            </div>
        )
    }
}




export default Error