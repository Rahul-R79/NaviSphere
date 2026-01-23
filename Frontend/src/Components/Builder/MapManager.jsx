import React, { useState } from 'react';
import { Layers, Plus, Trash2, Map } from 'lucide-react';

const MapManager = ({ maps, activeMapId, onSelectMap, onCreateMap, onDeleteMap, onClose }) => {
    const [newMapName, setNewMapName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = () => {
        if (newMapName.trim()) {
            onCreateMap(newMapName);
            setNewMapName('');
            setIsCreating(false);
        }
    };

    return (
        <div className="absolute top-4 left-20 z-50 w-72 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-4">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Layers size={18} /> Maps
                </h3>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4 custom-scrollbar">
                {maps.map(map => (
                    <div
                        key={map.id}
                        onClick={() => onSelectMap(map.id)}
                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group transition-colors ${activeMapId === map.id
                            ? 'bg-cyan-600/20 border border-cyan-500/50 text-white'
                            : 'bg-white/5 border border-transparent hover:bg-white/10 text-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Map size={16} className={activeMapId === map.id ? 'text-cyan-400' : 'text-gray-500'} />
                            <span className="text-sm font-medium">{map.name}</span>
                        </div>

                        {maps.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteMap(map.id); }}
                                className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Map"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isCreating ? (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                    <input
                        value={newMapName}
                        onChange={(e) => setNewMapName(e.target.value)}
                        placeholder="Map Name (e.g. Level 2)"
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-1.5 rounded-lg text-xs font-medium"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-3 bg-white/5 hover:bg-white/10 text-gray-400 py-1.5 rounded-lg text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white flex items-center justify-center gap-2 text-sm transition-colors"
                >
                    <Plus size={16} /> Add New Map
                </button>
            )}
        </div>
    );
};

export default MapManager;
