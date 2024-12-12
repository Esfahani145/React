'use client'

import React, { useEffect, useState } from 'react';
import TodoList from './TodoList';

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
  const [tasks, setTasks] = useState<Task[]>([]);

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

  return (
    <div>
      <h1 style={{
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '3rem'
      }}>
        ..JUST DO IT..
      </h1>
      <TodoList tasks={tasks} setTasks={setTasks} />
      <div style={{ height: '50px' }}></div>
    </div>
  );
};

export default MyApp;