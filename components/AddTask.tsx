'use client'
import React, {useState} from 'react';

interface AddTaskprops{
    onClose : () => void;
    onSave : (task : string) => void;
}

const AddTaskModal : React.FC<AddTaskprops> = ({onSave, onClose}) => {
    const [task, setTask] = useState('');
    const handelTask = () => {
        if (task.trim() != ''){
            onSave(task);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">Add Task</h2>
                <input
                    type='text'
                    value={task}
                    onChange = {(e) => setTask(e.target.value)}
                    placeholder='Enter Task'
                />
                <div className="flex justify-end mt-4">
                    <button className="mr-2 bg-blue-600 text-white py-1 px-3 rounded" onClick={handelTask}>
                        save
                    </button>
                    <button className="py-1 px-3 border rounded" onClick={onClose}>
                        cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
export default AddTaskModal;