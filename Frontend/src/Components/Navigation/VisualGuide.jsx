import React from 'react';

const VisualGuide = ({ currentStep, nextStep, onNext, onClose }) => {
    if (!currentStep || !currentStep.visualGuidance) return null;

    const { imageRef, description, overlays } = currentStep.visualGuidance;

    // Find the overlay for the specific next node
    const overlay = nextStep
        ? overlays.find(o => o.targetNodeId === nextStep.id)
        : null;

    // Arrow rotation based on type
    const getArrowRotation = (type) => {
        switch (type) {
            case 'left': return '-45deg';
            case 'right': return '45deg';
            case 'straight': return '0deg';
            case 'uturn': return '180deg';
            default: return '0deg';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl skew-y-0">
                {/* Header */}
                <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">Visual Guide</h3>
                    <button onClick={onClose} className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Close</button>
                </div>

                {/* Image Container */}
                <div className="relative aspect-video bg-gray-200">
                    <img
                        src={imageRef}
                        alt="Location View"
                        className="w-full h-full object-cover"
                    />

                    {/* Visual Overlay Arrow */}
                    {overlay && (
                        <div
                            className="absolute w-16 h-16 pointer-events-none drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                            style={{
                                left: `${overlay.x * 100}%`,
                                top: `${overlay.y * 100}%`,
                                transform: `translate(-50%, -50%) rotate(${getArrowRotation(overlay.arrowType)})`
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-400 animate-pulse">
                                <path d="M12 2L12 22M12 2L5 9M12 2L19 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Instruction Footer */}
                <div className="p-6 bg-white">
                    <p className="text-xl font-bold text-gray-800 text-center">{description}</p>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={onNext}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition">
                            Continue Navigation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualGuide;