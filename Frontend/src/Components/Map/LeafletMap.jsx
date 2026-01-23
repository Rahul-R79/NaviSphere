import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default Leaflet marker icons imports missing in Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to auto-fit bounds
const BoundsFitter = ({ nodes }) => {
    const map = useMap();

    useEffect(() => {
        if (nodes && nodes.length > 0) {
            const bounds = nodes.map(n => [n.lat, n.lng]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [nodes, map]);

    return null;
};

const LeafletMap = ({ mapData, path = [], onNodeClick, userPosition }) => {
    const { nodes, edges } = mapData || {};

    // Default center (will be overridden by BoundsFitter)
    const defaultCenter = [12.868, 74.842]; // Mangalore approx

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={18}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ background: '#0f172a' }} // Match app theme
            >
                {/* Dark Mode Map Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Auto Fit */}
                <BoundsFitter nodes={nodes} />

                {/* Connection Lines (Edges) */}
                {edges && edges.map((edge, i) => {
                    const from = nodes.find(n => n.id === edge.from);
                    const to = nodes.find(n => n.id === edge.to);
                    if (from && to) {
                        return (
                            <Polyline
                                key={`edge-${i}`}
                                positions={[[from.lat, from.lng], [to.lat, to.lng]]}
                                pathOptions={{ color: 'rgba(100, 149, 237, 0.4)', weight: 4 }}
                            />
                        );
                    }
                    return null;
                })}

                {/* Active Navigation Path */}
                {path && path.length > 1 && (
                    <Polyline
                        positions={path.map(n => [n.lat, n.lng])}
                        pathOptions={{ color: '#06b6d4', weight: 6, opacity: 1 }}
                    />
                )}

                {/* Nodes */}
                {nodes && nodes.map(node => (
                    <Marker
                        key={node.id}
                        position={[node.lat, node.lng]}
                        eventHandlers={{
                            click: () => onNodeClick && onNodeClick(node),
                        }}
                    >
                        <Popup className="text-black">
                            <span className="font-bold">{node.label}</span>
                            <br />
                            <span className="text-xs text-gray-500">{node.type}</span>
                        </Popup>
                    </Marker>
                ))}

                {/* User Position */}
                {userPosition && (
                    <Marker
                        position={[userPosition.lat, userPosition.lng]}
                        icon={L.divIcon({
                            className: 'bg-transparent',
                            html: `<div style="
                                width: 20px; 
                                height: 20px; 
                                background-color: #06b6d4; 
                                border: 3px solid white; 
                                border-radius: 50%; 
                                box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
                            "></div>`
                        })}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
