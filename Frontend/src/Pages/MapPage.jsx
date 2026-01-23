import React, { useState, useEffect, useRef } from 'react';
import LeafletMap from '../Components/Map/LeafletMap';
import { fetchMapData, fetchRoute } from '../utils/api';
import { Search, Navigation, MapPin, X, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MapPage() {
    const [mapData, setMapData] = useState(null);
    const [path, setPath] = useState([]);
    const [startNode, setStartNode] = useState('n_main');
    const [endNode, setEndNode] = useState('');
    const [isNavigating, setIsNavigating] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [userLocation, setUserLocation] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile toggle

    // Animation Refs
    const requestRef = useRef();
    const startTimeRef = useRef();

    // Load Map on Mount
    useEffect(() => {
        const loadMap = async () => {
            try {
                const data = await fetchMapData('map-campus-1');
                if (data) setMapData(data);
            } catch (err) {
                console.error("Error loading map:", err);
            }
        };
        loadMap();
    }, []);

    // Handle Route Calculation
    const handleNavigate = async () => {
        if (!startNode || !endNode) return;

        // Simple logic to find ID if name is typed (matches original logic)
        let finalStart = startNode;
        let finalEnd = endNode;

        if (mapData) {
            const findId = (val) => {
                const found = mapData.nodes.find(n => n.id === val || n.label.toLowerCase().includes(val.toLowerCase()));
                return found ? found.id : null;
            };
            finalStart = findId(startNode) || startNode;
            finalEnd = findId(endNode) || endNode;
        }

        try {
            const route = await fetchRoute(finalStart, finalEnd, mapData?.id);
            if (route && route.length > 0) {
                setPath(route);
                setIsNavigating(true);
                setCurrentStepIndex(0);
                // Initialize position with Lat/Lng
                setUserLocation({ lat: route[0].lat, lng: route[0].lng });
                if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto-close on mobile
            } else {
                alert("No path found between these locations!");
            }
        } catch (e) {
            console.error("Error fetching route:", e);
            alert("Error calculating path.");
        }
    };

    // Animation Loop aka "The Game Loop"
    const animate = (time) => {
        if (currentStepIndex >= path.length - 1) {
            setIsNavigating(false);
            setPath([]);
            setUserLocation(null);
            alert("You have arrived!");
            return;
        }

        const start = path[currentStepIndex];
        const end = path[currentStepIndex + 1];
        if (!start || !end) return;

        if (!startTimeRef.current) startTimeRef.current = time;

        // 2 seconds per segment duration
        const duration = 2000;
        const t = Math.min((time - startTimeRef.current) / duration, 1);

        // Linear Interpolation for Lat/Lng
        const newLat = start.lat + (end.lat - start.lat) * t;
        const newLng = start.lng + (end.lng - start.lng) * t;

        setUserLocation({ lat: newLat, lng: newLng });

        if (t < 1) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            setCurrentStepIndex(prev => prev + 1);
            startTimeRef.current = null;
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (isNavigating && path.length > 0) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isNavigating, path, currentStepIndex]);

    return (
        <div className="relative h-screen w-screen bg-slate-900 text-white overflow-hidden font-sans">

            {/* 1. Map Layer (Leaflet) */}
            <div className="absolute inset-0 z-0">
                <LeafletMap
                    mapData={mapData}
                    path={path}
                    userPosition={userLocation}
                    onNodeClick={(node) => setEndNode(node.id)}
                />
            </div>

            {/* 2. Responsive HUD */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute bottom-0 left-0 right-0 md:top-4 md:left-4 md:bottom-auto md:right-auto md:w-96 z-20 m-0 md:m-4"
                    >
                        <div className="glass-panel rounded-t-2xl md:rounded-2xl p-6 flex flex-col gap-6">

                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
                                        <Navigation size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            CampusNav
                                        </h1>
                                        <p className="text-xs text-gray-400 font-medium tracking-wide">SMART PATHFINDER</p>
                                    </div>
                                </div>
                                {/* Mobile Collapse Toggle */}
                                <button
                                    className="md:hidden p-2 text-gray-400 hover:text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <ChevronDown />
                                </button>
                            </div>

                            {/* Controls */}
                            {!isNavigating ? (
                                <div className="space-y-4">
                                    {/* Start Input */}
                                    <div className="group relative">
                                        <div className="absolute left-3 top-3.5 text-cyan-500 transition-colors group-focus-within:text-cyan-400">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            className="input-field pl-10"
                                            placeholder="Start Location"
                                            value={startNode}
                                            onChange={e => setStartNode(e.target.value)}
                                        />
                                        {startNode && (
                                            <button onClick={() => setStartNode('')} className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors">
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {/* End Input */}
                                    <div className="group relative">
                                        <div className="absolute left-3 top-3.5 text-purple-500 transition-colors group-focus-within:text-purple-400">
                                            <Search size={18} />
                                        </div>
                                        <input
                                            className="input-field pl-10"
                                            placeholder="Destination (e.g. Library)"
                                            value={endNode}
                                            onChange={e => setEndNode(e.target.value)}
                                        />
                                        {endNode && (
                                            <button onClick={() => setEndNode('')} className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors">
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <button onClick={handleNavigate} className="btn-primary flex items-center justify-center gap-2">
                                        <span>Start Navigation</span>
                                        <Navigation size={18} fill="currentColor" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Destination</p>
                                            <p className="text-lg font-bold text-white mt-1">{path[path.length - 1]?.label || endNode}</p>
                                        </div>
                                        <div className="bg-cyan-500/20 p-2 rounded-lg">
                                            <MapPin size={20} className="text-cyan-400" />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-4 rounded-xl text-center backdrop-blur-sm relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-1/2 animate-[shimmer_2s_infinite] translate-x-[-100%]" />
                                        <p className="text-cyan-200 font-semibold animate-pulse">Navigating...</p>
                                        <p className="text-xs text-cyan-400/60 mt-1">Follow the efficient path</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsNavigating(false);
                                            setPath([]);
                                            setUserLocation(null);
                                            cancelAnimationFrame(requestRef.current);
                                        }}
                                        className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all font-medium text-sm"
                                    >
                                        Cancel Route
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Toggle Button (Visible when sidebar is closed) */}
            {!isSidebarOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-6 right-6 md:hidden z-20 bg-cyan-600 p-4 rounded-full shadow-lg shadow-cyan-900/40 text-white"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu size={24} />
                </motion.button>
            )}
        </div>
    );
}

export default MapPage;
