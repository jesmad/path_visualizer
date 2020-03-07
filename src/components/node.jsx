import React, { Component } from "react";
import "../styles/node.css";

class Node extends Component {
  getExtraNodeClassName(isStart, isFinish, isWall) {
    let name = "";
    if (isStart) {
      name += "node-start";
    } else if (isFinish) {
      name += "node-finish";
    } else if (isWall) {
      name += "node-wall";
    }
    return name;
  }

  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isWall,
      onMouseDown,
      onMouseUp,
      onMouseEnter
    } = this.props;

    const extraClass = this.getExtraNodeClassName(isStart, isFinish, isWall);
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClass}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp()}
        onMouseEnter={() => onMouseEnter(row, col)}
      ></div>
    );
  }
}

export default Node;
