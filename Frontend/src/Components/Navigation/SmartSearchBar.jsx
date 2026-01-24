import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const SmartSearchBar = ({ activeMap, onDestinationFound }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim() || !activeMap) return;

        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_BASE_URL}/ai/find-destination`, {
                query: query,
                nodes: activeMap.nodes
            });

            if (res.data.nodeId) {
                onDestinationFound(res.data.nodeId);
                setQuery(''); // Clear search on success
            } else {
                setError(res.data.message || "I couldn't find a matching location.");
            }
        } catch (err) {
            console.error("AI Search Failed", err);
            // Check for specific error status (like 503 for missing key)
            if (err.response && err.response.status === 503) {
                setError("AI Service is not configured (API Key missing).");
            } else {
                setError("Sorry, I'm having trouble thinking right now.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="relative group">
                {/* Glowing Effect border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 transition duration-500 blur"></div>

                <form onSubmit={handleSearch} className="relative bg-slate-900 rounded-xl flex items-center p-1">
                    <div className="pl-3 text-purple-400 animate-pulse">
                        <Sparkles size={20} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask: 'Where you want to go"
                        className="w-full bg-transparent text-white border-0 focus:ring-0 placeholder-gray-500 text-sm py-2 px-3 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    </button>
                </form>
            </div>

            {error && (
                <p className="text-xs text-red-400 mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SmartSearchBar;
