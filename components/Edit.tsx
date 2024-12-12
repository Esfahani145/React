import React, {useEffect}from 'react';

interface EditModalProps {
    task: string;
    taskId: number;
    onClose: () => void;
    onSave: (taskId: number, newText: string) => void;
}


const EditModal: React.FC<EditModalProps> = ({ task, taskId, onClose, onSave }) => {
    const [newTask, setNewTask] = React.useState<string>(task);

    useEffect(() => {  
        setNewTask(task); 
    }, [task]);

    const handleSave = async () => {  
        await onSave(taskId, newTask); 
        onClose();
    }; 

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">Edit Task</h2>
            <input  
                type="text"  
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
            /> 
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
    );
};

export default EditModal;
