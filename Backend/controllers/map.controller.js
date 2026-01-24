import { readData, writeData } from '../utils/fileHandler.js';
import { v4 as uuidv4 } from 'uuid';
import { findPath } from '../services/pathfinding.service.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const getMap = async (req, res) => {
  try {
    const maps = await readData();
    const { id } = req.params;

    if (id) {
      const map = maps.find((m) => m.id === id);
      if (map) {
        return res.json(map);
      } else {
        return res.status(404).json({ message: 'Map not found' });
      }
    }

    res.json(maps);
  } catch (error) {
    res.status(500).json({ message: 'Error reading map data' });
  }
};

export const saveMap = async (req, res) => {
  try {
    // Check if bulk save (Array)
    if (Array.isArray(req.body)) {
      const existingMaps = await readData();
      const incomingMaps = req.body;

      // Merge strategy: Update existing maps or add new ones
      const mergedMaps = [...existingMaps];

      incomingMaps.forEach((incomingMap) => {
        const existingIndex = mergedMaps.findIndex((m) => m.id === incomingMap.id);
        if (existingIndex > -1) {
          // Update existing map
          mergedMaps[existingIndex] = incomingMap;
        } else {
          // Add new map
          mergedMaps.push(incomingMap);
        }
      });

      await writeData(mergedMaps);
      return res.json({ message: 'Maps saved successfully', maps: mergedMaps });
    }

    const { id, name, nodes, edges, mapImage, pois, visualGuidance, infoBubbles } = req.body;
    let maps = await readData();

    if (id) {
      // Update existing map
      const mapIndex = maps.findIndex((m) => m.id === id);
      if (mapIndex > -1) {
        maps[mapIndex] = {
          ...maps[mapIndex],
          name: name || maps[mapIndex].name,
          nodes: nodes || maps[mapIndex].nodes,
          edges: edges || maps[mapIndex].edges,
          mapImage: mapImage || maps[mapIndex].mapImage,
          pois: pois || maps[mapIndex].pois,
          visualGuidance: visualGuidance || maps[mapIndex].visualGuidance,
          infoBubbles: infoBubbles || maps[mapIndex].infoBubbles,
        };
        await writeData(maps);
        return res.json({ message: 'Map updated successfully', map: maps[mapIndex] });
      } else {
        // If ID provided but not found, treat as new map with that ID?
        // Or just create new. Let's create new to be safe, or error.
        // Existing logic returned 404. Let's stick to that for single update.
        return res.status(404).json({ message: 'Map not found for update' });
      }
    } else {
      // Create new map
      const newMap = {
        id: uuidv4(),
        name: name || 'New Map',
        nodes: nodes || [],
        edges: edges || [],
        mapImage: mapImage || null,
        pois: pois || [],
        visualGuidance: visualGuidance || [],
        infoBubbles: infoBubbles || [],
      };
      maps.push(newMap);
      await writeData(maps);
      return res.json({ message: 'Map created successfully', map: newMap });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving map data' });
  }
};

export const getRoute = async (req, res) => {
  try {
    const { startNodeId, endNodeId, mapId } = req.query;
    const maps = await readData();
    const targetMap = maps.find((m) => m.id === mapId);

    if (!targetMap) {
      return res.status(404).json({ message: 'Map not found for route calculation' });
    }

    const path = findPath(startNodeId, endNodeId, targetMap);

    if (path.length > 0) {
      res.json({ path });
    } else {
      res.status(404).json({ message: 'No path found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error calculating route' });
  }
};

export const uploadMapImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using buffer from multer memory storage
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'pathpulse/maps', // Organize uploads in a folder
        resource_type: 'auto', // Automatically detect file type
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
        }

        // Return the secure URL from Cloudinary
        res.json({ imageUrl: result.secure_url });
      }
    );

    // Pipe the file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

export const deleteMap = async (req, res) => {
  try {
    const { id } = req.params;
    const maps = await readData();

    const mapIndex = maps.findIndex((m) => m.id === id);
    if (mapIndex === -1) {
      return res.status(404).json({ message: 'Map not found' });
    }

    // Remove the map
    maps.splice(mapIndex, 1);
    await writeData(maps);

    res.json({ message: 'Map deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting map' });
  }
};
