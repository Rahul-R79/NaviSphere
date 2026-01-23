import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import MapCanvas from '../Components/Map/MapCanvas';
import { setMapData } from '../store/mapSlice';
import BuilderToolbar from '../Components/Builder/BuilderToolbar';
import NodeProperties from '../Components/Builder/NodeProperties';
import MapManager from '../Components/Builder/MapManager';

const MapBuilder = () => {
    const dispatch = useDispatch();

    // Editor State
    const [activeTool, setActiveTool] = useState('select'); // select, node, edge
    const [selectedNode, setSelectedNode] = useState(null);
    const [showMapManager, setShowMapManager] = useState(false);

    // Multi-Map State
    // maps = [{ id, name, nodes: [], edges: [], mapImage: null }, ...]
    const [maps, setMaps] = useState([
        { id: 'map-default', name: 'Default Map', nodes: [], edges: [], mapImage: null }
    ]);
    const [activeMapId, setActiveMapId] = useState('map-default');

    // Derived active map data
    const activeMapIndex = maps.findIndex(m => m.id === activeMapId);
    const activeMap = maps[activeMapIndex] || maps[0];

    // Initial Load
    useEffect(() => {
        // In a real app, fetch array of maps
        // For now, start with default empty state or local check
    }, []);

    // Helper to update current map
    const updateActiveMap = (updates) => {
        setMaps(prevMaps => {
            const newMaps = [...prevMaps];
            newMaps[activeMapIndex] = { ...newMaps[activeMapIndex], ...updates };
            return newMaps;
        });
    };

    // --- Actions ---

    const handleCreateMap = (name) => {
        const newMap = {
            id: `map-${Date.now()}`,
            name: name,
            nodes: [],
            edges: [],
            mapImage: null
        };
        setMaps(prev => [...prev, newMap]);
        setActiveMapId(newMap.id);
    };

    const handleDeleteMap = (id) => {
        if (maps.length <= 1) {
            alert("Cannot delete the last map.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this map?")) {
            setMaps(prev => prev.filter(m => m.id !== id));
            if (activeMapId === id) {
                // Switch to first available
                setActiveMapId(maps.find(m => m.id !== id).id);
            }
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateActiveMap({ mapImage: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddNode = (pos) => {
        const newNode = {
            id: `n_${Date.now()}`,
            x: pos.x,
            y: pos.y,
            label: 'New Node',
            type: 'room'
        };
        const newNodes = [...(activeMap.nodes || []), newNode];
        updateActiveMap({ nodes: newNodes });
    };

    const handleConnectNodes = (fromId, toId) => {
        // Prevent duplicates
        const exists = activeMap.edges?.find(e =>
            (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
        );
        if (exists) return;

        // Calculate Distance
        const nodeA = activeMap.nodes.find(n => n.id === fromId);
        const nodeB = activeMap.nodes.find(n => n.id === toId);

        let distance = 1;
        if (nodeA && nodeB) {
            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            distance = Math.round(Math.sqrt(dx * dx + dy * dy)); // Euclidean distance in pixels
        }

        const newEdge = { from: fromId, to: toId, weight: distance };
        updateActiveMap({ edges: [...(activeMap.edges || []), newEdge] });
    };

    const handleUpdateNode = (id, updates) => {
        const newNodes = activeMap.nodes.map(n => n.id === id ? { ...n, ...updates } : n);
        updateActiveMap({ nodes: newNodes });
        setSelectedNode(prev => ({ ...prev, ...updates }));
    };

    const handleDeleteNode = (id) => {
        const newNodes = activeMap.nodes.filter(n => n.id !== id);
        const newEdges = activeMap.edges.filter(e => e.from !== id && e.to !== id);
        updateActiveMap({ nodes: newNodes, edges: newEdges });
        setSelectedNode(null);
    };

    const handleNodeClick = (node) => {
        if (activeTool === 'select') {
            setSelectedNode(node);
        }
    };

    const handleSave = async () => {
        try {
            // Save ALL maps
            await axios.post('http://localhost:3000/api/map', maps);
            alert('Maps saved successfully!');
            dispatch(setMapData(maps)); // Update global state
        } catch (error) {
            console.error("Failed to save map:", error);
            alert('Failed to save maps (Backend unreachable). Data is in browser state only.');
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear this map's data?")) {
            updateActiveMap({ nodes: [], edges: [] });
            setSelectedNode(null);
        }
    }

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Toolbar */}
            <BuilderToolbar
                activeTool={activeTool}
                setActiveTool={(tool) => { setActiveTool(tool); setSelectedNode(null); }}
                showMapManager={showMapManager}
                onToggleMapManager={() => {
                    console.log("Toggling Map Manager. Current state:", showMapManager);
                    setShowMapManager(!showMapManager);
                }}
                onSave={handleSave}
                onClear={handleClear}
                onUpload={handleUpload}
            />

            {/* Map Manager Sidebar */}
            {showMapManager && (
                <MapManager
                    maps={maps}
                    activeMapId={activeMapId}
                    onSelectMap={setActiveMapId}
                    onCreateMap={handleCreateMap}
                    onDeleteMap={handleDeleteMap}
                />
            )}

            {/* Properties Panel */}
            {selectedNode && activeTool === 'select' && (
                <NodeProperties
                    selectedNode={selectedNode}
                    onUpdate={handleUpdateNode}
                    onDelete={handleDeleteNode}
                    onClose={() => setSelectedNode(null)}
                />
            )}

            {/* Canvas Area */}
            <main className="flex-1 relative overflow-hidden bg-slate-900">
                <MapCanvas
                    mapData={activeMap}
                    isEditing={true}
                    activeTool={activeTool}
                    onAddNode={handleAddNode}
                    onConnectNodes={handleConnectNodes}
                    onNodeClick={handleNodeClick}
                />
            </main>
        </div>
    );
};

export default MapBuilder;
