import React, { Component } from "react";
import throttle from "lodash.throttle";
import { ROWS, COLS, INITIAL_DELAY, DELAY_EXPONENT } from "./config";
import SnakeGameLogic from "./SnakeGameLogic";
import SnakeGameView from "./SnakeGameView";

export default class SnakeGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: INITIAL_DELAY,
      gameState: null,
      table: new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null)),
      logic: new SnakeGameLogic(),
      timeoutID: null,
      intervalID: null
    };
    this.handleKeydown = throttle(this.handleKeydown.bind(this), 100);
    this.nextFrame = this.nextFrame.bind(this);
  }
  componentDidMount() {
    this.updateTable();
  }
  init = () => {
    const delay = INITIAL_DELAY;
    const table = new Array(ROWS)
      .fill(null)
      .map(() => new Array(COLS).fill(null));
    const logic = new SnakeGameLogic();
    this.setState({
      delay,
      table,
      logic
    });
  };
  updateTable = () => {
    const { logic, table } = this.state;
    const { joints, fruit: f } = logic;
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
    const intervalID = setInterval(() => {
      this.setState(prevState => ({
        delay: prevState.delay * DELAY_EXPONENT
      }));
    }, 1000);
    this.setState({
      intervalID
    });
    this.nextFrame();
  };
  handleKeydown = e => {
    const { logic } = this.state;
    switch (e.key) {
      case "ArrowUp":
        logic.up();
        this.nextFrame();
        break;
      case "ArrowDown":
        logic.down();
        this.nextFrame();
        break;
      case "ArrowLeft":
        logic.left();
        this.nextFrame();
        break;
      case "ArrowRight":
        logic.right();
        this.nextFrame();
        break;
      default:
        return;
    }
  };
  nextFrame = () => {
    const { timeoutID, logic } = this.state;
    clearTimeout(timeoutID);
    this.setState({
      timeoutID: null
    });
    const proceed = logic.nextState();
    if (!proceed) {
      this.setState({
        gameState: "end"
      });
      this.cleanup();
    } else {
      this.updateTable();
      const timeoutID = setTimeout(this.nextFrame, this.state.delay);
      this.setState({
        timeoutID
      });
    }
  };
  cleanup = () => {
    const { logic } = this.state;
    document.removeEventListener("keydown", this.handleKeydown);
    clearTimeout(this.state.timeoutID);
    clearInterval(this.state.intervalID);
    this.setState({
      timeoutID: null,
      intervalID: null
    });
    logic.cleanup && logic.cleanup();
  };
  render() {
    const { gameState, table, logic } = this.state;
    return (
      <SnakeGameView
        key={gameState}
        logic={logic}
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
