import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import MapCanvas from '../Components/Map/MapCanvas';
import { setMapData } from '../store/mapSlice';

const MapBuilder = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/map');
                // Backend returns { nodes: [], edges: [], mapImage: null }
                if (response.data) {
                    dispatch(setMapData(response.data));
                }
            } catch (error) {
                console.error("Failed to fetch map data:", error);
            }
        };

        fetchMapData();
    }, [dispatch]);

    return (
        <div className="flex flex-col h-screen w-full">
            <header className="bg-blue-600 text-white p-4 shadow-md z-10">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    🛠️ Map Viewer (Sprint 1 Preview)
                </h1>
                <p className="text-sm opacity-80">Test Pan, Zoom, and Rendering</p>
            </header>

            <main className="flex-1 relative overflow-hidden">
                <MapCanvas />
            </main>
        </div>
    );
};

export default MapBuilder;
