import React, { Component } from "react";

export default class SnakeGameView extends Component {
  handleClickStart = () => {
    this.props.start();
  };
  handleClickRestart = () => {
    this.props.init();
    this.props.updateTable();
    this.props.start();
  };
  render() {
    const { gameState, table, onKeyPressed, logic } = this.props;
    return (
      <div
        className={`game ${gameState === "end" ? "end" : ""}`}
        onKeyDown={onKeyPressed}
        tabIndex="0"
      >
        <div className="table">
          {table.map((cols, colIndex) => (
            <div className="table__row" key={colIndex}>
              {cols.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`table__cell ${
                    cell === "joint" ? "joint" : cell === "fruit" ? "fruit" : ""
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="description">
          {gameState === "end" ? (
            <div>
              <span>기록: {logic.joints.length}</span>
              <button
                className="button restart-button"
                onClick={this.handleClickRestart}
              >
                다시 시작
              </button>
            </div>
          ) : gameState === "running" ? (
            <div>현재 길이: {logic.joints.length}</div>
          ) : (
            <button
              className="button start-button"
              onClick={this.handleClickStart}
            >
              게임 시작
            </button>
          )}
        </div>
      </div>
    );
  }
}
