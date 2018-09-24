import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: null,
//     };
//   }

//   toggleState() {
//     if (this.state.value === 'X') {
//       this.setState({ value: null })
//     } else {
//       this.setState({ value: 'X' })
//     }
//   }

//   render() {
//     return (
//         <button className="square" onClick={() => this.props.onClick() /*() => this.setState({ value: 'X' })*/ /*this.toggleState()*/ /*alert(this.props.value)*/}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  /*
  handleClick(i) {
    const squares = this.state.squares.slice();

    if (squares[i] || determineWinner(squares) || isGameOver(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
  }
  
  reset() {
    this.setState({ squares: Array(9).fill(null), xIsNext: true });
  }
  */

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i) /*this.handleClick(i)*/}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
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

    if (determineWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: this.getRowFromStep(i),
        col: this.getColFromStep(i),
      }]),
      stepNum: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleReset() {
    this.setState(
      {
        history: [{
          squares: Array(9).fill(null),
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

    //this.render();
  }

  jumpTo(step) {
    this.setState(
      {
        stepNum: step,
        xIsNext: (step % 2 === 0),
      }
    )
  }

  getRowFromStep(i) {
    return Math.floor(i/3) + 1;
  }

  getColFromStep(i) {
    return i % 3 + 1;
  }

  render() {
    const history = this.state.sortAsc ? this.state.history : this.state.history.slice().reverse();
    const current = history[this.state.sortAsc ? this.state.stepNum : history.length - this.state.stepNum - 1];
    const winner = determineWinner(current.squares);
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
    if (winner) {
      status = 'The winner is: ' + winner;
    } else if (gameOver) {
      status = 'Game over!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let sortOrder = 'Move history ' + (this.state.sortAsc ? '(↓)' : '(↑)');
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function isGameOver(squares) {
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      return false;
    }
  }

  return true;
}

function determineWinner(squares) {
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
      return squares[a];
    }
  }

  return null;
}
