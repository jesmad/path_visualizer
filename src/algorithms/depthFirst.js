export function dfsAlgorithm(currentNode, endNode, stack, graph, visitedNodes) {
  console.log("currentNode:", currentNode);
  if (currentNode == null) return false;
  let nodeNeighbors = getAdjacentNodes(currentNode, graph);
  currentNode.isVisited = true;
  visitedNodes.push(currentNode);
  let nextNode;

  console.log("stack:", stack);
  console.log("nodeNeighbors:", nodeNeighbors);
  if (currentNode.isFinish) {
    //console.log("found the endNode!!!");
    return true;
  }
  if (nodeNeighbors.length === 0) {
    //Backtrack
    if (stack.length === 0) return false;
    nextNode = stack.shift();
    dfsAlgorithm(nextNode, endNode, stack, graph, visitedNodes);
  }

  //Explore one of the neighboring nodes
  if (nodeNeighbors.length > 1) {
    console.log("Added to stack:", currentNode);
    stack.unshift(currentNode);
  }
  //visitedNodes.push(currentNode);
  nextNode = nodeNeighbors.shift();
  console.log("nextNode:", nextNode);
  if (nextNode == null) {
  } else {
    nextNode.prevNode = currentNode;
  }

  dfsAlgorithm(nextNode, endNode, stack, graph, visitedNodes);
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
  let currentNode = endNode;
  let shortestPath = [];

  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.prevNode;
  }

  return shortestPath;
}
