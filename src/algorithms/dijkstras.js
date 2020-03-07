export function dijkstras(grid, startNode, endNode) {
  let visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
  //Set the start node distance to 0 while the rest of the nodes have a distance
  //of Infinity
  startNode.distance = 0;
  //startNode.isVisited = true;

  while (unvisitedNodes.length !== 0) {
    sortNodes(unvisitedNodes);
    let nextNode = unvisitedNodes.shift();
    //console.log("nextNode:", nextNode);

    if (nextNode.isWall) continue;
    if (nextNode.distance === Infinity) return visitedNodesInOrder;
    nextNode.isVisited = true;
    visitedNodesInOrder.push(nextNode);
    if (nextNode === endNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(nextNode, grid);
  }

  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(currentNode, grid) {
  let unvisitedNeighbors = getUnvisitedNeigbors(currentNode, grid);
  //console.log("unvisitedNeighbors:", unvisitedNeighbors);
  for (let i = 0; i < unvisitedNeighbors.length; i++) {
    unvisitedNeighbors[i].distance = currentNode.distance + 1;
    unvisitedNeighbors[i].prevNode = currentNode;
  }
}

function getUnvisitedNeigbors(currentNode, grid) {
  const { row, col } = currentNode;
  let unvisitedNeighbors = [];
  if (row > 0) unvisitedNeighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) unvisitedNeighbors.push(grid[row + 1][col]);
  if (col > 0) unvisitedNeighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) unvisitedNeighbors.push(grid[row][col + 1]);
  return unvisitedNeighbors.filter(node => !node.isVisited && !node.isWall);
}

function sortNodes(nodes) {
  nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
  let unvisitedNodes = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      unvisitedNodes.push(grid[i][j]);
    }
  }
  return unvisitedNodes;
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
