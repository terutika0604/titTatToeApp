import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// SquareはBoard コンポーネントから値を受け取って、クリックされた時はそのことを Board コンポーネントに伝えるだけ。自分の state を持たない
// →クラスから関数コンポーネントに書き換え
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// ゲームの状態を各 Square の代わりに親の Board コンポーネントで保持する
class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     // Squareの状態を表す配列
  //     squares: Array(9).fill(null),
  //     // どちらのプレーヤの手番なのかを決める
  //     xIsNext: true,
  //   };
  // }

  // handleClick(i) {
  //   // stateの値はsetStateで書き換えるため一旦別の別配列に置き換える
  //   // →巻き戻しができる「タイムトラベル」機能を実装するため
  //   const squares = this.state.squares.slice();

  //   // 勝敗がついているときorすでに記号が書き込まれてるときは早期にリターン
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }

  //   // そして別配列書き換え
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   // そして別配列の値を反映
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  // →Gameに移行

  renderSquare(i) {
    return (
      <Square
        // それぞれの個別の Square に現在の値（'X'、'O' または null）を伝える
        // value={this.state.squares[i]}

        // 親からpropsで受け取るに変更
        value={this.props.squares[i]}


        // state はコンポーネント内でプライベートなものなので、Square から Board の state を直接書き換えることはできない
        // Board から Square に関数を渡す
        // onClick={() => this.handleClick(i)}

        // 親からpropsで受け取るに変更
        onClick={() => this.props.onClick(i)}
      />
      );
  }

  render() {
    // 勝敗を表示。それ以外は次のプレイヤー表示
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    // →Gameに移行

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        {/* →Gameに移行 */}

        <div className="board-row">
        {/* それぞれの Square に props を渡す */}
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
      // 各番手の配列を格納する配列
      history: [{
        squares: Array(9).fill(null),
      }],
      // 今何番手を見ているかを表す
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // historyの更新時移行の履歴をリセットする
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // 勝敗がついているときorすでに記号が書き込まれてるときは早期にリターン
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // そして別配列書き換え
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // そして別配列の値を反映
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // stepNumber の値が偶数だった場合は xIsNext を true 
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // stateを直接変更せず、別の配列にしてあつかう
    const history = this.state.history;
    // 現在見ている番手の配列を格納
    const current = history[this.state.stepNumber];
    // 現在見ている番手の勝敗を格納
    const winner = calculateWinner(current.squares);

    // 過去の配列へのリンク
    const moves = history.map((step, move) => {
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
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// 勝敗を判断する関数
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}