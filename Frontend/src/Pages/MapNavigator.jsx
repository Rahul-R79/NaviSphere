import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigation, Map as MapIcon, ChevronRight } from 'lucide-react';
import LeafletMap from '../Components/Map/LeafletMap'; // Import LeafletMap



import { findPath } from '../utils/pathfinding';
import axios from 'axios';
import MapCanvas from '../Components/Map/MapCanvas'; // Restore import I accidentally removed earlier? No, it's missing in lines 1-38 view.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


const MapNavigator = () => {
    const [maps, setMaps] = useState([]);
    const [activeMapId, setActiveMapId] = useState('');
    const [startNodeId, setStartNodeId] = useState('');
    const [endNodeId, setEndNodeId] = useState('');
    const [calculatedPath, setCalculatedPath] = useState(null);
    const [userPosition, setUserPosition] = useState(null);

    // Load Maps (Local Storage Fallback for now as per request details)
    useEffect(() => {
        const loadMaps = async () => {
            const allMaps = [];

            // 1. Add Hardcoded/Built-in Campus Map
            const campusMap = {
                id: 'map-campus-1',
                name: 'College Campus (Built-in)',
                // Fetching its nodes/edges would typically require a separate API call or hardcoded data. 
                // For now, let's try to fetch it via the existing API if possible, or just skip if it relies on LeafletMap.
                // Wait, the user said "collage map is not there". The original MapPage used 'map-campus-1'.
                // Let's assume we can fetch it.
            };
            // Actually, the original MapPage checks `fetchMapData('map-campus-1')`.

            try {
                // Try backend for all maps
                const res = await axios.get(`${API_BASE_URL}/map`);
                if (res.data && Array.isArray(res.data)) {
                    allMaps.push(...res.data);
                }
            } catch (err) {
                console.log("Backend map fetch failed or empty", err);
            }

            // Merge with Local Storage
            const localMaps = localStorage.getItem('pathpulse_maps');
            if (localMaps) {
                const parsed = JSON.parse(localMaps);
                if (Array.isArray(parsed)) {
                    // Avoid duplicates by ID
                    parsed.forEach(lm => {
                        if (!allMaps.find(m => m.id === lm.id)) {
                            allMaps.push(lm);
                        }
                    });
                }
            }

            // If we still don't have the "Campus Map" explicitly, and if the backend returns nothing,
            // we might be missing it. 
            // However, the USER said "collage map is not there".
            // It seems 'map-campus-1' was the ID used in MapPage.jsx. 
            // Let's explicitly try to fetch that one specific map if it's not in the list.
            if (!allMaps.find(m => m.id === 'map-campus-1')) {
                try {
                    const campusRes = await axios.get(`${API_BASE_URL}/map/map-campus-1`);
                    if (campusRes.data) {
                        // Give it a name if missing
                        const campusData = { ...campusRes.data, name: campusRes.data.name || 'College Campus' };
                        allMaps.unshift(campusData); // Put it first
                    }
                } catch (e) {
                    // ignore if not found
                }
            }

            // Filter out empty/junk maps (e.g. "New Map" with no nodes)
            const validMaps = allMaps.filter(m => {
                if (m.name === 'New Map' && (!m.nodes || m.nodes.length === 0)) return false;
                return true;
            });

            // Ensure uniqueness by ID one last time (just in case)
            const uniqueMaps = Array.from(new Map(validMaps.map(m => [m.id, m])).values());

            setMaps(uniqueMaps);

            // Set active map logic
            if (uniqueMaps.length > 0) {
                // Prefer the campus map if available and no active map selected
                const campus = uniqueMaps.find(m => m.id === 'map-campus-1');
                if (campus) setActiveMapId(campus.id);
                else setActiveMapId(uniqueMaps[0].id);
            }
        };
        loadMaps();
    }, []);

    const activeMap = maps.find(m => m.id === activeMapId) || null;

    // Filter nodes for dropdowns (e.g. only named rooms)
    const availableNodes = activeMap?.nodes?.filter(n => n.label && n.label !== 'New Node') || [];

    const [isNavigating, setIsNavigating] = useState(false);

    const handleNavigate = () => {
        if (!activeMap || !startNodeId || !endNodeId) return;

        const path = findPath(activeMap.nodes, activeMap.edges, startNodeId, endNodeId);
        setCalculatedPath(path);

        if (path && path.length > 0) {
            // Set initial position
            const start = path[0];
            if (activeMap.nodes[0].lat !== undefined) {
                setUserPosition({ lat: start.lat, lng: start.lng });
            } else {
                setUserPosition({ x: start.x, y: start.y });
            }
            setIsNavigating(true);
        }
    };

    // Animation Effect
    useEffect(() => {
        if (!isNavigating || !calculatedPath || calculatedPath.length < 2) return;

        let currentIndex = 0;
        let startTime = performance.now();
        const durationPerSegment = 1000; // 1 second per edge

        let frameId;

        const animate = (time) => {
            const elapsedTime = time - startTime;
            const progress = Math.min(elapsedTime / durationPerSegment, 1);

            const startNode = calculatedPath[currentIndex];
            const endNode = calculatedPath[currentIndex + 1];

            if (!startNode || !endNode) {
                setIsNavigating(false);
                return;
            }

            // Interpolate based on map type (Geo vs Cartesian)
            if (startNode.lat !== undefined && endNode.lat !== undefined) {
                // Geo Interpolation
                const newLat = startNode.lat + (endNode.lat - startNode.lat) * progress;
                const newLng = startNode.lng + (endNode.lng - startNode.lng) * progress;
                setUserPosition({ lat: newLat, lng: newLng });
            } else {
                // Cartesian Interpolation
                const newX = startNode.x + (endNode.x - startNode.x) * progress;
                const newY = startNode.y + (endNode.y - startNode.y) * progress;
                setUserPosition({ x: newX, y: newY });
            }

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            } else {
                // Segment complete, move to next
                currentIndex++;
                if (currentIndex < calculatedPath.length - 1) {
                    startTime = performance.now();
                    frameId = requestAnimationFrame(animate);
                } else {
                    setIsNavigating(false); // Arrived
                    // alert("You have reached your destination!");
                }
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [isNavigating, calculatedPath]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-full w-full bg-slate-900 text-white relative">
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-4 left-4 z-50 md:hidden p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-lg text-cyan-400"
            >
                {isSidebarOpen ? <ChevronRight className="rotate-180" size={24} /> : <Navigation size={24} />}
            </button>

            {/* Sidebar Controls */}
            <div className={`
                absolute md:static top-0 left-0 h-full bg-slate-800 border-r border-slate-700 flex flex-col shadow-xl z-40 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0 w-0 md:w-80'}
                overflow-hidden
            `}>
                <div className="p-6 border-b border-slate-700 flex justify-between items-center min-w-[20rem]">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
                            <Navigation size={28} />
                            Navigator
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Find your way around</p>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <ChevronRight className="rotate-180" size={24} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6 overflow-y-auto min-w-[20rem]">
                    {/* Map Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Map</label>
                        <div className="relative">
                            <MapIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none appearance-none cursor-pointer"
                                value={activeMapId}
                                onChange={(e) => {
                                    setActiveMapId(e.target.value);
                                    setStartNodeId('');
                                    setEndNodeId('');
                                    setCalculatedPath(null);
                                    setUserPosition(null);
                                }}
                            >
                                {maps.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                                {maps.length === 0 && <option>No maps found</option>}
                            </select>
                        </div>
                    </div>

                    {activeMap && (
                        <>
                            {/* Start Point */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Location</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
                                    value={startNodeId}
                                    onChange={(e) => setStartNodeId(e.target.value)}
                                >
                                    <option value="">Select Start...</option>
                                    {availableNodes.map(n => (
                                        <option key={n.id} value={n.id}>{n.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* End Point */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
                                    value={endNodeId}
                                    onChange={(e) => setEndNodeId(e.target.value)}
                                >
                                    <option value="">Select Destination...</option>
                                    {availableNodes.map(n => (
                                        <option key={n.id} value={n.id}>{n.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Go Button */}
                            <button
                                onClick={() => {
                                    handleNavigate();
                                    setIsSidebarOpen(false); // Close sidebar on mobile after starting
                                }}
                                disabled={!startNodeId || !endNodeId}
                                className={`
                                    w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                                    ${startNodeId && endNodeId
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 active:scale-95'
                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                                `}
                            >
                                <Navigation size={18} />
                                Start Navigation
                            </button>

                            {/* Stats */}
                            {calculatedPath && (
                                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                    <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Route Details</h3>
                                    <div className="text-slate-300 text-sm space-y-1">
                                        <p>Stops: <span className="text-white">{calculatedPath.length}</span></p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-950 overflow-hidden">
                {activeMap ? (
                    (() => {
                        // Determine if it's a Geo Map (Leaflet) or Image Map (Canvas)
                        // A map is Geo if it has nodes and the first node has a 'lat' property
                        const isGeoMap = activeMap.nodes && activeMap.nodes.length > 0 && activeMap.nodes[0].lat !== undefined;

                        if (isGeoMap) {
                            return (
                                <LeafletMap
                                    key={`leaflet-${activeMap.id}`}
                                    mapData={activeMap}
                                    path={calculatedPath}
                                    userPosition={userPosition}
                                />
                            );
                        } else {
                            return (
                                <MapCanvas
                                    key={`canvas-${activeMap.id}`}
                                    mapData={activeMap}
                                    path={calculatedPath}
                                    userPosition={userPosition}
                                    isEditing={false}
                                />
                            );
                        }
                    })()
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        Select a map to begin
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapNavigator;
