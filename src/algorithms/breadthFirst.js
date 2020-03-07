export function bfsAlgorithm(startNode, endNode, graph) {
  let visitedNodesInOrder = [];
  let queue = [];
  let currentNode;
  let neighbors = getAdjacentNodes(startNode, graph);
  startNode.isVisited = true;
  startNode.distance = 0;
  updateVisitedNodes(startNode, neighbors);
  visitedNodesInOrder.push(startNode);
  queue = queue.concat(neighbors);
  let previousNode = startNode;

  while (queue.length !== 0) {
    currentNode = queue.shift();
    currentNode.isVisited = true;
    //Must update previousNode because currently it is not
    //keeping track of the shortest path
    //currentNode.prevNode = previousNode;
    //previousNode = currentNode;
    visitedNodesInOrder.push(currentNode);

    if (currentNode.isFinish) {
      console.log("Found the FINISH STATE");
      return visitedNodesInOrder;
    }

    neighbors = getAdjacentNodes(currentNode, graph);
    updateVisitedNodes(currentNode, neighbors);
    queue = queue.concat(neighbors);
  }

  return visitedNodesInOrder;
}

function updateVisitedNodes(currentNode, neighbors) {
  for (let i = 0; i < neighbors.length; i++) {
    neighbors[i].isVisited = true;
    neighbors[i].distance = currentNode.distance + 1;
    neighbors[i].prevNode = currentNode;
  }
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
