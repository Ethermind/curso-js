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
    firstMove = true;

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

function promptCoordinates(text) {
    const piecePosition = prompt(text);

    if (validCoordinates(piecePosition)) {
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

const board = buildBoard();
let exit = false;
let color = PieceColor.WHITE;
const instructions = `

Se debera ingresar la coordenada de la pieza y el destino de la misma en un segundo prompt
Ejemplo:
Al iniciar, ingresando e2 se selecciona el peon de rey.
Luego, seleccionando e4 lo movera a la casilla indicada.

`;

alert(instructions);
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
                    if (!board.isValidMovement(piece, piecePosition.row, piecePosition.column, destiny.row, destiny.column)) {
                        logError("INVALID MOVEMENT!");
                        color = switchTurn(color); // Force to try again
                    } else {
                        board.move(piece, destiny.column, destiny.row);
                        piece.moved() // mark piece as moved
                        console.clear();
                        board.print();
                    }
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
