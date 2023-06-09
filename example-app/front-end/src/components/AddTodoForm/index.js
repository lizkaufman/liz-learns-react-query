import {useState} from 'react'

const AddTodoForm = ({ addTodo }) => {
    const [newTodo, setNewTodo] = useState('')

    function handleSubmit(e){
        e.preventDefault();
        addTodo(newTodo);
        setNewTodo('');
    }

    return (
        <form className='add-todo-form' onSubmit={handleSubmit}>
            <label>
                Add a todo:{' '} 
                <input value={newTodo} onChange={(e)=>{ 
                    setNewTodo(e.target.value); 
                }} className='add-todo-input' />
            </label>
            <input type='submit' className='add-todo-submit' />
        </form>
    )
}

export default AddTodoForm