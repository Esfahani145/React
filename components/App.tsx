'use client';

import React, { useEffect, useState } from 'react';
import TodoList from './TodoList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
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
      <div  style={{marginTop:"auto"}}>
        <div style={{
          position: 'fixed',
          top: 0,
          right: '20px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>
          {!isAddTaskModalOpen && (
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className='action'
              style={{ borderRadius: '15px', height: '25px', width: '30px' }}
              onMouseOver={(e) => {
                e.currentTarget.style.fontWeight = 'bold';
                e.currentTarget.style.height = '35px';
                e.currentTarget.style.width = '40px';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.fontWeight = 'normal';
                e.currentTarget.style.height = '25px';
                e.currentTarget.style.width = '30px';
              }}
            >
              <FontAwesomeIcon style={{ fontSize: '20px', textAlign: 'center', color: 'white' }}
                icon={faAdd} />
            </button>
          )}
          <div style={{
            display: isAddTaskModalOpen ? 'block' : 'none',
            backgroundColor: 'rgba(224, 167, 44, 0.7)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            borderRadius: '20px',
            height: '100px',
            padding: '15px'
          }}>
            {isAddTaskModalOpen && (
              <AddTaskModal
                onClose={() => setIsAddTaskModalOpen(false)}
                onSave={addTask}
                newTask={newTask}
                setNewTask={setNewTask}
              />
            )}
          </div>
        </div>
        <h1 style={{
          fontWeight: 'bold',
          fontSize: '5rem',
          margin: 0,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #00ffff, #ff00c3)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ..JUST DO IT..
        </h1>

        <div style={{ marginTop: '10px', padding: '10px' }}>
          <TodoList tasks={tasks} setTasks={setTasks} />
          
        </div>
      </div >
    </>
  );
};

export default MyApp;
