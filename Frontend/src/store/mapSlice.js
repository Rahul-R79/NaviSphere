import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
  mapImage: null, // URL or Base64
  scale: 1,
  position: { x: 0, y: 0 },
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapData: (state, action) => {
      state.nodes = action.payload.nodes || [];
      state.edges = action.payload.edges || [];
      if (action.payload.mapImage) state.mapImage = action.payload.mapImage;
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    setMapImage: (state, action) => {
      state.mapImage = action.payload;
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = { ...state.nodes[index], ...action.payload };
      }
    },
    updateTransform: (state, action) => {
      state.scale = action.payload.scale;
      state.position = action.payload.position;
    },
  },
});

export const { setMapData, setNodes, setEdges, setMapImage, updateNode, updateTransform } =
  mapSlice.actions;

export default mapSlice.reducer;
