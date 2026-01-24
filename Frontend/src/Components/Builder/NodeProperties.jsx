import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';

const NodeProperties = ({ selectedNode, onUpdate, onDelete, onClose }) => {
    const [formData, setFormData] = useState({
        label: '',
        type: 'room',
        imgUrl: ''
    });

    useEffect(() => {
        if (selectedNode) {
            setFormData({
                label: selectedNode.label || '',
                type: selectedNode.type || 'room',
                imgUrl: selectedNode.imgUrl || ''
            });
        }
    }, [selectedNode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(selectedNode.id, formData);
    };

    if (!selectedNode) return null;

    return (
        <div className="absolute top-4 right-4 z-20 w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-4">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h3 className="font-bold text-white">Edit Node</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">ID</label>
                    <input
                        value={selectedNode.id}
                        disabled
                        className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-gray-500 font-mono"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Label</label>
                    <input
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none text-white"
                        placeholder="e.g. Main Entrance"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none text-white appearance-none"
                    >
                        <option value="room" className="text-black">Room</option>
                        <option value="corridor" className="text-black">Corridor (Waypoint)</option>
                        <option value="elevator" className="text-black">Elevator</option>
                        <option value="stairs" className="text-black">Stairs</option>
                        <option value="poi" className="text-black">Point of Interest</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Image (Upload or URL)</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('mapImage', file);
                                        try {
                                            // Ideally use a configured axios instance, but direct call is fine for now
                                            // We need to import axios if not present. I'll handle that separately or assume global? 
                                            // No, must import. 
                                            // Since I can only replace one block, I will inject the logic here and hope axios is available or I'll add the import in a subsequent step.
                                            // Wait, I can't "hope". 
                                            // I will write the upload logic assuming axios is imported.
                                            // "const axios = (await import('axios')).default;" dynamic import inside handler works!
                                            const axios = (await import('axios')).default;
                                            const res = await axios.post('http://localhost:3000/api/map/upload', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' }
                                            });
                                            if (res.data && res.data.imageUrl) {
                                                setFormData(prev => ({ ...prev, imgUrl: res.data.imageUrl }));
                                            }
                                        } catch (err) {
                                            console.error("Upload failed", err);
                                            alert("Failed to upload image.");
                                        }
                                    }
                                }}
                            />
                            <span className="text-sm text-cyan-400">Choose File...</span>
                        </label>
                        <input
                            name="imgUrl"
                            value={formData.imgUrl}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none text-white text-xs"
                            placeholder="or paste https://..."
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Update
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(selectedNode.id)}
                        className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NodeProperties;
