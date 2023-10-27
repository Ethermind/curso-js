// _________            .___                     _________   ___ ______________ _________ _________
// \_   ___ \  ____   __| _/___________          \_   ___ \ /   |   \_   _____//   _____//   _____/
// /    \  \/ /  _ \ / __ |/ __ \_  __ \  ______ /    \  \//    ~    \    __)_ \_____  \ \_____  \
// \     \___(  <_> ) /_/ \  ___/|  | \/ /_____/ \     \___\    Y    /        \/        \/        \
//  \______  /\____/\____ |\___  >__|             \______  /\___|_  /_______  /_______  /_______  /
//         \/            \/    \/                        \/       \/        \/        \/        \/
//
// Simula un tablero de ajedrez.
// Inspirado en: https://chessboardjs.com/ y https://github.com/jhlywa/chess.js
//
// En esta entrega no se incluye:
//
// - Validaciones avanzadas de piezas (enroque y comer al paso)
// - Deteccion de Jaque y Jaque mate
// - Deteccion de Tablas por repeticion
// - Deteccion de Tablas por falta de piezas
// - Separacion de capa de presentacion y logica de negocio
// - Lista con los movimientos realizados utilizando notacion algebraica:
//   https://www.chess.com/es/article/view/notacion-de-ajedrez-el-lenguaje-del-ajedrez
//

const RANK_8 = 0;
const RANK_7 = 1;
const RANK_2 = 6;
const RANK_1 = 7;

const letterToColumn = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
};

const BoardSize = {
    ROWS: 8,
    COLS: 8,
}

const PieceColor = {
    WHITE: "WHITE",
    BLACK: "BLACK"
}

class Board {
    constructor() {
        let m = [];

        for (let i = 0; i < BoardSize.ROWS; i++) {
            m[i] = [];
            for (let j = 0; j < BoardSize.COLS; j++) {
                m[i][j] = new Cell(this, i, j);
            }
        }

        this.matrix = m;
    }

    piece(column, row) {
        return board.matrix[row][column].piece;
    }

    isValidMovement(piece, x1, y1, x2, y2) {
        return piece.isValidMovement(x1, y1, x2, y2);
    }

    move(piece, column, row) {
        this.matrix[row][column].piece = piece;
        this.matrix[piece.cell.x][piece.cell.y].piece = null;
        piece.cell.x = row;
        piece.cell.y = column;
    }

    addPiece(class_piece, color, x, y) {
        this.matrix[x][y].piece = new class_piece(color, this.matrix[x][y]);
    }
}

class Cell {
    constructor(board, x, y) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.piece = null;
    }

    hasPiece(){
        return this.piece === null;
    }
}

class Piece {
    symbol = "";
    firstMove = true;

    constructor(color, cell) {
        this.color = color;
        this.cell = cell;
    }

    className(){
        const color = this.color === PieceColor.WHITE ? "w" : "b";
        return `piece-${color}${this.symbol}`;
    }

    isValidMovement() {
        return undefined;
    }

    moved() {
        this.firstMove = false;
    }
}

class Pawn extends Piece {
    symbol = "P";

    isValidMovement(x1, y1, x2, y2) {
        if (this.color === PieceColor.WHITE) {
            return (x2 === (x1 - 1) && (y1 === y2)) || (x2 === (x1 - 2) && (y1 === y2) && this.firstMove);
        }
        return (x2 === (x1 + 1) && (y1 === y2)) || (x2 === (x1 + 2) && (y1 === y2) && this.firstMove);
    }
}

class Knight extends Piece {
    symbol = "N";

    isValidMovement(x1, y1, x2, y2) {
        return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) === 5;
    }
}

class Rook extends Piece {
    symbol = "R";

    isValidMovement(x1, y1, x2, y2) {
        return (x1 === x2) || (y1 === y2);
    }
}

class Bishop extends Piece {
    symbol = "B";

    isValidMovement(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) === Math.abs(y1 - y2);
    }
}

class Queen extends Piece {
    symbol = "Q";

    isValidMovement(x1, y1, x2, y2) {
        return (x1 === x2) || (y1 === y2) || (Math.abs(x1 - x2) === Math.abs(y1 - y2));
    }
}

class King extends Piece {
    symbol = "K";

    isValidMovement(x1, y1, x2, y2) {
        return (Math.abs(f1 - f2) <= 1) && (Math.abs(c1 - c2) <= 1);
    }
}

// La inicializacion del tablero se realizara luego utilizando notacion FEN.
// https://www.chess.com/es/blog/NosdeChess/la-notacion-fen-en-ajedrez-la-conoces
function buildBoard() {
    const board = new Board();

    board.addPiece(Rook, PieceColor.BLACK, RANK_8, 0);
    board.addPiece(Knight, PieceColor.BLACK, RANK_8, 1);
    board.addPiece(Bishop, PieceColor.BLACK, RANK_8, 2);
    board.addPiece(Queen, PieceColor.BLACK, RANK_8, 3);
    board.addPiece(King, PieceColor.BLACK, RANK_8, 4);
    board.addPiece(Bishop, PieceColor.BLACK, RANK_8, 5);
    board.addPiece(Knight, PieceColor.BLACK, RANK_8, 6);
    board.addPiece(Rook, PieceColor.BLACK, RANK_8, 7);
    board.addPiece(Rook, PieceColor.WHITE, RANK_1, 0);
    board.addPiece(Knight, PieceColor.WHITE, RANK_1, 1);
    board.addPiece(Bishop, PieceColor.WHITE, RANK_1, 2);
    board.addPiece(Queen, PieceColor.WHITE, RANK_1, 3);
    board.addPiece(King, PieceColor.WHITE, RANK_1, 4);
    board.addPiece(Bishop, PieceColor.WHITE, RANK_1, 5);
    board.addPiece(Knight, PieceColor.WHITE, RANK_1, 6);
    board.addPiece(Rook, PieceColor.WHITE, RANK_1, 7);

    for (i = 0; i < BoardSize.COLS; i++) {
        board.addPiece(Pawn, PieceColor.BLACK, RANK_7, i);
        board.addPiece(Pawn, PieceColor.WHITE, RANK_2, i);
    }

    return board;
}

function validCoordinates(text) {
    const pattern = /^[a-h][1-8]$/;

    return pattern.test(text);
}

function coordinates(text) {
    if (validCoordinates(text)) {
        return {
            column: letterToColumn[text[0]],
            row: 8 - parseInt(text[1]),
        }
    }

    return null;
}

function switchTurn(color) {
    return (color === PieceColor.WHITE) ? PieceColor.BLACK : PieceColor.WHITE;
}

class HTMLBoard {
    constructor(root, board) {
        this.board = board;
        this.matrix = this.board.matrix;
    }

    createCell(rank, column, className, piece){
        const cell = document.createElement("div");
        const top = document.createElement("div");
        const bottom = document.createElement("div");

        top.classList.add("cell-top");
        top.textContent = rank;

        bottom.classList.add("cell-bottom");
        bottom.textContent = column;

        cell.appendChild(top);
        cell.appendChild(bottom);
        cell.classList.add(className);

        if(piece !== null){
            cell.classList.add(piece.className())
        }

        return cell;
    }

    clear() {
        root.innerHTML = "";
    }

    render(){
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                let rank = "";
                let column = "";
                let cell = undefined;

                if(j===0){
                    rank = 8-i;
                }

                if(i===7){
                    column = String.fromCharCode(65+j).toLowerCase();
                }

                if((i+j)%2 === 0){
                    cell = this.createCell(rank, column, "cell-white", this.matrix[i][j].piece);
                } else {
                    cell = this.createCell(rank, column, "cell-black", this.matrix[i][j].piece);
                }

                root.append(cell);
            }
        }
    }
}

//-----------------------------------------------------------------------------------------------------
//
// GAME SIMULATOR
//
//-----------------------------------------------------------------------------------------------------

const board = buildBoard();
const root = document.querySelector("#root");
const move = document.querySelector("#button");

new HTMLBoard(root, board).render();
let exit = false;
let color = PieceColor.WHITE;

move.addEventListener("click", ()=>{
    const source = coordinates(document.querySelector("#source").value);
    const target = coordinates(document.querySelector("#target").value);

    if(source===null){
        alert("source incorrecto");
    }

    if(target===null){
        alert("target incorrecto");
    }

    const piece = board.piece(source.column, source.row);

    if(piece===null){
        alert("no hay pieza");
    }

    if (piece.color !== color) {
        alert("invalid color");
    }

    if (!board.isValidMovement(piece, source.row, source.column, target.row, target.column)) {
        alert("INVALID MOVEMENT!");
        color = switchTurn(color); // Force to try again
    } else {
        board.move(piece, target.column, target.row);
        piece.moved() // mark piece as moved
        new HTMLBoard(root, board).clear();
        new HTMLBoard(root, board).render();
    }
    color = switchTurn(color);

});

