import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="relative bg-slate-800 rounded-2xl overflow-hidden w-full md:w-auto md:min-w-[400px] max-w-3xl shadow-2xl border border-slate-700 flex flex-col max-h-[80vh] transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50 shrink-0 gap-4">
                    <h3 className="text-xl font-semibold text-white truncate max-w-[calc(100%-3rem)]">{title || 'Location View'}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative flex-1 min-h-0 bg-slate-950 w-full flex items-center justify-center overflow-hidden p-2 md:p-4">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
