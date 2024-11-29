import React from 'react';

interface EditModalProps {
    task: string;
    taskId: number;
    isSubtask?: boolean;
    onClose: () => void;
    onSave: (taskId: number, newText: string) => void;
}


const EditModal: React.FC<EditModalProps> = ({ task, taskId, isSubtask, onClose, onSave }) => {
    const [newTask, setNewTask] = React.useState<string>(task);

    const handleSave = () => {
        if (newTask.trim() !== '') {
            onSave(taskId, newTask);
            onClose();
        } else {
            alert("Can't be empty");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">{isSubtask ? 'Add Subtask' : 'Edit Task'}</h2>
            <textarea
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    rows={3}
                    className="border rounded w-full"
                />
                <div className="flex justify-end mt-4">
                    <button className="mr-2 bg-blue-600 text-white py-1 px-3 rounded" onClick={handleSave}>
                        save
                    </button>
                    <button className="py-1 px-3 border rounded" onClick={onClose}>
                        cancle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
