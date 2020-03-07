export function aStarAlgorithm(startNode, endNode, graph) {
  //A Star uses a priority queue where nodes are explored based on their "cost"
  //cost = F(n) = H(n) + G(n) (where H is the heuristic and G is the actual cost of the path)
  //For the heuristic we can use the Manhattan Distance to derive a cost
  let visitedNodesInOrder = [];
  let unvisitedNodes = [];
  let neighbors;
  let pathCost;

  startNode.distance = 0;
  startNode.totalDistance = 0 + startNode.heuristicCost;

  unvisitedNodes.push(startNode);
  console.log("startNode: ", startNode);

  let max_iterations = 1;

  while (unvisitedNodes.length !== 0 && max_iterations <= 10000) {
    console.log("Iteration #: ", max_iterations);
    sortNodes(unvisitedNodes);
    console.log("unvisitedNodes: ", unvisitedNodes);
    let currentNode = unvisitedNodes.shift();
    console.log("currentNode: ", currentNode);
    if (currentNode.isWall) continue;
    if (currentNode === endNode) return visitedNodesInOrder;

    neighbors = getAdjacentNodes(currentNode, graph);
    for (let i = 0; i < neighbors.length; i++) {
      pathCost = Math.floor(Math.random() * 20);
      neighbors[i].distance = currentNode.distance + 1;
      neighbors[i].prevNode = currentNode;
      neighbors[i].totalDistance =
        neighbors[i].distance + neighbors[i].heuristicCost;

      console.log("neighbor", i, ": ", neighbors[i]);
      if (containsNode(neighbors[i], unvisitedNodes) === false) {
        unvisitedNodes.push(neighbors[i]);
      }
    }

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    max_iterations++;
  }
  return visitedNodesInOrder;
}

function sortNodes(queue) {
  queue.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
  queue.sort((nodeA, nodeB) => nodeA.heuristicCost - nodeB.heuristicCost);
  //queue.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(graph) {
  let nodes = [];
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      nodes.push(graph[i][j]);
    }
  }
  return nodes;
}

function containsNode(node, unvisitedNodes) {
  const { row, col } = node;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (unvisitedNodes[i].row === row && unvisitedNodes[i].col === col) {
      return true;
    }
  }
  return false;
}

function getAdjacentNodes(currentNode, graph) {
  let neighbors = [];
  const { row, col } = currentNode;
  if (col < graph[0].length - 1) neighbors.push(graph[row][col + 1]);
  if (col > 0) neighbors.push(graph[row][col - 1]);
  if (row > 0) neighbors.push(graph[row - 1][col]);
  if (row < graph.length - 1) neighbors.push(graph[row + 1][col]);

  return neighbors.filter(node => !node.isWall && !node.isVisited);
}

export function getShortestPath(endNode) {
  let pathOrder = [];
  let currentNode = endNode;

  while (currentNode !== null) {
    pathOrder.unshift(currentNode);
    currentNode = currentNode.prevNode;
  }

  return pathOrder;
}
