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
    if (Array.isArray(req.body)) {
      const existingMaps = await readData();
      const incomingMaps = req.body;
      const mergedMaps = [...existingMaps];

      incomingMaps.forEach((incomingMap) => {
        const existingIndex = mergedMaps.findIndex((m) => m.id === incomingMap.id);
        if (existingIndex > -1) {
          mergedMaps[existingIndex] = incomingMap;
        } else {
          mergedMaps.push(incomingMap);
        }
      });

      await writeData(mergedMaps);
      return res.json({ message: 'Maps saved successfully', maps: mergedMaps });
    }

    const { id, name, nodes, edges, mapImage, pois, visualGuidance, infoBubbles } = req.body;
    let maps = await readData();

    if (id) {
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
        return res.status(404).json({ message: 'Map not found for update' });
      }
    } else {
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

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'pathpulse/maps',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
        }

        res.json({ imageUrl: result.secure_url });
      }
    );

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

    maps.splice(mapIndex, 1);
    await writeData(maps);

    res.json({ message: 'Map deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting map' });
  }
};
