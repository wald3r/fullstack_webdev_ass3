import React from 'react'



const Notification = ({message}) => {

    const notificationStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 25,
        backgroundColor: 'gainsboro',
        border: '1px solid green',
        padding: '35px',
        fontWeight: 'bold'
    }

    if(message === ''){
        return null
    }
    else{
        return (
            <div style={notificationStyle}>
               {message} 
            </div>
        )
    }
}




export default Notification