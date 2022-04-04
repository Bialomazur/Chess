const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

function initialChessField() {
  return {
    A: ["BRook", "BPawn", null, null, null, null, "WPawn", "WRook"],
    B: ["BKnight", "BPawn", null, null, null, null, "WPawn", "WKnight"],
    C: ["BBishop", "BPawn", null, null, null, null, "WPawn", "WBishop"],
    D: ["BQueen", "BPawn", null, null, null, null, "WPawn", "WQueen"],
    E: ["BKing", "BPawn", null, null, null, null, "WPawn", "WKing"],
    F: ["BBishop", "BPawn", null, null, null, null, "WPawn", "WBishop"],
    G: ["BKnight", "BPawn", null, null, null, null, "WPawn", "WKnight"],
    H: ["BRook", "BPawn", null, null, null, null, "WPawn", "WRook"],
  };
}

function rotateBoard({ figurePositions, setFigurePositions }) {
  const newPositions = JSON.parse(JSON.stringify(figurePositions));

  for (let letterArray of Object.values(newPositions)) {
    letterArray.reverse();
    for (let i = 0; i < 4; i++) {
      // const buffer = newPositions[letter][i];
      // newPositions[letter][i] = newPositions[letter][7 - i];
      // newPositions[letter][7 - i] = buffer;
    }
  }

  setFigurePositions(newPositions);
}


function handleFigureCapture({ letter, number, capturedFigure, color, points, setPoints }) {
  let newPoints = points[color];

  switch (capturedFigure) {
    case "Pawn":
      newPoints++;
      break;

    case "Knight":
      newPoints += 3;
      break;

    case "Bishop":
      newPoints += 3;
      break;

    case "Rook":
      newPoints += 5;
      break;

    case "Queen":
      newPoints += 9;
      break;
  }

  if (color === "white") {
    setPoints({ ...points, white: newPoints });
  } else {
    setPoints({ ...points, black: newPoints });
  }
}

function checkForDraw({ figurePositions }) {}

function castle({ color, rookPosition, figurePositions }) {
  const newPositions = JSON.parse(JSON.stringify(figurePositions));
  const number = rookPosition.number - 1;
  const rookFigure = color === "white" ? "WRook" : "BRook";
  const kingFigure = color === "white" ? "WKing" : "BKing";

  if (rookPosition.letter === "A") {
    newPositions["B"][number] = kingFigure;
    newPositions["A"][number] = null;
    newPositions["E"][number] = null;
    newPositions["C"][number] = rookFigure;
  } else if (rookPosition.letter === "H") {
    newPositions["G"][number] = kingFigure;
    newPositions["H"][number] = null;
    newPositions["E"][number] = null;
    newPositions["F"][number] = rookFigure;
  }
  return newPositions;
}

function checkIfCanCastle({ color, rookPosition, kingPosition, figurePositions }) {
  let canCastle = true;
  const startingNumber = color === "white" ? 8 : 1;
  const pathIsBlocked = checkIfHorizontalIsBlocked({
    figurePositions,
    oldLetter: kingPosition.letter,
    newLetter: rookPosition.letter,
    oldNumber: startingNumber,
  });
  const horizontalIsUnderAttack = checkIfHorizontalIsUnderAttack({
    color,
    number: startingNumber,
    oldLetter: rookPosition.letter,
    newLetter: kingPosition.letter,
    figurePositions,
  });

  if (kingPosition.letter !== "E" || kingPosition.number !== startingNumber) {
    console.log("%c Wrong King Position", "color: red;");
    canCastle = false;
  }

  if (rookPosition.letter !== "A" && rookPosition.letter !== "H") {
    console.log("%c Wrong Rook Letter-Position", "color: red;");
    canCastle = false;
  }

  if (rookPosition.number !== startingNumber) {
    console.log("%c Wrong Rook Number-Position", "color: red;");
    canCastle = false;
  }

  if (pathIsBlocked) {
    console.log("%c Path is blocked", "color: orange;");
    canCastle = false;
  }

  if (horizontalIsUnderAttack) {
    console.log("%c Horizontal is under attack", "color:orange");
    canCastle = false;
  }

  return canCastle;
}

function checkIfPawnShouldBePromoted({ letter, number, figure, figureSelectionCallback }) {
  let finalFieldNumber;
  const colorPrefix = figure[0];

  if (colorPrefix === "W") {
    finalFieldNumber = 1;
  } else {
    finalFieldNumber = 8;
  }

  return finalFieldNumber === number;
}

function detectCheckMate() {}

function getNewPositions({ oldLetter, oldNumber, newNumber, newLetter, figure, figurePositions }) {
  let newPositions = JSON.parse(JSON.stringify(figurePositions));
  newPositions[oldLetter][oldNumber - 1] = null;
  newPositions[newLetter][newNumber - 1] = figure;
  return newPositions;
}

function checkIfEnemyOnNewField({ newLetter, newNumber, player, figurePositions }) {
  const enemy = player === "W" ? "B" : "W";
  const figure = figurePositions[newLetter][newNumber - 1];
  const enemyFigurePresent = figure != null && enemy === figure[0];
  return enemyFigurePresent;
}

function getLettersBetweenFields({ oldLetter, newLetter }) {
  const [oldLetterIndex, newLetterIndex] = [letters.indexOf(oldLetter), letters.indexOf(newLetter)];

  if (oldLetterIndex > newLetterIndex) {
    return letters
      .slice(newLetterIndex + 1, oldLetterIndex)
      .sort()
      .reverse();
  } else if (oldLetterIndex < newLetterIndex) {
    return letters.slice(oldLetterIndex + 1, newLetterIndex).sort();
  } else {
    return [];
  }
}

function checkIfHorizontalIsBlocked({ oldNumber, oldLetter, newLetter, figurePositions }) {
  const lettersBetweenHorizontal = getLettersBetweenFields({ oldLetter, newLetter });

  for (let i = 0; i < lettersBetweenHorizontal.length; i++) {
    const letter = lettersBetweenHorizontal[i];
    const figure = figurePositions[letter][oldNumber - 1];

    if (figure !== null) {
      return true;
    }
  }

  return false;
}

function checkIfHorizontalIsUnderAttack({ number, color, oldLetter, newLetter, figurePositions }) {
  const enemyColorPrefix = color === "white" ? "B" : "W";
  const lettersBetweenCastleFigures = getLettersBetweenFields({ oldLetter, newLetter });
  const lettersToCheck = [...lettersBetweenCastleFigures, oldLetter, newLetter];

  for (const letter of Object.keys(figurePositions)) {
    for (let i = 0; i < 8; i++) {
      const figure = figurePositions[letter][i];

      if (figure == null || figure[0] !== enemyColorPrefix) {
        continue;
      }

      for (let j = 0; j < lettersToCheck.length; j++) {
        const letterToCheck = lettersToCheck[j];
        const fieldIsUnderAttack = validateMove({
          figure,
          figurePositions,
          oldLetter: letter,
          newLetter: letterToCheck,
          oldNumber: i + 1,
          newNumber: number,
        });

        if (fieldIsUnderAttack) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkIfVerticalIsBlocked({ oldNumber, newNumber, oldLetter, figurePositions }) {
  let start, end;

  if (oldNumber < newNumber) {
    start = oldNumber;
    end = newNumber - 1;
  } else {
    start = newNumber;
    end = oldNumber - 1;
  }

  for (let i = start; i < end; i++) {
    const figure = figurePositions[oldLetter][i];

    if (figure !== null) {
      return true;
    }
  }

  return false;
}

function checkIfDiagonalIsBlocked({ oldNumber, newNumber, oldLetter, newLetter, figurePositions }) {
  const lettersBetweenDiagonal = getLettersBetweenFields({ oldLetter, newLetter });

  for (let i = 0; i < lettersBetweenDiagonal.length; i++) {
    const letter = lettersBetweenDiagonal[i];
    const index = oldNumber > newNumber ? oldNumber - 1 - (i + 1) : oldNumber - 1 + (i + 1);
    const figure = figurePositions[letter][index];

    if (figure !== null) {
      return true;
    }
  }

  return false;
}

function validateBishopMove({
  letterIndexDifference,
  numberDifference,
  newNumber,
  oldNumber,
  newLetter,
  figurePositions,
  oldLetter,
}) {
  const validLetterAndNumberDiff = numberDifference === letterIndexDifference;
  const figureBlockingPath = checkIfDiagonalIsBlocked({
    newNumber,
    oldNumber,
    oldLetter,
    newLetter,
    figurePositions,
  });
  return validLetterAndNumberDiff && !figureBlockingPath;
}

function validateRookMove({
  letterIndexDifference,
  numberDifference,
  newNumber,
  oldNumber,
  newLetter,
  oldLetter,
  figurePositions,
}) {
  const moveIsValid = numberDifference === 0 || letterIndexDifference === 0;
  const figureBlockingPathHorizontally = checkIfHorizontalIsBlocked({
    oldNumber,
    oldLetter,
    newLetter,
    figurePositions,
  });
  const figureBlockingPathVertically = checkIfVerticalIsBlocked({
    oldNumber,
    newNumber,
    oldLetter,
    figurePositions,
  });

  if (numberDifference === 0) {
    return moveIsValid && !figureBlockingPathHorizontally;
  } else {
    return moveIsValid && !figureBlockingPathVertically;
  }
}

function getFigurePosition({ figureToGet, figurePositions }) {
  for (let letter of Object.keys(figurePositions)) {
    for (let i = 0; i < figurePositions[letter].length; i++) {
      const figure = figurePositions[letter][i];
      if (figure === figureToGet) {
        return { letter, number: i + 1 };
      }
    }
  }
}

function checkIfKnightChecks({ kingPosition, knightPosition }) {
  const letterIndexDifference = getLetterIndexDifference({
    oldLetter: kingPosition.letter,
    newLetter: knightPosition.letter,
  });
  const numberDifference = getNumberDifference({
    oldNumber: kingPosition.number,
    newNumber: knightPosition.number,
  });

  return (
    (letterIndexDifference === 1 && numberDifference === 2) ||
    (letterIndexDifference === 2 && numberDifference === 1)
  );
}

function checkIfPawnChecks({ kingPosition, pawnPosition, kingColor }) {
  let correctPawnPosition;
  const letterIndexDifference = getLetterIndexDifference({
    oldLetter: kingPosition.letter,
    newLetter: pawnPosition.letter,
  });
  const numberDifference = getNumberDifference({
    oldNumber: kingPosition.number,
    newNumber: pawnPosition.number,
  });

  if (kingColor === "white") {
    correctPawnPosition = pawnPosition.number < kingPosition.number;
  } else {
    correctPawnPosition = pawnPosition.number > kingPosition.number;
  }

  return numberDifference === 1 && letterIndexDifference === 1 && correctPawnPosition;
}

function checkForDiagonalCheck({ lettersArray, figurePosition, kingPosition, figurePositions }) {
  let blockedUp = false;
  let blockedDown = false;

  for (let i = 0; i < lettersArray.length; i++) {
    const positionUp = { number: figurePosition.number + i + 1, letter: lettersArray[i] };
    const positionDown = { number: figurePosition.number - i - 1, letter: lettersArray[i] };

    const figureOnFieldUp = figurePositions[positionUp.letter][positionUp.number - 1];
    const figureOnFieldDown = figurePositions[positionUp.letter][positionDown.number - 1];

    if (
      figureOnFieldDown != null &&
      (kingPosition.letter !== positionDown.letter || kingPosition.number !== positionDown.number)
    ) {
      blockedDown = true;
    }

    if (
      figureOnFieldUp != null &&
      (kingPosition.letter !== positionUp.letter || kingPosition.number !== positionUp.number)
    ) {
      blockedUp = true;
    }

    const positionUpChecks =
      positionUp.letter === kingPosition.letter && positionUp.number === kingPosition.number;
    const positionDownChecks =
      positionDown.letter === kingPosition.letter && positionDown.number === kingPosition.number;

    if ((positionUpChecks && !blockedUp) || (positionDownChecks && !blockedDown)) {
      return true;
    }
  }
  return false;
}

function checkForVerticalCheck({ figurePosition, figurePositions, kingPosition }) {
  const verticalPathIsBlocked = checkIfVerticalIsBlocked({
    oldNumber: figurePosition.number,
    newNumber: kingPosition.number,
    oldLetter: figurePosition.letter,
    figurePositions,
  });
  const sameVerticalPath = kingPosition.letter === figurePosition.letter;

  return !verticalPathIsBlocked && sameVerticalPath;
}

function checkForHorizontalCheck({ figurePosition, kingPosition, figurePositions }) {
  const horizontalPathIsBlocked = checkIfHorizontalIsBlocked({
    figurePositions,
    oldNumber: figurePosition.number,
    oldLetter: figurePosition.letter,
    newLetter: kingPosition.letter,
  });
  const sameHorizontalPath = kingPosition.number === figurePosition.number;

  return sameHorizontalPath && !horizontalPathIsBlocked;
}

function checkIfBishopChecks({ kingPosition, bishopPosition, figurePositions }) {
  const lettersBetweenMaxLetter = getLettersBetweenFields({
    oldLetter: bishopPosition.letter,
    newLetter: "H",
  });
  const lettersBetweenMinLetter = getLettersBetweenFields({
    oldLetter: bishopPosition.letter,
    newLetter: "A",
  });

  const lettersBetweenMaxCheck = checkForDiagonalCheck({
    figurePosition: bishopPosition,
    kingPosition,
    figurePositions,
    lettersArray: [...lettersBetweenMaxLetter, "H"],
  });
  const lettersBetweenMinCheck = checkForDiagonalCheck({
    figurePosition: bishopPosition,
    kingPosition,
    lettersArray: [...lettersBetweenMinLetter, "A"],
    figurePositions,
  });

  return lettersBetweenMaxCheck || lettersBetweenMinCheck;
}

function checkIfPawnMovedInValidDirection({ color, oldNumber, newNumber }) {
  if (color === "white") {
    return oldNumber > newNumber;
  } else {
    return oldNumber < newNumber;
  }
}

function checkIfKingChecks({ kingPosition, checkingKingPosition, figurePositions }) {
  const letterIndexDifference = getLetterIndexDifference({
    oldLetter: kingPosition.letter,
    newLetter: checkingKingPosition.letter,
  });
  const numberDifference = getNumberDifference({
    oldNumber: kingPosition.number,
    newNumber: checkingKingPosition.number,
  });

  return letterIndexDifference <= 1 && numberDifference <= 1;
}

function checkIfRookChecks({ kingPosition, rookPosition, figurePositions }) {
  const horizontalCheck = checkForHorizontalCheck({
    figurePosition: rookPosition,
    kingPosition,
    figurePositions,
  });

  const verticalCheck = checkForVerticalCheck({
    kingPosition,
    figurePositions,
    figurePosition: rookPosition,
  });

  return horizontalCheck || verticalCheck;
}

function checkIfQueenChecks({ kingPosition, queenPosition, figurePositions }) {
  const lettersBetweenMaxLetter = getLettersBetweenFields({
    oldLetter: queenPosition.letter,
    newLetter: "H",
  });
  const lettersBetweenMinLetter = getLettersBetweenFields({
    oldLetter: queenPosition.letter,
    newLetter: "A",
  });

  const horizontalCheck = checkForHorizontalCheck({
    figurePosition: queenPosition,
    kingPosition,
    figurePositions,
  });

  const verticalCheck = checkForVerticalCheck({
    kingPosition,
    figurePositions,
    figurePosition: queenPosition,
  });

  const diagonalCheckMaxLetter = checkForDiagonalCheck({
    kingPosition,
    figurePosition: queenPosition,
    figurePositions,
    lettersArray: [...lettersBetweenMaxLetter, "H"],
  });

  const diagonalCheckMinLetter = checkForDiagonalCheck({
    kingPosition,
    figurePosition: queenPosition,
    figurePositions,
    lettersArray: [...lettersBetweenMinLetter, "A"],
  });

  return horizontalCheck || verticalCheck || diagonalCheckMaxLetter || diagonalCheckMinLetter;
}

function checkIfKingIsChecked({ figurePositions, color }) {
  const king = color === "white" ? "WKing" : "BKing";
  const kingsEnemyColorPrefix = king === "BKing" ? "W" : "B";
  const kingPosition = getFigurePosition({ figurePositions, figureToGet: king });

  for (let letter of Object.keys(figurePositions)) {
    for (let i = 0; i < figurePositions[letter].length; i++) {
      const figure = figurePositions[letter][i];

      if (figure == null || figure[0] !== kingsEnemyColorPrefix) {
        continue;
      }

      const figureType = figure.slice(1, figure.length);
      const figurePosition = { letter, number: i + 1 };

      switch (figureType) {
        case "Pawn":
          const pawnChecks = checkIfPawnChecks({
            kingPosition,
            pawnPosition: figurePosition,
            kingColor: color,
          });

          if (pawnChecks) {
            return true;
          } else {
            break;
          }

        case "Knight":
          const knightChecks = checkIfKnightChecks({
            kingPosition,
            knightPosition: figurePosition,
          });

          if (knightChecks) {
            return true;
          } else {
            break;
          }

        case "Bishop":
          const bishopChecks = checkIfBishopChecks({
            bishopPosition: figurePosition,
            figurePositions,
            kingPosition,
          });

          if (bishopChecks) {
            return true;
          } else {
            break;
          }

        case "Rook":
          const rookChecks = checkIfRookChecks({
            rookPosition: figurePosition,
            figurePositions,
            kingPosition,
          });

          if (rookChecks) {
            return true;
          } else {
            break;
          }

        case "Queen":
          const queenChecks = checkIfQueenChecks({
            queenPosition: figurePosition,
            figurePositions,
            kingPosition,
          });

          if (queenChecks) {
            return true;
          } else {
            break;
          }

        case "King":
          const kingChecks = checkIfKingChecks({
            kingPosition,
            checkingKingPosition: figurePosition,
            figurePositions,
          });

          if (kingChecks) {
            return true;
          } else {
            break;
          }
      }
    }
  }
  return false;
}

function bruteForceCheckPossibleMoves({ oldLetter, oldNumber, figure, figurePositions }) {
  const validMoves = [];
  for (const letter of Object.keys(figurePositions)) {
    for (let i = 0; i < 8; i++) {
      const moveIsValid = validateMove({
        oldLetter,
        oldNumber: oldNumber + 1,
        newNumber: i + 1,
        newLetter: letter,
        figure,
        figurePositions,
      });

      if (moveIsValid) {
        validMoves.push({ letter, number: i + 1 });
        console.log(
          `%c Found a valid move | Figure: ${figure} ;New-Number: ${i} Old-Number:${oldNumber}; New-Letter: ${letter} Old-Letter: ${oldLetter}`,
          "color: green"
        );
      }
    }
  }
  console.log("%c No valid move has been Found.", "color: red;");

  return validMoves;
}

function validatePossibleMoves({ figurePositions, figure, oldLetter, oldNumber, moves }) {}

function checkForCheckmate({ color, figurePositions }) {
  const colorPrefix = color === "white" ? "W" : "B";

  for (const letter of Object.keys(figurePositions)) {
    for (let i = 0; i < 8; i++) {
      const figure = figurePositions[letter][i];

      if (figure == null || figure[0] !== colorPrefix) {
        continue;
      }

      const possibleMoves = bruteForceCheckPossibleMoves({
        oldLetter: letter,
        oldNumber: i,
        figure,
        figurePositions,
      });

      if (possibleMoves) {
        console.log(possibleMoves);

        for (let j = 0; j < possibleMoves.length; j++) {
          const newPositions = getNewPositions({
            figure,
            figurePositions,
            oldLetter: letter,
            oldNumber: i + 1,
            newNumber: possibleMoves[j].number,
            newLetter: possibleMoves[j].letter,
          });
          const kingStillChecked = checkIfKingIsChecked({ figurePositions: newPositions, color });

          if (!kingStillChecked) {
            return false;
            console.log("%c Found possible Move!", "color: yellow;");
            console.log(
              `%c Figure:${figure} | Number: ${possibleMoves[j].number} | Letter: ${possibleMoves[j].letter}`,
              "color: yellow"
            );
          }
        }

        // const kingStillChecked = checkIfKingIsChecked({ figurePositions: newPositions, color });
      }
    }
  }
  return true;
}

function checkIfPawnMoved({ oldNumber, color }) {
  return (oldNumber === 7 && color === "white") || (oldNumber === 2 && color === "black");
}

function checkNumberOfFieldsMovedPawn({ color, oldNumber, newNumber, letterIndexDifference }) {
  const notMovedYet = checkIfPawnMoved({ color, oldNumber });
  const maxFieldsToMove = notMovedYet && letterIndexDifference === 0 ? 2 : 1;
  return (
    (color === "white" && oldNumber - newNumber <= maxFieldsToMove) ||
    (color === "black" && newNumber - oldNumber <= maxFieldsToMove)
  );
}

function getLetterIndexDifference({ oldLetter, newLetter }) {
  const diff = letters.indexOf(oldLetter) - letters.indexOf(newLetter);
  return diff >= 0 ? diff : diff * -1;
}

function getNumberDifference({ oldNumber, newNumber }) {
  const diff = oldNumber - newNumber;
  return diff >= 0 ? diff : diff * -1;
}

function checkIfFriendlyFigureOnField({ color, number, letter, figurePositions }) {
  const figure = figurePositions[letter][number - 1];
  const friendlyColorPrefix = color === "white" ? "W" : "B";

  // console.log(`Figure on new Field: ${figure}`)

  if (figure != null && figure[0] === friendlyColorPrefix) {
    return true;
  } else {
    return false;
  }
}

function validateMove({ oldLetter, newLetter, oldNumber, newNumber, figure, figurePositions, turn}) {
  let validNumberOfFieldsMoved;
  let figureBlockingPath;
  const reversed = turn % 2 === 0;
  let color = figure[0] === "W" ? "white" : "black";

  if (reversed){
    color = color === "white" ? "black" : "white";
  }

  const figureType = figure.slice(1, figure.length);
  const enemyOnNewField = checkIfEnemyOnNewField({
    newLetter,
    newNumber,
    player: figure[0],
    figurePositions,
  });
  const friendlyFigureOnNewField = checkIfFriendlyFigureOnField({
    letter: newLetter,
    number: newNumber,
    color,
    figurePositions,
  });
  const letterIndexDifference = getLetterIndexDifference({ oldLetter, newLetter });
  const numberDifference = getNumberDifference({ oldNumber, newNumber });

  if (friendlyFigureOnNewField) {
    return false;
  }

  switch (figureType) {
    case "Pawn":
      validNumberOfFieldsMoved = checkNumberOfFieldsMovedPawn({
        color,
        oldNumber,
        newNumber,
        letterIndexDifference,
      });

      const validDirection = checkIfPawnMovedInValidDirection({ oldNumber, newNumber, color });
      const validNoEnemyFigureTaken =
        validNumberOfFieldsMoved && letterIndexDifference === 0 && !enemyOnNewField;
      const validEnemyFigureTaken =
        validNumberOfFieldsMoved && letterIndexDifference === 1 && enemyOnNewField;
      return (validNoEnemyFigureTaken || validEnemyFigureTaken) && validDirection;

    case "Knight":
      const validLetterIndexDiff = letterIndexDifference <= 2 && letterIndexDifference > 0;
      const correctNumberDiff = letterIndexDifference === 1 ? 2 : 1;
      validNumberOfFieldsMoved = numberDifference === correctNumberDiff;

      console.log(
        `Number Diff: ${correctNumberDiff} | Letter Index Diff: ${letterIndexDifference}`
      );

      return validNumberOfFieldsMoved && validLetterIndexDiff;

    case "Bishop":
      return validateBishopMove({
        oldLetter,
        newLetter,
        oldNumber,
        newNumber,
        letterIndexDifference,
        numberDifference,
        figurePositions,
      });

    case "Rook":
      return validateRookMove({
        oldLetter,
        newLetter,
        oldNumber,
        newNumber,
        letterIndexDifference,
        numberDifference,
        figurePositions,
      });

    case "Queen":
      const validBishopMove = validateBishopMove({
        oldNumber,
        newNumber,
        oldLetter,
        newLetter,
        figurePositions,
        letterIndexDifference,
        numberDifference,
      });
      const validRookMove = validateRookMove({
        oldNumber,
        newNumber,
        oldLetter,
        newLetter,
        figurePositions,
        letterIndexDifference,
        numberDifference,
      });

      return validRookMove || validBishopMove;

    case "King":
      return letterIndexDifference <= 1 && numberDifference <= 1;
  }
}

export {
  initialChessField,
  validateMove,
  checkIfKingIsChecked,
  checkForCheckmate,
  rotateBoard,
  getNewPositions,
  checkIfPawnShouldBePromoted,
  castle,
  checkIfCanCastle,
  handleFigureCapture,
};
