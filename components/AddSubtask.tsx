'use client'
import React, { useState } from 'react';

interface AddSubtaskModalprops {
    onClose: () => void;
    onSave: (subtask: string) => void;
}

const AddSubtaskModal: React.FC<AddSubtaskModalprops> = ({ onClose, onSave }) => {
    const [subtask, setSubtask] = useState('');
    const handleSave = () => {
        if (subtask.trim() !== '') {
            onSave(subtask);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <div style={{backgroundColor:'rgba(224, 167, 44, 0.2)'}}>
                    <h2 className="text-lg font-bold mb-2" style={{ textAlign: 'center' }}>Add Task</h2>
                    <div style={{ textAlign: 'center' }}>
                        <input
                            style={{ alignItems: 'center' }}
                            type='text'
                            value={subtask}
                            onChange={(e) => setSubtask(e.target.value)}
                            placeholder='Enter Subtask'
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="flex justify-end mt-4">
                            <button className="mr-2 bg-blue-600 text-white py-1 px-3 rounded" onClick={handleSave}>
                                save
                            </button>
                            <button className="py-1 px-3 border rounded" onClick={onClose}>
                                cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSubtaskModal;