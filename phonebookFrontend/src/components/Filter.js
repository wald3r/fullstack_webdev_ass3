import React from 'react'

const Filter = ({newFilter, handleFilter}) => {



    return (
        <div>
            <h2>filter contact</h2>
            filter shown with <input value={newFilter}
                                      onChange={handleFilter}/>

        </div>
    )
}



export default Filter