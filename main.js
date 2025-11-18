// Returns an array with all possible legal moves of the knight
// startPos must be an array representing a chessboard square [x,y]
function getLegalMoves(startPos) {
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

    let legalMoves = [];
    for (move of moveSet) {
        const newPos = startPos.map((num, i) => num + move[i]);
        if (!newPos.some((num) => num < 0 || num > 7)) {
            legalMoves.push(newPos);
        }
    }

    return legalMoves;
}

// ============= MAIN CODE =============
console.log(getLegalMoves([1, 1]));
