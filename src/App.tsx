import * as React from 'react';
import './App.css';

interface SquareProps {
  value: string;
  onClick: () => void;
}

interface SquareState {
  value: string | null;
}

class Square extends React.Component<SquareProps, SquareState> {
  constructor(props: SquareProps) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
}

interface BoardState {
  squares: (string | null)[];
}

class Board extends React.Component<BoardProps, BoardState> {
  renderSquare(i: number) {
    return (
      <Square 
        value={this.props.squares[i]!}
        onClick={() => this.props.onClick(i)}
      />);
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

interface GameProps {}

interface GameState {
  history: BoardState[];
  xIsNext: boolean;
  stepsNumber: number;
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepsNumber: 0,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepsNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((steps, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  private jumpTo(step: number) {
    this.setState({
      stepsNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  private handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepsNumber + 1);
    const current = history[this.state.stepsNumber];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepsNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  private calculateWinner(squares: (string | null)[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  }
}

export { Game as App };
