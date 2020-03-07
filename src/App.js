import React, { Component } from "react";
import "./App.css";
import Node from "./components/node.jsx";
import { dijkstras, getShortestPath } from "./algorithms/dijkstras.js";
import { dfsAlgorithm } from "./algorithms/depthFirst.js";
import { bfsAlgorithm } from "./algorithms/breadthFirst.js";
import { aStarAlgorithm } from "./algorithms/aStar.js";

/* CONSTANTS FOR BOARD DIMMENSIONS */ 
const NUM_COLS = 50;
const NUM_ROWS = 20;
const START_POS = [10, 4];
const END_POS = [10, 45];


class App extends Component {
  state = {
    algoToRun: "None",
    graph: [],
    mouseClicked: false
  };

  componentDidMount() {
    /* tempGraph => [ [{}, {}, {}, ...], [{}, {}, {}, ...], ...] */
    let tempGraph = initGraph();
    this.setState({ graph: tempGraph });
  }

  setAlgoState = event => {
    /*Sets the algorithm to currently run (i.e. algoToRun)*/
    let buttonClicked = event.target.getAttribute("value");
    //this.componentDidMount();
    //this.clearGrid();

    this.clearSearch();
    //Run Dijkstra's
    if (buttonClicked === "alg-1") {
      this.dijkstrasAlg();
    }
    //Run Depth First Search
    else if (buttonClicked === "alg-2") {
      this.depthFirstSearch();
    }
    //Run Breadth First Search
    else if (buttonClicked === "alg-3") {
      this.breadthFirstSearch();
    }
    //Run A*
    else if (buttonClicked === "alg-4") {
      this.aStarSearch();
    }
    const { algoToRun } = this.state;
    this.setState({ algoToRun: buttonClicked });
  };

  clearSearch = () => {
    const { graph } = this.state;
    let newGraph = initGraph();
    initGraphWithWalls(graph, newGraph);
    var nodesDivs = document.getElementsByClassName("node");
    for (let i = 0; i < nodesDivs.length; i++) {
      if (nodesDivs[i].classList.contains("node-wall")) continue;
      else if (
        nodesDivs[i].classList.contains("node-start") ||
        nodesDivs[i].classList.contains("node-finish")
      ) {
        //Remove 'node-visited' and 'node-shortest-path'
        let extraClass1 = nodesDivs[i].classList[2];
        let extraClass2 = nodesDivs[i].classList[3];
        nodesDivs[i].classList.remove(extraClass1);
        nodesDivs[i].classList.remove(extraClass2);
      } else {
        nodesDivs[i].classList = "node ";
      }
    }
    this.setState({ graph: newGraph });
  };

  clearGrid = () => {
    /* This function will reset the grid (i.e. remove all of the visited nodes, walls, and shortest path)*/
    const { graph } = this.state;
    //Get initial graph with initial nodes
    let newGraph = initGraph();
    var nodesDivs = document.getElementsByClassName("node");
    for (let i = 0; i < nodesDivs.length; i++) {
      //Remove the extra classes that are not ['node', 'node-start', 'node-finish']
      if (
        nodesDivs[i].classList.contains("node-start") ||
        nodesDivs[i].classList.contains("node-finish")
      ) {
        //Remove 'node-visited' and 'node-shortest-path'
        let extraClass1 = nodesDivs[i].classList[2];
        let extraClass2 = nodesDivs[i].classList[3];
        nodesDivs[i].classList.remove(extraClass1);
        nodesDivs[i].classList.remove(extraClass2);
      }
      //Set classList of each node to 'node', thus resetting the grid
      else {
        nodesDivs[i].classList = "node ";
      }
    }
    this.setState({ graph: newGraph });
  };

  generateSimpleMaze = () => {
    //Clear visited nodes yet retain the current walls on the grid
    this.clearSearch();

    const { graph } = this.state;
    let newGrid = initGraph();

    addSparseWalls(newGrid);

    this.setState({ graph: newGrid });
    //console.log("newGrid", newGrid);
  };

  generateMaze = () => {
    this.clearSearch();
    const { graph } = this.state;
    let newGrid = initGraph();

    blockedGrid(newGrid);
    this.setState({ graph: newGrid });
  };

  handleMouseDown(row, col) {
    let newGraph = addNewWallToGrid(this.state.graph, row, col);
    this.setState({ graph: newGraph, mouseClicked: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseClicked) return;
    let newGraph = addNewWallToGrid(this.state.graph, row, col);
    this.setState({ graph: newGraph });
  }

  handleMouseUp() {
    this.setState({ mouseClicked: false });
  }

  /*
  toggleButtonClass(event) {
    this.clearGrid();
    if (event.target.classList.contains("btnDown")) {
      event.target.classList.remove("btnDown");
    } else {
      event.target.classList.add("btnDown");
    }
  }
  */

  animateDepthFirst(visitedNodesInOrder, shortestPath) {
    console.log("animating DFS");
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className +=
          " node-visited";
      }, 10 * i);
    }
  }

  animateDijkstra(visitedNodesInOrder, shortestPath) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      //Once all of the nodes have been animated, animate the shortest path
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }
      /*
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
      */
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        //console.log("node:", node);
        document.getElementById(`node-${node.row}-${node.col}`).className +=
          " node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      /*
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
      */
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className +=
          " node-shortest-path";
      }, 50 * i);
    }
  }

  dijkstrasAlg() {
    let { graph } = this.state;
    let startNode = graph[START_POS[0]][START_POS[1]];
    let endNode = graph[END_POS[0]][END_POS[1]];
    let visitedNodesInOrder = dijkstras(graph, startNode, endNode);
    let shortestPath = getShortestPath(endNode);
    this.animateDijkstra(visitedNodesInOrder, shortestPath);
  }

  depthFirstSearch() {
    let { graph } = this.state;
    let startNode = graph[START_POS[0]][START_POS[1]];
    let endNode = graph[END_POS[0]][END_POS[1]];
    let stack = [];
    let visitedNodesInOrder = [];
    dfsAlgorithm(startNode, endNode, stack, graph, visitedNodesInOrder);
    let shortestPath = getShortestPath(endNode);
    this.animateDepthFirst(visitedNodesInOrder, shortestPath);
  }

  breadthFirstSearch() {
    const { graph } = this.state;
    let startNode = graph[START_POS[0]][START_POS[1]];
    let endNode = graph[END_POS[0]][END_POS[1]];
    let visitedNodesInOrder = bfsAlgorithm(startNode, endNode, graph);
    let shortestPath = getShortestPath(endNode);
    this.animateDepthFirst(visitedNodesInOrder, shortestPath);
  }

  aStarSearch() {
    const { graph } = this.state;
    let startNode = graph[START_POS[0]][START_POS[1]];
    let endNode = graph[END_POS[0]][END_POS[1]];

    //Initialize the 'heuristicCost' of each node because currently it is INIFINITY for each one of them
    calcManhattanDistance(graph);

    let visitedNodesInOrder = aStarAlgorithm(startNode, endNode, graph);
    let shortestPath = getShortestPath(endNode);
    this.animateDijkstra(visitedNodesInOrder, shortestPath);
    console.log("visitedNodesInOrder: ", visitedNodesInOrder);
  }

  render() {
    const { mouseClicked } = this.state;
    return (
      <React.Fragment>
        <div className="h4 page-header">visualIZE</div>
        <div className="text-center">
          <div className="act-buttons btn-group" role="group">
            <div className="text-left">
              <button
                type="button"
                onClick={this.clearSearch}
                className="btn btn-outline-warning clear-grid-btn"
              >
                Clear Search
              </button>
              <button
                className="btn btn-outline-danger clear-grid-btn"
                onClick={this.clearGrid}
              >
                Clear Grid
              </button>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sp"
              onClick={this.generateSimpleMaze}
            >
              Sparse Maze
            </button>
            <div className="btn-group top-button" role="group">
              <button
                id="btnGroupDrop1"
                type="button"
                className="dropdown-btn btn btn-secondary dropdown-toggle btn-sp"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Algorithms
              </button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <button
                  value="alg-1"
                  className="dropdown-item"
                  onClick={this.setAlgoState}
                >
                  Dijkstra's
                </button>
                <button
                  value="alg-3"
                  className="dropdown-item"
                  onClick={this.setAlgoState}
                >
                  Breadth-First
                </button>
                <button
                  value="alg-2"
                  className="dropdown-item"
                  onClick={this.setAlgoState}
                >
                  Depth-First
                </button>
                <button
                  value="alg-4"
                  className="dropdown-item"
                  onClick={this.setAlgoState}
                >
                  A-Star
                </button>
              </div>
            </div>
          </div>
        </div>
        <main className="grid">
          {this.state.graph.map((row, rowIndex) => {
            //For every array (i.e. row) render a div that will contain the columns (i.e. Nodes)
            return (
              <div key={rowIndex}>
                {row.map((node, nodeIndex) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIndex}
                      row={row}
                      mouseClicked={mouseClicked}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    />
                  );
                })}
              </div>
            );
          })}
        </main>
      </React.Fragment>
    );
  }
}

const initGraphWithWalls = (currentGraph, newGraph) => {
  /*Takes two grids, iterates over current grid and retrieves the indexes of the nodes that are walls. 
  These indexes are then used on the new grid to set the walls*/
  for (let i = 0; i < currentGraph.length; i++) {
    for (let j = 0; j < currentGraph[i].length; j++) {
      if (currentGraph[i][j].isWall) {
        newGraph[i][j].isWall = true;
      }
    }
  }
};

const initGraph = () => {
  /*Initializes the graph to an array of arrays (i.e. graph)*/
  var tempGraph = [];

  for (let i = 0; i < NUM_ROWS; i++) {
    let row = [];
    for (let j = 0; j < NUM_COLS; j++) {
      row.push(createNode(i, j));
    }
    tempGraph.push(row);
  }
  return tempGraph;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isWall: false,
    isVisited: false,
    isStart: row === START_POS[0] && col === START_POS[1],
    isFinish: row === END_POS[0] && col === END_POS[1],
    distance: Infinity,
    prevNode: null,
    heuristicCost: Infinity,
    totalDistance: Infinity
  };
};

const calcManhattanDistance = graph => {
  let goal_x = END_POS[0];
  let goal_y = END_POS[1];

  for (let x = 0; x < graph.length; x++) {
    for (let y = 0; y < graph[x].length; y++) {
      let h = Math.abs(x - goal_x) + Math.abs(y - goal_y);
      graph[x][y].heuristicCost = h;
    }
  }
};

const addNewWallToGrid = (graph, row, col) => {
  let graphCopy = graph.slice(); //Make a shallow copy of the graph
  let node = graphCopy[row][col]; //Extract node clicked
  let newNode = {
    ...node, //Spread operator (...) to copy properties of the node object
    isWall: !node.isWall //Negate the property
  };

  graphCopy[row][col] = newNode; //Add the updated node back to the new graph
  return graphCopy;
};

const blockedGrid = graph => {
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      if (
        (i === START_POS[0] && j === START_POS[1]) ||
        (j === END_POS[0] && j === END_POS[1])
      )
        continue;
      graph[i][j].isWall = true;
    }
  }
};

const addSparseWalls = graph => {
  let x, y; //node_id;

  let numbers = [...Array(165)].map(() => [
    Math.floor(Math.random() * NUM_ROWS),
    Math.floor(Math.random() * NUM_COLS)
  ]);

  for (let i = 0; i < numbers.length; i++) {
    x = numbers[i][0];
    y = numbers[i][1];

    if (
      (x === START_POS[0] && y === START_POS[1]) ||
      (x === END_POS[0] && y === END_POS[1])
    )
      continue;

    graph[x][y].isWall = true;
    //node_id = "node-" + String(x) + "-" + String(y);
    //var element = document.getElementById(node_id);
    //element.classList += "node-wall";
  }
};
export default App;
