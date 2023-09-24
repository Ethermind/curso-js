// _________ .__
// \_   ___ \|  |__   ____   ______ ______
// /    \  \/|  |  \_/ __ \ /  ___//  ___/
// \     \___|   Y  \  ___/ \___ \ \___ \
//  \______  /___|  /\___  >____  >____  >
//         \/     \/     \/     \/     \/   version 0.1
//
// Simula un tablero de ajedrez.
//
// En esta entrega no se incluye:
//
// - Validaciones de movimientos de piezas (incluyendo enroque y comer al paso)
// - Deteccion de Jaque y Jaque mate
// - Deteccion de Tablas por repeticion
// - Deteccion de Tablas por falta de piezas
// - Separacion de capa de presentacion y logica de negocio
// - Lista con los movimientos realizados utilizando notacion algebraica:
//   https://www.chess.com/es/article/view/notacion-de-ajedrez-el-lenguaje-del-ajedrez
//
// Adicionalmente a lo visto en el curso se incluye:
//
// - Uso de una matriz como tablero
//

const RANK_8 = 0;
const RANK_7 = 1;
const RANK_2 = 6;
const RANK_1 = 7;


const logInfo = (text) => {
    console.log(`%c${text}`, "font-family: 'Courier New', Courier, monospace");
}

const logError = (text) => {
    console.log(`%c${text}`, "color: red");
}

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

    move(piece, column, row) {
        this.matrix[row][column].piece = piece;
        this.matrix[piece.cell.x][piece.cell.y].piece = null;
        piece.cell.x = row;
        piece.cell.y = column;
    }

    addPiece(class_piece, color, x, y) {
        this.matrix[x][y].piece = new class_piece(color, this.matrix[x][y]);
    }

    print() {
        for (let i = 0; i < BoardSize.ROWS; i++) {
            logInfo("  ---------------------------------");
            logInfo(this.printableRank(i));
        }

        logInfo("  ---------------------------------");
        logInfo("    a   b   c   d   e   f   g   h  ");
    }

    printableRank(row) {
        let result = "|";

        for (let j = 0; j < BoardSize.COLS; j++) {
            result = result + this.matrix[row][j].print() + "|";
        }

        return `${8 - row} ${result}`;
    }
}

class Cell {
    constructor(board, x, y) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.piece = null;
    }

    print() {
        if (this.piece !== null) {
            return this.piece.print();
        }
        return "   ";
    }
}

class Piece {
    symbol = "";

    constructor(color, cell) {
        this.color = color;
        this.cell = cell;
    }

    symbolByColor() {
        if (this.color === PieceColor.WHITE) {
            return this.symbol.toUpperCase();
        }

        return this.symbol.toLowerCase();
    }

    print() {
        return ` ${this.symbolByColor()} `;
    }
}

class Pawn extends Piece {
    symbol = "P";
}

class Knight extends Piece {
    symbol = "N";
}

class Rook extends Piece {
    symbol = "R";
}

class Bishop extends Piece {
    symbol = "B";
}

class Queen extends Piece {
    symbol = "Q";
}

class King extends Piece {
    symbol = "K";
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

function promptCoordinates(text) {
    const piecePosition = prompt(text);

    if (piecePosition !== null && piecePosition !== "") {
        return {
            column: letterToColumn[piecePosition[0]],
            row: 8 - parseInt(piecePosition[1]),
        }
    }

    return null;
}

function switchTurn(color) {
    return (color === PieceColor.WHITE) ? PieceColor.BLACK : PieceColor.WHITE;
}

//-----------------------------------------------------------------------------------------------------
//
// GAME SIMULATOR
//
//-----------------------------------------------------------------------------------------------------

//
// Se debera ingresar la coordenada de la pieza y el destino de la misma en un segundo prompt
// Ejemplo:
// Al iniciar, ingresando e2 se selecciona el peon de rey.
// Luego, seleccionando e4 lo movera a la casilla indicada.
//

const board = buildBoard();
let exit = false;
let color = PieceColor.WHITE;

console.clear();
board.print();

// GAME LOOP
while (!exit) {
    const piecePosition = promptCoordinates("Select piece");

    if (piecePosition !== null) {
        const piece = board.piece(piecePosition.column, piecePosition.row);

        if (piece === null) {
            logError("Cell is empty!");
        }
        else {
            if (piece.color === color) {
                const destiny = promptCoordinates(`Select where to move ${piece.constructor.name}`);

                if (destiny !== '') {
                    board.move(piece, destiny.column, destiny.row);
                    console.clear();
                    board.print();
                } else {
                    exit = true;
                }

                color = switchTurn(color);
            } else {
                logError(`Incorrect turn for ${piece.color}!`);
            }
        }
    } else {
        exit = true;
    }
}

logInfo("GAME OVER");
