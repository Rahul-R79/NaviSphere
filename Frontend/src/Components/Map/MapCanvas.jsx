import React, { useRef, useEffect, useState } from 'react';
import { Plus, Minus, Camera } from 'lucide-react';
import ImageModal from './ImageModal';

const MapCanvas = ({
    mapData,
    path = [],
    onNodeClick,
    userPosition,
    isEditing = false,
    activeTool = 'select',
    onAddNode,
    onConnectNodes
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const [edgeStartNode, setEdgeStartNode] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const { mapImage, nodes, edges } = mapData || {};

    const [imageObj, setImageObj] = useState(null);
    const [nodeImages, setNodeImages] = useState({});

    // Modal State
    const [selectedNode, setSelectedNode] = useState(null);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load Map Background Image & Auto-Fit
    useEffect(() => {
        if (mapImage) {
            const img = new Image();
            img.src = mapImage;
            img.onload = () => {
                setImageObj(img);

                // Auto-fit logic logic based on current dimensions
                const width = dimensions.width;
                const height = dimensions.height;

                const scaleX = width / img.width;
                const scaleY = height / img.height;
                const fitScale = Math.min(scaleX, scaleY) * 0.9; 

                const centerX = (width - img.width * fitScale) / 2;
                const centerY = (height - img.height * fitScale) / 2;

                setScale(fitScale);
                setOffset({ x: centerX, y: centerY });
            };
        } else {
            setImageObj(null);
        }
    }, [mapImage]); 

    // Load Node Images
    useEffect(() => {
        if (nodes) {
            const loadedImages = {};
            nodes.forEach(node => {
                if (node.imgUrl) {
                    const img = new Image();
                    img.src = node.imgUrl;
                    img.onload = () => {
                        setNodeImages(prev => ({ ...prev, [node.id]: img }));
                    };
                }
            });
        }
    }, [nodes]);


    // Draw Function
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return; 
        const ctx = canvas.getContext('2d');

        // Clear and set transform
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background for transparency check (optional, keeping dark)
        ctx.fillStyle = '#0f172a'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);

        // 1. Draw Background Map
        if (imageObj) {
            ctx.drawImage(imageObj, 0, 0);
        }

        // 2. Draw Edges
        if (edges) {
            ctx.strokeStyle = 'rgba(100, 149, 237, 0.5)'; 
            ctx.lineWidth = 5;
            edges.forEach(edge => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (fromNode && toNode) {
                    ctx.beginPath();
                    ctx.moveTo(fromNode.x, fromNode.y);
                    ctx.lineTo(toNode.x, toNode.y);
                    ctx.stroke();
                }
            });
        }

        // 2.5 Draw Ghost Edge (Connecting)
        if (isEditing && activeTool === 'edge' && edgeStartNode) {
            const worldMouseX = (mousePos.x - offset.x) / scale;
            const worldMouseY = (mousePos.y - offset.y) / scale;

            ctx.beginPath();
            ctx.moveTo(edgeStartNode.x, edgeStartNode.y);
            ctx.lineTo(worldMouseX, worldMouseY);
            ctx.strokeStyle = '#22c55e'; 
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 3. Draw Active Path (Highlight)
        if (path && path.length > 1) {
            ctx.strokeStyle = '#06b6d4'; 
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.stroke();
        }

        // 4. Draw Nodes
        if (nodes) {
            nodes.forEach(node => {
                const isPathNode = path && path.find(p => p.id === node.id);
                const isSelected = selectedNode && selectedNode.id === node.id;
                const isEdgeStart = edgeStartNode && edgeStartNode.id === node.id;

                const nodeImg = nodeImages[node.id];
                const baseRadius = isPathNode || isSelected ? 20 : 12; 
                const nodeRadius = baseRadius / scale;

                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);

                // Draw Image thumbnail or color
                if (nodeImg) {
                    ctx.save();
                    ctx.clip();
                    // Simple cover logic
                    const aspect = nodeImg.width / nodeImg.height;
                    let drawWidth = nodeRadius * 2;
                    let drawHeight = nodeRadius * 2;

                    if (aspect > 1) {
                        drawHeight = drawWidth / aspect;
                    } else {
                        drawWidth = drawHeight * aspect;
                    }
                    ctx.drawImage(nodeImg, node.x - nodeRadius, node.y - nodeRadius, nodeRadius * 2, nodeRadius * 2);
                    ctx.restore();

                    // Add a border
                    ctx.strokeStyle = isPathNode || isSelected ? '#06b6d4' : '#fff';
                    ctx.lineWidth = 2 / scale;
                    ctx.stroke();
                } else {
                    ctx.fillStyle = isPathNode || isSelected || isEdgeStart ? '#06b6d4' : '#ffffff';
                    ctx.fill();
                    if (isPathNode || isSelected) {
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 2 / scale;
                        ctx.stroke();
                    }
                }

                // Label
                if (scale > 0.8 || node.type === 'poi' || isPathNode || node.imgUrl || isEditing) {
                    ctx.fillStyle = '#fff';
                    ctx.font = `bold ${14 / scale}px "Outfit", sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.shadowColor = "black";
                    ctx.shadowBlur = 4;
                    ctx.fillText(node.label || node.id, node.x, node.y - (nodeRadius + (8 / scale)));
                    ctx.shadowBlur = 0; // reset
                }
            });
        }

        // 5. Draw User Marker (Animated)
        if (userPosition) {
            ctx.beginPath();
            ctx.arc(userPosition.x, userPosition.y, 20 / scale, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.3)'; 
            ctx.fill();

            ctx.beginPath();
            ctx.arc(userPosition.x, userPosition.y, 10 / scale, 0, 2 * Math.PI);
            ctx.fillStyle = '#06b6d4';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3 / scale;
            ctx.stroke();
        }

        ctx.restore();
    };

    useEffect(() => {
        draw();
    }, [imageObj, nodes, edges, path, scale, offset, userPosition, dimensions, nodeImages, mousePos, edgeStartNode, selectedNode]);

    // Event Handlers for Pan/Zoom
    const handleMouseDown = (e) => {
        setIsDragging(false); 
        setDragStart({ x: e.clientX, y: e.clientY }); 
    };

    const handleMouseMove = (e) => {
        // Track mouse world pos for ghost lines
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        if (e.buttons === 1) { 
            // Calculate distance moved
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                // If actively dragging to create edge, don't pan
                if (isEditing && activeTool === 'edge' && edgeStartNode) return;

                setIsDragging(true);
                setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
            }
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging) {
            // It was a click
            handleCanvasClick(e);
        }
        setIsDragging(false);
    };

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Convert to world coordinates
        const worldX = (clickX - offset.x) / scale;
        const worldY = (clickY - offset.y) / scale;

        // Check collision with nodes
        const CLICK_RADIUS = 20 / scale; 

        // Find clicked node (iterate effectively)
        const clickedNode = nodes.find(node => {
            const dist = Math.sqrt(Math.pow(node.x - worldX, 2) + Math.pow(node.y - worldY, 2));
            return dist < (Math.max(20, 20 / scale)); 
        });

        if (isEditing) {
            if (activeTool === 'select') {
                if (clickedNode) {
                    if (onNodeClick) onNodeClick(clickedNode);
                    setSelectedNode(clickedNode);
                } else {
                    setSelectedNode(null);
                    if (onNodeClick) onNodeClick(null);
                }
            } else if (activeTool === 'node') {
                if (!clickedNode && onAddNode) {
                    onAddNode({ x: worldX, y: worldY });
                }
            } else if (activeTool === 'edge') {
                if (clickedNode) {
                    if (!edgeStartNode) {
                        setEdgeStartNode(clickedNode);
                    } else {
                        if (edgeStartNode.id !== clickedNode.id) {
                            if (onConnectNodes) onConnectNodes(edgeStartNode.id, clickedNode.id);
                        }
                        setEdgeStartNode(null); 
                    }
                } else {
                    // Clicked empty space cancel edge
                    setEdgeStartNode(null);
                }
            }
        } else {
            // Viewer Mode logic
            if (clickedNode) {
                if (onNodeClick) onNodeClick(clickedNode);
                if (clickedNode.imgUrl) {
                    setSelectedNode(clickedNode);
                }
            }
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const newScale = Math.min(Math.max(0.1, scale - e.deltaY * zoomSensitivity), 5);
        setScale(newScale);
    };

    // Zoom Controls
    const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 5));
    const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.1));

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-900 overflow-hidden relative">
            {!imageObj && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
                    <p className="text-xl font-bold mb-2">No Map Loaded</p>
                    <p className="text-sm">Upload a floor plan using the toolbar to begin.</p>
                </div>
            )}
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { setIsDragging(false); setEdgeStartNode(null); }}
                onWheel={handleWheel}
                className={`touch-none ${isEditing && activeTool === 'node' ? 'cursor-crosshair' : 'cursor-move'}`}
            />
            {/* Styled Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                <button
                    className="p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl"
                    onClick={handleZoomIn}
                    aria-label="Zoom In"
                >
                    <Plus size={20} />
                </button>
                <button
                    className="p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl"
                    onClick={handleZoomOut}
                    aria-label="Zoom Out"
                >
                    <Minus size={20} />
                </button>
            </div>

            {/* Node Image Modal - Only show in non-edit mode or active selection in select tool if it has image */}
            <ImageModal
                isOpen={!!selectedNode && !isEditing}
                onClose={() => setSelectedNode(null)}
                imageUrl={selectedNode?.imgUrl}
                title={selectedNode?.label}
            />
        </div>
    );
};

export default MapCanvas;
