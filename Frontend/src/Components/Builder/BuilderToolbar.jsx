import React from 'react';
import { MousePointer2, MapPin, Share2, Upload, Save, Trash2, Layers, ImageOff } from 'lucide-react';

const tools = [
    { id: 'select', icon: <MousePointer2 size={20} />, label: 'Select' },
    { id: 'node', icon: <MapPin size={20} />, label: 'Add Node' },
    { id: 'edge', icon: <Share2 size={20} />, label: 'Connect' },
];

const BuilderToolbar = ({ activeTool, setActiveTool, onSave, onClear, onUpload, onToggleMapManager, showMapManager, onRemoveImage, hasMapImage }) => {
    return (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-slate-800 p-2 rounded-xl border border-white/10 shadow-xl flex flex-col gap-2">

                {/* Map Manager Toggle */}
                <button
                    onClick={onToggleMapManager}
                    className={`p-3 rounded-lg transition-all flex items-center gap-2 group relative ${showMapManager
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    title="Manage Maps"
                >
                    <Layers size={20} />
                    <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Manage Maps
                    </span>
                </button>

                <div className="h-px bg-white/10 my-1" />

                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`p-3 rounded-lg transition-all flex items-center gap-2 group relative ${activeTool === tool.id
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        title={tool.label}
                    >
                        {tool.icon}

                        {/* Tooltip */}
                        <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="bg-slate-800 p-2 rounded-xl border border-white/10 shadow-xl flex flex-col gap-2 mt-2">
                <label className="p-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer flex items-center justify-center relative group" title="Upload Floor Plan">
                    <Upload size={20} />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUpload}
                    />
                    <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Upload Map
                    </span>
                </label>

                {hasMapImage && (
                    <button
                        onClick={onRemoveImage}
                        className="p-3 bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg transition-all relative group"
                        title="Remove Map Image"
                    >
                        <ImageOff size={20} />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Remove Image
                        </span>
                    </button>
                )}
            </div>

            <div className="bg-slate-800 p-2 rounded-xl border border-white/10 shadow-xl flex flex-col gap-2 mt-2">
                <button
                    onClick={onSave}
                    className="p-3 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-lg transition-all"
                    title="Save Map"
                >
                    <Save size={20} />
                </button>
                <button
                    onClick={onClear}
                    className="p-3 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                    title="Clear All"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default BuilderToolbar;
