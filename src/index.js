import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" style={{backgroundColor: props.bgcolor}} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} bgcolor={this.props.bgcolors[i]} onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    let table = [];
    let row = [];
    let squareIndex = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(squareIndex++));
      }
      table.push(<div className="board-row" key={i}>{row}</div>);
      row = [];
    }
    return (
      <div>{table}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        bgcolors: Array(9).fill("rgb(147, 198, 211)"),
        row: -1,
        col: -1,
      }],
      stepNum: 0,
      xIsNext: true,
      sortAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const bgcolors = current.bgcolors.slice();
    
    if (getWinningLine(squares) || isGameOver(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        bgcolors: bgcolors,
        row: getRowFromCell(i),
        col: getColFromCell(i),
      }]),
      stepNum: history.length,
      xIsNext: !this.state.xIsNext,
    });

    const winningLine = getWinningLine(squares);
    if (winningLine) {
      winningLine.forEach(element => {
        bgcolors[element] = "yellow";
      });

      this.setState({
        bgcolors: bgcolors,
      });
    }
  }

  handleReset() {
    this.setState(
      {
        history: [{
          squares: Array(9).fill(null),
          bgcolors: Array(9).fill("rgb(147, 198, 211)"),
          row: -1,
          col: -1,
        }],
        stepNum: 0,
        xIsNext: true,
        sortAsc: true,
      }
    )
  }

  handleToggleSort() {
    this.setState(
      {
        sortAsc: !this.state.sortAsc,
      }
    );
  }

  jumpTo(step) {
    this.setState(
      {
        stepNum: step,
        xIsNext: (step % 2 === 0),
      }
    )
  }

  render() {
    const history = this.state.sortAsc ? this.state.history : this.state.history.slice().reverse();
    const current = history[this.state.sortAsc ? this.state.stepNum : history.length - this.state.stepNum - 1];
    const winningLine = getWinningLine(current.squares);
    const gameOver = isGameOver(current.squares);
    const moves = history.map((hist, step) => {
      const realStep = this.state.sortAsc ? step : history.length - step - 1;
      const desc = 
        realStep 
          ? 'Go to move #' + realStep + ' | ' + ((realStep % 2) === 0 ? 'O' : 'X') + ' (' + hist.row + ', ' + hist.col + ')'
          : 'Go to game start';

      if (realStep === this.state.stepNum) {
        return (
          <li key={realStep}>
            <button onClick={() => this.jumpTo(realStep)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={realStep}>
            <button onClick={() => this.jumpTo(realStep)}>{desc}</button>
          </li>
        );
      }
    });

    let status;
    if (winningLine) {
      status = current.squares[winningLine[0]] + ' wins!';
    } else if (gameOver) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let sortOrder = 'Sort History ' + (this.state.sortAsc ? '(↓)' : '(↑)');
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} bgcolors={current.bgcolors} onClick={(i) => this.handleClick(i)}/>
          <div className="controls-row">
            <button onClick={() => this.handleReset()}>
              Reset Game
            </button>
            <button onClick={() => this.handleToggleSort()}>
              {sortOrder}
            </button>
          </div>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

/**
 * Main React app routine
 */

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

/**
 * Helper functions
 */

function getRowFromCell(i) {
  return Math.floor(i / 3) + 1;
}

function getColFromCell(i) {
  return i % 3 + 1;
}

function isGameOver(squares) {
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      return false;
    }
  }

  return true;
}

function getWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }

  return null;
}
