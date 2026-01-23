import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MapCanvas from '../Components/Map/MapCanvas';
import { setMapData } from '../store/mapSlice';

const MapBuilder = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // TODO: Replace with Real API Call (Developer A Integration)
        // axios.get('/api/map').then(...);

        // DEMO DATA for verification
        const demoData = {
            mapImage: 'https://via.placeholder.com/800x600?text=Hospital+Floor+Plan',
            nodes: [
                { id: '1', x: 100, y: 100, type: 'room' },
                { id: '2', x: 300, y: 100, type: 'turn' },
                { id: '3', x: 300, y: 300, type: 'room' },
            ],
            edges: [
                { from: '1', to: '2' },
                { from: '2', to: '3' },
            ]
        };

        dispatch(setMapData(demoData));
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
