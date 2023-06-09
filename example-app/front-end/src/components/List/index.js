import React from 'react'
import ListItem from '../ListItem'
import AddTodoForm from '../AddTodoForm';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {nanoid} from 'nanoid';

const API_URL = 'http://localhost:8000/todos';

const List = () => {
    const queryClient = useQueryClient();
    
    //query

    const { isLoading, isError, data, error } = useQuery('todos', fetchTodos, {
        onError: (error) => {
            console.error('Error fetching todos: ', error)
        }
    });

    //fetching

    async function fetchTodos() {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    }
    
    //mutation: add todo 
    
    const addTodoMutation = useMutation({
        mutationFn: async (newTodoTitle) => {
            const newTodo = {
                id: nanoid(),
                title: newTodoTitle,
                isCompleted: false
            }
            const response = await fetch(`${API_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/JSON" 
                },
                body: JSON.stringify(newTodo),
            });
            const data = await response.json();
            return data;
        },
        onError: (error) => {
            console.error('Error creating todo: ', error)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
        }
    })
    
    //mutation: edit todo
    
    const updateTodoMutation = useMutation({
        mutationFn: async (updatedTodo) => {
            const response = await fetch(`${API_URL}/${updatedTodo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/JSON" 
                },
                body: JSON.stringify(updatedTodo),
            });
            const data = await response.json();
            return data;
        },
        onError: (error) => {
            console.error(`Error updating todo`, error)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
        }
    })
    
    //mutation: delete todo 
    
    const deleteTodoMutation = useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/JSON" 
                },
            });
            const data = await response.json();
            return data;
        },
        onError: (error) => {
            console.error(`Error deleting todo`, error)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
        }
    })
    
    if (isLoading){
        return <h2>Loading...</h2>
    }

    if (isError){
        return <h2>Error: {error.message}</h2>
    }
    
    return (
        <main>
            <ul className='list'>
                {data.map((todo)=> <ListItem 
                    key={todo.id} 
                    todo={todo} 
                    updateTodo={updateTodoMutation.mutate} 
                    deleteTodo={deleteTodoMutation.mutate}
                />)}
            </ul>
            <AddTodoForm addTodo={addTodoMutation.mutate} />
        </main>
    )
}

export default List