import React from 'react';
import ReactDom from 'react-dom';
import './index.css';


function calculateWinner(xIsNext, boardSize, valueToWin, squares, i) {
    const player = (xIsNext) ? "X" : "O";
    for(let k = 0; k < 4; k++) {
        let position = i;
        let intermecheckingTheValueToWin = 0;
        let multiplier = 1;
        let step = 0;
        let signRevers = 1;
        let limit = 0;
        let flag = true;
        while(intermecheckingTheValueToWin < valueToWin) {
            step = -(boardSize + 1) * signRevers;
            if(k === 0 && position + step >= limit && flag) {
                position += step * multiplier;
                if(squares[position] === player) {
                    intermecheckingTheValueToWin++;
                    multiplier++;
                    continue;
                } else {
                    signRevers = -1;
                    multiplier = 1;
                    limit = boardSize *boardSize - 1;
                    position = i;
                    flag = !flag;
                };
            };
            if(k === 0 && position + step <= limit && !flag) {
                position += step * multiplier;
                if(squares[position] === player) {
                    intermecheckingTheValueToWin++;
                    multiplier++;
                    continue;
                } else {
                    break;
                };
            } else {
                break;
            }
        };
        if(intermecheckingTheValueToWin === valueToWin) {
            return player;
        };
    };
    return null;
}
  

function Square(props) {
    return (
        <button className = "square" onClick = { props.onClick }>
            { props.value }
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return ( <Square
                    value={ this.props.squares[i] }
                    onClick = { () => { this.props.onClick(i) } }
                /> );
    }
    
    render() { // ************ Переделать на JSX. Родной ты на паре осознал, что передаются дивы в ОБЪЕКТАХ!!! ***************
        


        /* return (
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
        ); */
        
        const arr_answer = [];
        let summand = 0;
        let arr_row = [];
        for(let m = 0; m < this.props.boardSize * this.props.boardSize; m++) {
            arr_row[m + summand] = this.renderSquare(m + summand);
            //console.log(arr_row);
            if((m + 1) % this.props.boardSize === 0) {
                summand += m + 1;
                arr_row = [];
                arr_answer.push(React.createElement('div', {className : 'board-row'}, ...arr_row));
                //console.log(arr_answer);
            };
        };
        const board = React.createElement('div', null, ...arr_answer);
        return board;
    }
}

  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.boardSize = 5;
        this.quantityToWin = 4;
        this.winnerIs = {
            answer: false,
            data: null,
            lastWinner: null
        };
        this.state = {
            history: [{
                squares: Array(this.boardSize * this.boardSize).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = (!this.winnerIs.answer) ? calculateWinner(this.state.xIsNext, this.boardSize, this.quantityToWin, squares, i) : null;
        if(squares[i]) {
            return;
        } else if(winner) {
            this.winnerIs.answer = true;
            this.winnerIs.data = winner;
        } else {
            return;
        };
        squares[i] = this.state.xIsNext ? 'X' : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        if(step !== this.winnerIs.lastWinner) {
            this.winnerIs.answer = false;
            this.winnerIs.data = null;
        } else {
            this.winnerIs.answer = true;
            this.winnerIs.data = this.winnerIs.lastWinner;
        };
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        this.winnerIs.lastWinner = (this.winnerIs.answer) ? this.winnerIs.data : null; // ******* Возможно перенести *******
        const moves = history.map((step, move) => {
            const desc = move ? "Перейти к ходу #" + move : 'К началу игры';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if(this.winnerIs.answer) {
            status = 'Выиграл ' + this.winnerIs.data;
        } else {
            status = 'Следующий ход: ' + (this.xIsNext ? "X" : "O");
        };
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClick(i)}
                        boardSize = {this.boardSize = 5}
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
  
ReactDom.render(
    <Game />,
    document.getElementById('root')
);
  