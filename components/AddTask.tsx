import React from 'react';

interface AddTaskProps {
  onClose: () => void;
  onSave: (newTaskText: string) => Promise<void>;
  newTask: string;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
}

const AddTaskModal: React.FC<AddTaskProps> = ({ onClose, onSave, newTask, setNewTask }) => {
  const handleSave = () => {
    if (newTask.trim()) {
      onSave(newTask);
    }
  };

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Add Task</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '10px',
      }}>
        <input
          type="text"
          value={newTask}
          style={{textAlign:'center'}}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task...."
        />
      </div>
      <div style={{textAlign: 'center'}}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddTaskModal;