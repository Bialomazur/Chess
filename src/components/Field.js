import React from "react";
import PropTypes from "prop-types";
import Pawn from "./figures/Pawn";
import Knight from "./figures/Knight";
import Bishop from "./figures/Bishop";
import Rook from "./figures/Rook";
import Queen from "./figures/Queen";
import King from "./figures/King";

import { useContext, useState } from "react";
import { GameContext } from "../contexts/GameContext";
import { select } from "async";
import { checkIfPawnShouldBePromoted } from "../utils/logic";

export default function Field({ number, letter, index, figure }) {
  const {
    updateFigurePosition,
    rotateBoard,
    castle,
    checkIfCanCastle,
    showFigureSelection,
    selectNewFigureForPawn,
    figurePositions,
    setFigurePositions,
    checkMate,
    setTurn,
    turn,
    setSelectedFigure,
    selectedFigure,
    checked,
  } = useContext(GameContext);

  const selectedField = selectedFigure.letter === letter && selectedFigure.number === number;
  const className = getClassName();
  const figureObject = getFigure();

  function getClassNameColorAppendix() {
    const sum = number + index;
    const color = figure != null && figure[0] === "W" ? "white" : "black";

    if (checked[color] && figure != null && figure.slice(1, figure.length) === "King") {
      return "check";
    }

    const moduloResult = turn % 2 !== 0 ? 0 : 0;

    if (sum % 2 === moduloResult) {
      return "even";
    } else {
      return "uneven";
    }
  }

  function getClassName() {
    const classNameColorAppendix = getClassNameColorAppendix();
    const classNameSelectedAppendix = getClassNameSelectedAppendix();
    return "field-" + classNameColorAppendix + classNameSelectedAppendix;
  }

  function getClassNameSelectedAppendix() {
    return selectedField ? " selected" : "";
  }

  function checkIfPlayersTurn() {
    const player = figure[0];
    const playerWhiteAndHasTurn = player === "W" && turn % 2 !== 0;
    const playerBlackAndHasTurn = player === "B" && turn % 2 === 0;

    return playerWhiteAndHasTurn || playerBlackAndHasTurn;
  }

  function checkIfFieldIsEmpty() {
    return figure == null;
  }

  function checkIfFieldHasFriendlyFigure() {
    if (figure == null || selectedFigure.figure == null) {
      return false;
    } else {
      return figure[0] === selectedFigure.figure[0];
    }
  }

  function checkIfFieldHasEnemyFigure() {
    if (figure == null || selectedFigure.figure == null) {
      return false;
    } else {
      return figure[0] !== selectedFigure.figure[0];
    }
  }

  function checkForSelectedFigureType(figureType) {
    return selectedFigure.figure.slice(1, selectedFigure.figure.length) === figureType;
  }

  function checkForNewFieldFigureType(figureType) {
    return figure.slice(1, selectedFigure.figure.length) === figureType;
  }

  function checkIfAFigureHasBeenSelected() {
    return selectedFigure.figure != null;
  }

  function selectField() {
    if (checkMate.winner) {
      return false;
    }

    if (showFigureSelection) {
      return false;
    }

    const playerHasSelectedFigure = checkIfAFigureHasBeenSelected();
    const newFieldIsEmpty = checkIfFieldIsEmpty();
    const newFieldIsFriendlyFigure = checkIfFieldHasFriendlyFigure();
    const newFieldIsEnemyFigure = checkIfFieldHasEnemyFigure();

    if (playerHasSelectedFigure) {
      if (newFieldIsFriendlyFigure) {
        const selectedFigureIsKing = checkForSelectedFigureType("King");
        const newFieldIsRook = checkForNewFieldFigureType("Rook");
        const color = figure[0] === "W" ? "white" : "black";

        if (selectedFigureIsKing && newFieldIsRook) {
          const canCastle = checkIfCanCastle({
            kingPosition: { letter: selectedFigure.letter, number: selectedFigure.number },
            rookPosition: { letter, number},
            color,
            figurePositions,
          });
          if (canCastle) {
            const newPositions = castle({
              rookPosition: { letter, number },
              color,
              figurePositions,
            });
            setFigurePositions(newPositions);
            setTurn(turn + 1);
            setSelectedFigure({ letter: null, number: null, figure: null });
          } else {
            setSelectedFigure({ letter, number, figure });
          }
        } else {
          setSelectedFigure({ letter, number, figure });
        }
      } else if (newFieldIsEmpty || newFieldIsEnemyFigure) {
        const movedSuccesfully = updateFigurePosition({
          oldNumber: selectedFigure.number,
          oldLetter: selectedFigure.letter,
          figure: selectedFigure.figure,
          newLetter: letter,
          newNumber: number,
        });

        if (movedSuccesfully) {
          setTurn(turn + 1);
          setSelectedFigure({ letter: null, number: null, figure: null });
        }

        
      }
    } else if (figureObject) {
      const playersTurn = checkIfPlayersTurn();
      if (!playersTurn) return;
      setSelectedFigure({ letter, number, figure });
    }
  }

  function getFigure() {
    switch (figure) {
      case "BPawn":
        const promoteB = checkIfPawnShouldBePromoted({ letter, figure, number });

        if (promoteB && !showFigureSelection) {
          selectNewFigureForPawn({ letter, number, color: "black" });
        }

        return Pawn({ color: "black", letter, number });

      case "WPawn":
        const promoteW = checkIfPawnShouldBePromoted({ letter, figure, number });

        if (promoteW && !showFigureSelection) {
          selectNewFigureForPawn({ letter, number, color: "white" });
        }

        return Pawn({ color: "white", letter, number });

      case "BBishop":
        return Bishop({ color: "black", letter, number });

      case "WBishop":
        return Bishop({ color: "white", letter, number });

      case "BKnight":
        return Knight({ color: "black", letter, number });

      case "WKnight":
        return Knight({ color: "white", letter, number });

      case "BRook":
        return Rook({ color: "black", letter, number });

      case "WRook":
        return Rook({ color: "white", letter, number });

      case "BQueen":
        return Queen({ color: "black", letter, number });

      case "WQueen":
        return Queen({ color: "white", letter, number });

      case "BKing":
        return King({ color: "black", letter, number });

      case "WKing":
        return King({ color: "white", letter, number });

      default:
        return null;
    }
  }

  return (
    <div className={className} onClick={(_) => selectField()}>
      {/* <label>
        {letter} {number}
      </label> */}
      {figureObject}
    </div>
  );
}

Field.propTypes = {
  number: PropTypes.number,
  index: PropTypes.number,
  letter: PropTypes.string,
};
