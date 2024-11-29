import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditModal from './Edit';
import '../Css/table.css';
import '../Css/checkbox.css';

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

interface TodoListProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks }) => {
    const deleteTask = async (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        try {
            const response = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete the task: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Delete Task Error:', error);
            alert(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    const toggleTask = async (id: number) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );

        setTasks(updatedTasks);
        try {
            const taskToUpdate = updatedTasks.find(task => task.id === id);

            const response = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToUpdate),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update the task: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Toggle Task Error:', error);
            setTasks(tasks);
        }
    };

    const editTask = async (id: number, newTask: string) => {
        const foundTask = tasks.find(task => task.id === id);
        if (!foundTask) {
            console.error(`Task with id ${id} not found.`);
            return; 
        }

        const updatedTask: Task = {
            ...foundTask,
            task: newTask
        };

        const updatedTasks: Task[] = tasks.map(task =>
            task.id === id ? updatedTask : task
        );

        setTasks(updatedTasks);

        try {
            const response = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask), 
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update the task: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Edit Task Error:', error);
            setTasks(tasks);
        }
    };

    const addSubtask = (taskId: number, subtaskTask: string) => {
        const newSubtask = { id: Date.now(), task: subtaskTask, completed: false };
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, subtasks: [...(task.subtasks||[]), newSubtask] }
                : task
        ));
    };

    const toggleSubtask = (taskId: number, subtaskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? {
                    ...task,
                    subtasks: task.subtasks.map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                    )
                } : task
        ));
    };

    const deleteSubtask = (taskId: number, subtaskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
                : task
        ));
    };

    const TodoItem: React.FC<{ task: Task }> = ({ task }) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
        const [isAddSubtaskOpen, setIsAddSubtaskOpen] = useState<boolean>(false);
        const [newSubtask, setNewSubtask] = useState('');

        const handleEditTask = async (taskId: number, newTask: string) => {
            await editTask(taskId, newTask);
            setIsEditModalOpen(false);
        };

        const handleAddSubtask = () => {
            if (newSubtask) {
                addSubtask(task.id, newSubtask);
                setNewSubtask('');
                setIsAddSubtaskOpen(false);
            }
        };

        return (
            <>
                <tr className='tr'>
                    <td>
                        <div style={{ flexGrow: 1, textDecoration: task.completed ? 'line-through' : 'none' }} className='flex-1 text-left h-10 py-5 px-5'>
                            <input
                                className="custom-checkbox"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                id={`task-${task.id}`}
                            />
                            <label htmlFor={`task-${task.id}`} className="checkbox-label"></label>
                            {task.task}
                        </div>
                    </td>
                    <td>
                        <button onClick={() => setIsEditModalOpen(true)} className='action'>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className='action'>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button onClick={() => setIsAddSubtaskOpen(true)} className='action'>
                            <FontAwesomeIcon icon={faAdd}/>
                        </button>
                        {isEditModalOpen && (
                            <EditModal
                                task={task.task}
                                taskId={task.id}
                                onClose={() => setIsEditModalOpen(false)}
                                onSave={handleEditTask}
                            />
                        )}
                    </td>
                </tr>
                {(task.subtasks || []).map((subtask) => (
                    <tr key={subtask.id}>
                        <td style={{ paddingLeft: '20px', color: 'gray' }}>
                            <input
                                className="custom-checkbox"
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(task.id, subtask.id)}
                            />
                            <label htmlFor={`subtask-${subtask.id}`} className="checkbox-label"></label>
                            {subtask.task}
                            <button onClick={() => deleteSubtask(task.id, subtask.id)}><FontAwesomeIcon icon={faTrash}/></button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={2} style={{ paddingLeft: '20px' }}>
                        <input
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="New Subtask"
                        />
                        <button onClick={handleAddSubtask}>Add Subtask</button>
                    </td>
                </tr>
            </>
        );
    };

    return (
        <table className='table'>
            <thead>
                <tr className='tr:hover'>
                    <th>Task</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <TodoItem key={task.id} task={task} />
                ))}
            </tbody>
        </table>
    );
};

export default TodoList;
