'use client';

import React, { useEffect, useState } from 'react';
import TodoList from './TodoList';
import AddTaskModal from './AddTask';

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

const MyApp: React.FC = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:3001/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (newTaskText: string) => {
    const newTask: Task = {
      id: Date.now(),
      task: newTaskText,
      completed: false,
      subtasks: [],
    };

    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add the task: ${errorMessage}`);
      }

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTask('');
      setIsAddTaskModalOpen(false);
    } catch (error) {
      console.error('Add Task Error:', error);
    }
  };

  return (
    <>
      <div>
        <div style={{
          position: 'fixed',
          top: 0,
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className='action'

            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B46B89'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            Add Task
          </button>
          {isAddTaskModalOpen && (
            <AddTaskModal
              onClose={() => setIsAddTaskModalOpen(false)}
              onSave={addTask}
              newTask={newTask}
              setNewTask={setNewTask}
            />
          )}
        </div>
        <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '3rem', margin: 0, textAlign: 'center' }}>
          ..JUST DO IT..
        </h1>

        <div style={{ marginTop: '10px', padding: '10px' }}>
          <TodoList tasks={tasks} setTasks={setTasks} />
          <div style={{ height: '50px' }}></div>
        </div>
      </div >
    </>
  );
};

export default MyApp;