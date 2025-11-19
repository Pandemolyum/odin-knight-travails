// Returns the shortest possible set of moves for the knight to get from square startPos to square endPos
function knightMoves(startPos, endPos) {
    const board = new Board();
    let queue = [board.getSquare(startPos)]; // Queues squares for search
    let currPath = []; // Keeps track of the current path
    let currSquare; // Keeps track of the current square
    let moveNum = 0; // Keeps track of the current move count
    const MAX_MOVES = 6; // Maximum number of moves to get from any square to any other square on a chessboard

    while (queue.length !== 0) {
        currSquare = queue.at(-1);
        if (moveNum <= MAX_MOVES && currSquare.value === null) {
            currSquare.value = moveNum;
            if (currPath.length !== 0) {
                currSquare.links.push(currPath.at(-1));
            }

            // Only queue more moves if MAX_MOVES has not been reached
            if (moveNum < MAX_MOVES) {
                currPath.push(currSquare);
                const legalMoves = board.getLegalSquares(currSquare.position);
                queue = queue.concat(legalMoves);
                currSquare.links = currSquare.links.concat(legalMoves);
                moveNum++;
            } else {
                queue.pop();
            }
        } else if (moveNum <= MAX_MOVES && moveNum < currSquare.value) {
            currSquare.value = moveNum;
            currSquare.links.push(currPath.at(-1));
            currPath.push(currSquare);
            const legalMoves = board.getLegalSquares(currSquare.position);
            queue = queue.concat(legalMoves);
            moveNum++;
        } else {
            if (queue.at(-1) === currPath.at(-1)) {
                queue.pop();
                currPath.pop();
                moveNum--;
            } else {
                queue.pop();
            }
        }
    }

    console.log(board);
    board.displayComputedSquares();
}

class Square {
    constructor() {
        this.position = [null, null];
        this.value = null;
        this.links = [];
    }
}

class Board {
    constructor() {
        this.size = 8;
        this.board = this.getCleanBoard();
    }

    // Returns an 8x8 array filled with null
    getCleanBoard() {
        const board = new Array(this.size)
            .fill(0)
            .map(() => new Array(this.size).fill(null));

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                board[i][j] = new Square();
                board[i][j].position = [i, j];
            }
        }
        return board;
    }

    getSquare(position) {
        return this.board[position[0]][position[1]];
    }

    setSquareValue(position, value) {
        this.getSquare(position).value = value;
    }

    addSquareLink(position, link) {
        this.getSquare(position).links.push(link);
    }

    // Returns an array with all possible legal moves of the knight
    // startPos must be an array representing a chessboard square [x,y]
    getLegalSquares(startPos) {
        const moveSet = [
            [2, 1],
            [-2, 1],
            [2, -1],
            [-2, -1],
            [1, 2],
            [-1, 2],
            [1, -2],
            [-1, -2],
        ];

        let legalSquares = [];
        for (const move of moveSet) {
            const newPos = startPos.map((num, i) => num + move[i]);
            if (!newPos.some((num) => num < 0 || num > 7)) {
                legalSquares.push(this.getSquare(newPos));
            }
        }

        return legalSquares;
    }

    displayComputedSquares() {
        const cells = document.querySelectorAll("td");

        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent =
                this.board[this.size - 1 - Math.floor(i / this.size)][
                    i % this.size
                ].value;

            console.log(
                "🚀 ~ Board ~ displayComputedSquares ~ cells[i].textContent:",
                cells[i].textContent
            );
            switch (cells[i].textContent) {
                case "0":
                    cells[i].style.backgroundColor = "#8be700ff";
                    break;
                case "1":
                    cells[i].style.backgroundColor = "#88B840";
                    break;
                case "2":
                    cells[i].style.backgroundColor = "#C3D323";
                    break;
                case "3":
                    cells[i].style.backgroundColor = "#F9EC35";
                    break;
                case "4":
                    cells[i].style.backgroundColor = "#ED8D1F";
                    break;
                case "5":
                    cells[i].style.backgroundColor = "#E86523";
                    break;
                case "6":
                    cells[i].style.backgroundColor = "#E34017";
                    break;
            }
        }
    }
}

// ============= MAIN CODE =============
knightMoves([3, 3], [7, 7]);
