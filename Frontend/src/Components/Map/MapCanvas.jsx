import React, { useRef, useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const MapCanvas = ({ mapData, path = [], onNodeClick, userPosition }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    const { mapImage, nodes, edges } = mapData || {};

    // Load Image
    const [imageObj, setImageObj] = useState(null);

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

    // Load Image & Auto-Fit
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
                const fitScale = Math.min(scaleX, scaleY) * 0.9; // 90% fit

                const centerX = (width - img.width * fitScale) / 2;
                const centerY = (height - img.height * fitScale) / 2;

                setScale(fitScale);
                setOffset({ x: centerX, y: centerY });
            };
        }
    }, [mapImage, dimensions.width, dimensions.height]); // Re-run fit on resize if image is loaded? Maybe optional. 
    // Actually, better to only auto-fit on initial load, but for now this ensures visual consistency.

    // Draw Function
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageObj) return;
        const ctx = canvas.getContext('2d');

        // Clear and set transform
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background for transparency check (optional, keeping dark)
        ctx.fillStyle = '#0f172a'; // slate-900 to match app
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);

        // 1. Draw Background Map
        ctx.drawImage(imageObj, 0, 0);

        // 2. Draw Edges
        if (edges) {
            ctx.strokeStyle = 'rgba(100, 149, 237, 0.5)'; // Cornflower Blue
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

        // 3. Draw Active Path (Highlight)
        if (path && path.length > 1) {
            ctx.strokeStyle = '#06b6d4'; // Cyan-500
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

                ctx.beginPath();
                ctx.arc(node.x, node.y, isPathNode ? 12 : 6, 0, 2 * Math.PI);
                ctx.fillStyle = isPathNode ? '#06b6d4' : '#ffffff';
                ctx.fill();

                if (isPathNode) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Label
                if (scale > 0.8 || node.type === 'poi' || isPathNode) {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 14px "Outfit", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = "black";
                    ctx.shadowBlur = 4;
                    ctx.fillText(node.label || node.id, node.x, node.y - 15);
                    ctx.shadowBlur = 0; // reset
                }
            });
        }

        // 5. Draw User Marker (Animated)
        if (userPosition) {
            ctx.beginPath();
            ctx.arc(userPosition.x, userPosition.y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.3)'; // Cyan pulse
            ctx.fill();

            ctx.beginPath();
            ctx.arc(userPosition.x, userPosition.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = '#06b6d4';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.restore();
    };

    useEffect(() => {
        draw();
    }, [imageObj, nodes, edges, path, scale, offset, userPosition, dimensions]);

    // Event Handlers for Pan/Zoom
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
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
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className="cursor-move touch-none"
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
        </div>
    );
};

export default MapCanvas;
