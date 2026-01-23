class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(item, priority) {
    this.elements.push({ item, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift().item;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

export const findPath = (startNodeId, endNodeId, mapData) => {
  const { nodes, edges } = mapData;

  // Create adjacency list
  const adjacencyList = {};
  nodes.forEach((node) => {
    adjacencyList[node.id] = [];
  });

  edges.forEach((edge) => {
    if (adjacencyList[edge.from] && adjacencyList[edge.to]) {
      adjacencyList[edge.from].push({ to: edge.to, weight: edge.distance });
      // Assuming undirected graph for walking
      adjacencyList[edge.to].push({ to: edge.from, weight: edge.distance });
    }
  });

  const pq = new PriorityQueue();
  pq.enqueue(startNodeId, 0);

  const cameFrom = {};
  const costSoFar = {};
  cameFrom[startNodeId] = null;
  costSoFar[startNodeId] = 0;

  while (!pq.isEmpty()) {
    const current = pq.dequeue();

    if (current === endNodeId) {
      break;
    }

    if (!adjacencyList[current]) continue;

    adjacencyList[current].forEach((neighbor) => {
      const newCost = costSoFar[current] + neighbor.weight;
      if (!(neighbor.to in costSoFar) || newCost < costSoFar[neighbor.to]) {
        costSoFar[neighbor.to] = newCost;
        // Priority = newCost (Dijkstra) + heuristic (A*)
        // For now, heuristic is 0 (Dijkstra) as we haven't implemented Euclidean distance calculation yet
        // because we'd need to look up node x/y coordinates.
        // But edge weights are explicitly defined, so this is correct for graph traversal.
        pq.enqueue(neighbor.to, newCost);
        cameFrom[neighbor.to] = current;
      }
    });
  }

  // Reconstruct path
  if (!(endNodeId in cameFrom)) {
    return []; // No path found
  }

  const path = [];
  let current = endNodeId;
  while (current !== null) {
    // Find the full node object
    const nodeObj = nodes.find((n) => n.id === current);
    if (nodeObj) {
      // Check if there is visual guidance for this node
      // We attach it here so the frontend gets it easily
      const guidance = mapData.visualGuidance?.find((vg) => vg.nodeId === current);
      path.push({ ...nodeObj, visualGuidance: guidance || null });
    }
    current = cameFrom[current];
  }

  return path.reverse();
};
