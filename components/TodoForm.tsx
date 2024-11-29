import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

interface Subtask {
    id: number;
    task: string;
    completed: boolean;
}

interface Task {
    id: number;
    task: string;
    completed: boolean;
    subtasks: Subtask[];
}

interface TodoFormProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoForm: React.FC<TodoFormProps> = ({ setTasks }) => {
    const [task, setTask] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (task.trim() === '') {
                throw new Error('Please add a task');
            }

            const newTask: Task = {
                id: Date.now(),
                task,
                completed: false,
                subtasks: []
            };

            const response = await fetch('http://localhost:3001/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error('Failed to add the task');
            }

            const savedTask = await response.json();
            setTasks(prevTasks => [...prevTasks, savedTask]);

            setTask('');
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                alert(error.message);
            } else {
                console.error('Unexpected error', error);
                alert('Unknown error');
            }
        }
    };

    return (
        <div className='flex items-center mb-4'>
            <form onSubmit={handleSubmit} className='flex flex-grow'>
                <input className="flex-1 border border-blue-600 rounded-lg text-center h-10 py-5"
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Please add a new task.."
                />
                <button className="ml-2 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
                    type="submit"><FontAwesomeIcon icon={faAdd} /></button>
            </form>
        </div>
    );
};

export default TodoForm;