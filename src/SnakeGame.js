import React, { Component } from "react";
import throttle from "lodash.throttle";
import { ROWS, COLS, INITIAL_DELAY, DELAY_EXPONENT } from "./config";
import SnakeGameLogic from "./SnakeGameLogic";
import SnakeGameView from "./SnakeGameView";

export default class SnakeGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: null,
      table: new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null))
    };
    this.handleKeydown = throttle(this.handleKeydown.bind(this), 100);
    this.nextFrame = this.nextFrame.bind(this);
    this.delay = INITIAL_DELAY;
    this.timeoutID = null;
    this.intervalID = null;
    this.logic = new SnakeGameLogic();
  }
  componentDidMount() {
    this.updateTable();
  }
  init = () => {
    this.delay = INITIAL_DELAY;

    const table = new Array(ROWS)
      .fill(null)
      .map(() => new Array(COLS).fill(null));
    this.logic = new SnakeGameLogic();

    this.setState({
      table
    });
  };
  updateTable = () => {
    const { table } = this.state;
    const { joints, fruit: f } = this.logic;
    if (!joints || !f) return;
    for (let r of table) {
      r.fill(null);
    }
    if (f.y < table.length && f.x < table[f.y].length) {
      table[f.y][f.x] = "fruit";
    }
    for (let j of joints) {
      if (j.y < table.length && j.x < table[j.y].length) {
        table[j.y][j.x] = "joint";
      }
    }
    this.setState({
      table
    });
  };
  start = () => {
    // FIXME: '다시하기'를 두 번 클릭해야 다시 시작하는 오류 해결해야 함
    document.addEventListener("keydown", this.handleKeydown);
    this.setState({
      gameState: "running"
    });
    this.intervalID = setInterval(() => {
      this.delay *= DELAY_EXPONENT;
    }, 1000);
    this.nextFrame();
  };
  handleKeydown = e => {
    switch (e.key) {
      case "ArrowUp":
        this.logic.up();
        this.nextFrame();
        break;
      case "ArrowDown":
        this.logic.down();
        this.nextFrame();
        break;
      case "ArrowLeft":
        this.logic.left();
        this.nextFrame();
        break;
      case "ArrowRight":
        this.logic.right();
        this.nextFrame();
        break;
      default:
        return;
    }
  };
  nextFrame = () => {
    clearTimeout(this.timeoutID);
    const proceed = this.logic.nextState();
    if (!proceed) {
      this.setState({
        gameState: "end"
      });
      this.cleanup();
    } else {
      this.updateTable();
      this.timeoutID = setTimeout(this.nextFrame, this.delay);
    }
  };
  cleanup = () => {
    document.removeEventListener("keydown", this.handleKeydown);
    clearTimeout(this.timeoutID);
    clearInterval(this.intervalID);
  };
  render() {
    const { gameState, table } = this.state;
    return (
      <SnakeGameView
        key={this.logic}
        logic={this.logic}
        table={table}
        gameState={gameState}
        init={this.init}
        start={this.start}
        updateTable={this.updateTable}
        onKeyPressed={this.handleKeydown}
      />
    );
  }
}
