import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGesture } from '@use-gesture/react';
import { updateTransform } from '../../store/mapSlice';

const MapCanvas = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const dispatch = useDispatch();
    const { nodes, edges, mapImage, scale, position } = useSelector((state) => state.map);

    // Gestures for Pan and Zoom
    useGesture(
        {
            onDrag: ({ offset: [dx, dy] }) => {
                dispatch(updateTransform({ scale, position: { x: dx, y: dy } }));
            },
            onPinch: ({ offset: [s] }) => {
                dispatch(updateTransform({ scale: s, position }));
            },
        },
        {
            target: containerRef,
            drag: { from: () => [position.x, position.y] },
            pinch: { scaleBounds: { min: 0.5, max: 5 }, rubberband: true },
        }
    );

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-hidden bg-gray-100 relative touch-none"
        >
            <div
                ref={contentRef}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    width: 'fit-content', // Important for bounds
                    height: 'fit-content'
                }}
                className="relative"
            >
                {/* 1. Map Background */}
                {mapImage ? (
                    <img
                        src={mapImage}
                        alt="Hospital Map"
                        className="max-w-none pointer-events-none select-none"
                        draggable={false}
                    />
                ) : (
                    <div className="w-[800px] h-[600px] bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        No Map Uploaded
                    </div>
                )}

                {/* 2. Edges Overlay (SVG) */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
                    {edges.map((edge, idx) => {
                        const startNode = nodes.find(n => n.id === edge.from);
                        const endNode = nodes.find(n => n.id === edge.to);
                        if (!startNode || !endNode) return null;

                        return (
                            <line
                                key={idx}
                                x1={startNode.x}
                                y1={startNode.y}
                                x2={endNode.x}
                                y2={endNode.y}
                                stroke="blue"
                                strokeWidth="4"
                                opacity="0.6"
                            />
                        );
                    })}
                </svg>

                {/* 3. Nodes Overlay */}
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className="absolute w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs text-white"
                        style={{ left: node.x, top: node.y }}
                        title={node.id} // Hover tooltip
                    >
                        {/* Optional: Icon based on type */}
                        {node.type === 'turn' ? '•' : '📍'}
                    </div>
                ))}
            </div>

            {/* Debug Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 text-white p-2 text-xs rounded pointer-events-none">
                Scale: {scale.toFixed(2)} | Pos: {position.x.toFixed(0)},{position.y.toFixed(0)} <br />
                Nodes: {nodes.length} | Edges: {edges.length}
            </div>
        </div>
    );
};

export default MapCanvas;
