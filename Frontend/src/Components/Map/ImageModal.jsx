import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="relative bg-slate-800 rounded-2xl overflow-hidden max-w-[95vw] w-full shadow-2xl border border-slate-700 mx-4 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-4 border-b border-slate-700 bg-slate-900/50 block shrink-0">
                    <h3 className="text-xl font-semibold text-white">{title || 'Location View'}</h3>
                </div>

                <div className="w-full h-[60vh] md:h-[80vh] bg-slate-950 flex items-center justify-center p-4">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
