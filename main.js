// Returns the shortest possible set of moves for the knight to get from square startPos to square endPos
function knightMoves(startPos, endPos) {
    const board = computePaths(startPos);
    const solutions = getShortestPath(board, endPos);
    board.displayComputedSquares();
    displayShortestPaths(solutions);
    console.log(board);
}

// Returns a board with each square containing the shortest number of moves to get to it
// and the squares that are linked to it
function computePaths(startPos) {
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

            // Only queue more moves if MAX_MOVES has not been reached
            if (moveNum < MAX_MOVES) {
                currPath.push(currSquare);
                const legalMoves = board.getLegalSquares(currSquare.position);
                queue = queue.concat(legalMoves);
                moveNum++;
            } else {
                queue.pop();
            }
        } else if (moveNum <= MAX_MOVES && moveNum < currSquare.value) {
            currSquare.value = moveNum;
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

    return board;
}

// Returns the shortest paths to the end position given a pre-computed board
function getShortestPath(board, endPos) {
    let currSquare = board.getSquare(endPos); // Keeps track of the current square
    let queue = [currSquare]; // Queues squares for search by depth
    let currValue = currSquare.value; // Keeps track of the current square value
    let currPath = []; // Keeps track of the current path
    let solutions = []; // Stores solutions of the shortest path

    // Set link values for each square
    for (let i = 0; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
            board.board[i][j].links = board.getLegalSquares(
                board.board[i][j].position
            );
        }
    }

    // If the end and start position are the same
    if (currSquare.value === 0) return [currSquare];

    // Search through all the links of the end position that have
    // a lower value than the previous link
    while (queue.length !== 0) {
        currSquare = queue.at(-1);

        if (currPath.at(-1) !== currSquare) {
            currPath.push(currSquare);
        } else {
            queue.pop();
            currPath.pop();
            currValue++;
            continue;
        }

        currSquare.links.forEach((link) => {
            if (link.value === 0) {
                currPath.push(link);
                solutions.push(currPath.map((x) => x));
                currPath.pop();
            } else if (link.value + 1 === currValue) {
                queue.push(link);
            }
        });

        if (currSquare.links.some((link) => link.value + 1 === currValue))
            currValue--;
    }

    return solutions;
}

function displayShortestPaths(solutions) {
    const statement = document.querySelector("div>p");
    statement.textContent = `The following moves get you from ${numToChar(
        solutions[0].at(-1).position[0]
    )}${solutions[0].at(-1).position[1] + 1} to ${numToChar(
        solutions[0][0].position[0]
    )}${solutions[0][0].position[1] + 1} the fastest:`;

    const div = document.querySelector("div");
    let i = 1;
    for (const solution of solutions) {
        solution.reverse();
        const para = document.createElement("p");
        para.textContent = `${i}.\t`;
        for (const square of solution) {
            para.textContent += `${numToChar(square.position[0])}${
                square.position[1] + 1
            }, `;
        }
        para.textContent = para.textContent.slice(0, -2);
        div.appendChild(para);
        i++;
    }
}

function numToChar(num) {
    return String.fromCharCode(65 + num);
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
knightMoves([0, 0], [7, 7]);
