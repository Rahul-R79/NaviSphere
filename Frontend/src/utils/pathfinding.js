// Dijkstra's Algorithm
export const findPath = (nodes, edges, startNodeId, endNodeId) => {
  if (!nodes || !edges || !startNodeId || !endNodeId) return null;

  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const nodesMap = {};

  // Initialize
  nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
    nodesMap[node.id] = node;
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find node with smallest distance
    let minNodeId = null;
    let minDist = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDist) {
        minDist = distances[nodeId];
        minNodeId = nodeId;
      }
    }

    if (minNodeId === null || minNodeId === endNodeId) {
      break; // Target reached or no path
    }

    unvisited.delete(minNodeId);

    // Get neighbors
    const neighbors = edges.filter((e) => e.from === minNodeId || e.to === minNodeId);

    neighbors.forEach((edge) => {
      const neighborId = edge.from === minNodeId ? edge.to : edge.from;
      if (unvisited.has(neighborId)) {
        // Calculate new distance
        // Use edge weight or distance if available
        let weight = edge.weight || edge.distance || 1;

        // If weight/distance wasn't pre-calculated, calculate it now
        if (!edge.weight && !edge.distance && nodesMap[minNodeId] && nodesMap[neighborId]) {
          const n1 = nodesMap[minNodeId];
          const n2 = nodesMap[neighborId];

          if (
            n1.lat !== undefined &&
            n1.lng !== undefined &&
            n2.lat !== undefined &&
            n2.lng !== undefined
          ) {
            // Simple Euclidean for visual distance on map (approximate)
            // For more meaningful real-world distance, Haversine would be better,
            // but for pathfinding on a small campus map, Euclidean on lat/lng is okay for graph traversal weights
            // roughly provided scaling is uniform.
            // However, let's keep it consistent.
            const dLat = n1.lat - n2.lat;
            const dLng = n1.lng - n2.lng;
            weight = Math.sqrt(dLat * dLat + dLng * dLng);
          } else if (
            n1.x !== undefined &&
            n1.y !== undefined &&
            n2.x !== undefined &&
            n2.y !== undefined
          ) {
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            weight = Math.sqrt(dx * dx + dy * dy);
          }
        }

        const alt = distances[minNodeId] + weight;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = minNodeId;
        }
      }
    });
  }

  // Reconstruct path
  const path = [];
  let current = endNodeId;

  // Check if end is reachable
  if (distances[endNodeId] === Infinity) return null;

  while (current !== null) {
    if (nodesMap[current]) {
      path.unshift(nodesMap[current]);
    }
    current = previous[current];
  }

  return path;
};
