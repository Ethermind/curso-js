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

const PieceColor = {
    WHITE: "WHITE",
    BLACK: "BLACK"
}

class Board {
    ROWS = 8;
    COLS = 8;

    constructor() {
        let m = [];

        for (let i = 0; i < this.ROWS; i++) {
            m[i] = [];
            for (let j = 0; j < this.COLS; j++) {
                m[i][j] = new Cell(this, i, j);
            }
        }

        this.matrix = m;
    }

    piece(column, row){
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
        for (let i = 0; i < this.ROWS; i++) {
            console.log("  ---------------------------------");
            this.printRow(i);
        }
        console.log("  ---------------------------------");
        console.log("    a   b   c   d   e   f   g   h  ");
    }

    printRow(row) {
        let result = "|";

        for (let j = 0; j < this.COLS; j++) {
            result = result + this.matrix[row][j].print() + "|";
        }

        console.log(`${8 - row} ${result}`);

        return result;
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
    #moved = false;

    constructor(color, cell) {
        this.color = color;
        this.cell = cell;
    }

    print() {
        return null;
    }

    canMove(x, y) {
        // Check if the movement is correct
        // Not if the movement is valid
        return false;
    }

    setAsMoved() {
        this.#moved = true;
    }
}

class Pawn extends Piece {
    print() {
        return " P ";
    }
}

class Knight extends Piece {
    print() {
        return " N ";
    }
}

class Rook extends Piece {
    print() {
        return " R ";
    }
}

class Bishop extends Piece {
    print() {
        return " B ";
    }
}

class Queen extends Piece {
    print() {
        return " Q ";
    }
}

class King extends Piece {
    print() {
        return " K ";
    }
}

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
            console.log("Cell is empty!");
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
                console.log(`Incorrect turn for ${piece.color}!`);
            }
        }
    } else {
        exit = true;
    }
}

console.log("GAME OVER");

function buildBoard() {
    const board = new Board();

    board.addPiece(Rook, PieceColor.BLACK, 0, 0);
    board.addPiece(Knight, PieceColor.BLACK, 0, 1);
    board.addPiece(Bishop, PieceColor.BLACK, 0, 2);
    board.addPiece(Queen, PieceColor.BLACK, 0, 3);
    board.addPiece(King, PieceColor.BLACK, 0, 4);
    board.addPiece(Bishop, PieceColor.BLACK, 0, 5);
    board.addPiece(Knight, PieceColor.BLACK, 0, 6);
    board.addPiece(Rook, PieceColor.BLACK, 0, 7);
    board.addPiece(Rook, PieceColor.WHITE, 7, 0);
    board.addPiece(Knight, PieceColor.WHITE, 7, 1);
    board.addPiece(Bishop, PieceColor.WHITE, 7, 2);
    board.addPiece(Queen, PieceColor.WHITE, 7, 3);
    board.addPiece(King, PieceColor.WHITE, 7, 4);
    board.addPiece(Bishop, PieceColor.WHITE, 7, 5);
    board.addPiece(Knight, PieceColor.WHITE, 7, 6);
    board.addPiece(Rook, PieceColor.WHITE, 7, 7);

    for (i = 0; i < 8; i++) {
        board.addPiece(Pawn, PieceColor.BLACK, 1, i);
        board.addPiece(Pawn, PieceColor.WHITE, 6, i);
    }

    return board;
}

function promptCoordinates(text) {
    const piecePosition = prompt(text);

    if (piecePosition !== "") {
        return {
            column: letterToColumn[piecePosition[0]],
            row: 8 - parseInt(piecePosition[1]),
        }
    }

    return null;
}

function switchTurn(color) {
    if (color === PieceColor.WHITE) {
        return PieceColor.BLACK;
    }

    return PieceColor.WHITE;
}
