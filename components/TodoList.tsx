import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditModal from './Edit';
import AddSubtaskModal from './AddSubtask';
import '../Css/table.css';
import '../Css/checkbox.css';
import '../Css/actions.css';

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
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
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
        }
    };

    const toggleTask = async (id: number) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );

        setTasks(updatedTasks);
        try {
            const response = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTasks.find(task => task.id === id)),
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

    const toggleSubTask = async (taskId: number, subtaskId: number) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const updatedSubtasks = task.subtasks.map(subtask =>
                    subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                );
                return { ...task, subtasks: updatedSubtasks };
            }
            return task;
        });

        setTasks(updatedTasks);

        try {
            const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTasks.find(task => task.id === taskId)),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update the task: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Toggle Subtask Error:', error);
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

    const addSubtask = async (taskId: number, subtaskTask: string) => {
        const newSubtask = { id: Date.now(), task: subtaskTask, completed: false };
        const updatedTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
                : task
        );

        setTasks(updatedTasks);

        const taskToUpdate = updatedTasks.find(task => task.id === taskId);
        try {
            const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToUpdate),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update the subtask: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Add Subtask Error:', error);
            setTasks(tasks);
        }
    };

    const editSubtask = async (taskId: number, subtaskId: number, subtaskTask: string) => {
        const task = tasks.find(task => task.id === taskId);

        if (!task) {
            console.error(`Task with id ${taskId} not found.`);
            return;
        }

        const updatedSubtasks = task.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, task: subtaskTask } : subtask
        );

        const updatedTask: Task = {
            ...task,
            subtasks: updatedSubtasks,
        };

        const updatedTasks: Task[] = tasks.map(t =>
            t.id === taskId ? updatedTask : t
        );

        setTasks(updatedTasks);

        try {
            const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update the subtask: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Edit Subtask Error:', error);
            setTasks(tasks);
        }
    };

    const deleteSubtask = async (taskId: number, subtaskId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            const updatedTasks = tasks.map(task =>
                task.id === taskId
                    ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
                    : task
            );

            setTasks(updatedTasks);

            const taskToUpdate = updatedTasks.find(task => task.id === taskId);
            try {
                const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskToUpdate),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Failed to update the subtask: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Delete Subtask Error:', error);
                setTasks(tasks);
            }
        }
    };

    const TodoItem: React.FC<{ task: Task }> = ({ task }) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
        const [isAddSubtaskModalOpen, setIsAddSubtaskModalOpen] = useState<boolean>(false);

        const handleEditTask = async (taskId: number, newTask: string) => {
            await editTask(taskId, newTask);
            setIsEditModalOpen(false);
        };

        const handleAddSubtask = async (subtask: string) => {
            await addSubtask(task.id, subtask);
            setIsAddSubtaskModalOpen(false);
        };

        return (
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

                    {task.subtasks.length > 0 && (
                        <div style={{ paddingLeft: '20px', marginTop: '5px', color: '#600' }}>
                            {task.subtasks.map(subtask => (
                                <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <input
                                            className="custom-checkbox"
                                            type="checkbox"
                                            checked={subtask.completed}
                                            onChange={() => toggleSubTask(task.id, subtask.id)}
                                            id={`subtask-${subtask.id}`}
                                        />
                                        <label htmlFor={`subtask-${subtask.id}`} className="checkbox-label"></label>
                                        <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none', marginLeft: '8px' }}>
                                            {subtask.task}
                                        </span>
                                    </div>
                                    <div className='actions' >
                                        <button onClick={() => editSubtask(task.id, subtask.id, subtask.task)} className='action'>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => deleteSubtask(task.id, subtask.id)} className='action'>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </td>
                <td className='actions'>
                    <button onClick={() => setIsEditModalOpen(true)} className='action'>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className='action'>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button onClick={() => setIsAddSubtaskModalOpen(true)} className='action'>
                        <FontAwesomeIcon icon={faAdd} />
                    </button>
                    {isEditModalOpen && (
                        <EditModal
                            task={task.task}
                            taskId={task.id}
                            onClose={() => setIsEditModalOpen(false)}
                            onSave={handleEditTask}
                        />
                    )}
                    {isAddSubtaskModalOpen && (
                        <AddSubtaskModal
                            onClose={() => setIsAddSubtaskModalOpen(false)}
                            onSave={handleAddSubtask}
                        />
                    )}
                </td>
            </tr>
        );
    };

    return (
        <div>
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
        </div>
    );
};

export default TodoList;