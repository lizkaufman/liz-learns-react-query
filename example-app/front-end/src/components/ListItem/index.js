import React from 'react'

const ListItem = ({todo, updateTodo, deleteTodo}) => {
    const {id, title, isCompleted} = todo;
    
    return (
        <li className='list-item'>
            <label> 
                <input type='checkbox' checked={isCompleted} onChange={()=>{
                    const updatedTodo = {...todo, isCompleted: !todo.isCompleted};
                    console.log(updatedTodo)
                    updateTodo(updatedTodo);
                }}/>
                {title} {' '}
            </label>
            <button className='delete-todo-button' onClick={()=>{deleteTodo(id)}}>X</button>
        </li>
    )
}

export default ListItem