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
    // Initial Load
    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/map');
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setMaps(res.data);
                    // Set active to first map if current active is default/not found
                    if (!res.data.find(m => m.id === activeMapId)) {
                        setActiveMapId(res.data[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to load maps:", error);
                // Try fallback to localstorage if backend fails
                const localMaps = localStorage.getItem('pathpulse_maps');
                if (localMaps) {
                    try {
                        const parsed = JSON.parse(localMaps);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setMaps(parsed);
                        }
                    } catch (e) { }
                }
            }
        };
        fetchMaps();
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

    const handleDeleteMap = async (id) => {
        if (maps.length <= 1) {
            alert("Cannot delete the last map.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this map?")) {
            const newMaps = maps.filter(m => m.id !== id);
            setMaps(newMaps);

            if (activeMapId === id) {
                // Switch to first available
                setActiveMapId(newMaps[0].id);
            }

            // Validating and Saving
            const result = await saveMapsToBackend(newMaps);
            if (!result.success && !result.localSaveSuccess) {
                alert("Map deleted locally but FAILED to save to backend/storage. It may reappear on refresh.");
            }
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('mapImage', file); // Field name must match backend multer config

            try {
                const res = await axios.post('http://localhost:3000/api/map/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data && res.data.imageUrl) {
                    updateActiveMap({ mapImage: res.data.imageUrl });
                }
            } catch (error) {
                console.error("Failed to upload map image:", error);
                alert("Failed to upload image. Please ensure backend is running.");
            }
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

    const saveMapsToBackend = async (mapsToSave) => {
        let localSaveSuccess = false;
        let localError = null;

        // 1. Try Local Storage (Backup)
        try {
            localStorage.setItem('pathpulse_maps', JSON.stringify(mapsToSave));
            localSaveSuccess = true;
        } catch (e) {
            console.warn("Local Storage Error:", e);
            localError = e;
        }

        // 2. Try Backend (Primary)
        try {
            await axios.post('http://localhost:3000/api/map', mapsToSave);
            dispatch(setMapData(mapsToSave));
            return { success: true, localSaveSuccess };
        } catch (error) {
            console.error("Backend save failed:", error);
            return { success: false, localSaveSuccess, localError };
        }
    };

    const handleSave = async () => {
        const result = await saveMapsToBackend(maps);
        if (result.success) {
            alert(result.localSaveSuccess ? 'Maps saved successfully!' : 'Maps saved to Server! (Local backup skipped)');
        } else {
            if (result.localSaveSuccess) {
                alert('Backend unreachable, but maps saved to Browser Storage!');
            } else {
                alert('Failed to save maps to either Server or Local Storage.');
            }
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear this map's data?")) {
            updateActiveMap({ nodes: [], edges: [], mapImage: null });
            setSelectedNode(null);
        }
    }

    const handleRemoveMapImage = async () => {
        if (window.confirm("Are you sure you want to remove the background map image? Nodes and edges will remain.")) {
            // Calculate new state immediately
            const newMaps = [...maps];
            newMaps[activeMapIndex] = { ...newMaps[activeMapIndex], mapImage: null };

            // Validate changes
            setMaps(newMaps);

            // Auto-save the change
            const result = await saveMapsToBackend(newMaps);
            if (result.success) {
                // success
            } else if (result.localSaveSuccess) {
                alert("Image removed and saved to local storage (Backend unreachable).");
            } else {
                alert("Image removed but FAILED to save to backend/storage. Changes will be lost on refresh.");
            }
        }
    };

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
                onRemoveImage={handleRemoveMapImage}
                hasMapImage={!!activeMap.mapImage}
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
