import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fetchMapData = async (mapId = 'map-campus-1') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/map/${mapId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching map:', error);
    return null;
  }
};

export const fetchRoute = async (startNodeId, endNodeId, mapId = 'map-campus-1') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/map/route`, {
      params: { startNodeId, endNodeId, mapId },
    });
    return response.data.path;
  } catch (error) {
    console.error('Error calculating route:', error);
    return [];
  }
};
