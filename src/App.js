import Field from "./components/Field";
import Pawn from "./components/figures/Pawn";
import FieldRow from "./components/FieldRow";
import { GameContext } from "./contexts/GameContext";
import { TurnContext } from "./contexts/TurnContext";
import { useState } from "react";
import PawnPromotionMenu from "./components/PawnPromotionMenu";
import CapturedFiguresDisplay from "./components/CapturedFiguresDisplay";
import {
  initialChessField,
  validateMove,
  handleFigureCapture,
  checkIfKingIsChecked,
  rotateBoard,
  checkForCheckmate,
  getNewPositions,
  checkIfCanCastle,
  castle,
  checkIfPawnShouldBePromoted,
} from "./utils/logic";

function App() {
  const [turn, setTurn] = useState(1);
  const [checked, setChecked] = useState({ white: false, black: false });
  const [checkMate, setCheckMate] = useState({ winner: null });
  const [showFigureSelection, setShowFigureSelection] = useState(false);
  const [pawnPromotionField, setPawnPromotionField] = useState({ letter: null, number: null });
  const [capturedFigures, setCapturedFigures] = useState({ black: [], white: [] });
  const [points, setPoints] = useState({ white: 0, black: 0 });
  // const [reversed, setReversed] = useState(false);
  const [selectedFigure, setSelectedFigure] = useState({
    number: null,
    letter: null,
    figure: null,
  });
  const currentPlayer = turn % 2 !== 0 ? "White" : "Black";
  const [figurePositions, setFigurePositions] = useState(initialChessField());

  function selectNewFigureForPawn({ letter, number, color }) {
    setPawnPromotionField({ letter, number, color }, setShowFigureSelection(true));
  }

  function promotePawn(figure) {
    const pawn = figurePositions[pawnPromotionField.letter][pawnPromotionField.number - 1];
    const colorPrefix = pawn[0];
    let newPositions = JSON.parse(JSON.stringify(figurePositions));
    newPositions[pawnPromotionField.letter][pawnPromotionField.number - 1] = colorPrefix + figure;
    setFigurePositions(newPositions);
    setShowFigureSelection(false);
    setPawnPromotionField({ letter: null, number: null });

    const whiteKingChecked = checkIfKingIsChecked({
      figurePositions: newPositions,
      color: "white",
    });
    const blackKingChecked = checkIfKingIsChecked({
      figurePositions: newPositions,
      color: "black",
    });

    setChecked({ black: blackKingChecked, white: whiteKingChecked });

    if (blackKingChecked) {
      const checkMate = checkForCheckmate({ color: "black", figurePositions: newPositions });

      if (checkMate) {
        setCheckMate({ winner: "white" });
      }
    }

    if (whiteKingChecked) {
      const checkMate = checkForCheckmate({ color: "white", figurePositions: newPositions });

      if (checkMate) {
        setCheckMate({ winner: "black" });
      }
    }
  }


  function updateFigurePosition({ oldLetter, newLetter, oldNumber, newNumber, figure }) {
    const moveIsValid = validateMove({
      oldLetter,
      newLetter,
      figure,
      oldNumber,
      newNumber,
      figurePositions,
      turn
    });

    if (moveIsValid) {
      const newPositions = getNewPositions({
        oldLetter,
        newLetter,
        oldNumber,
        newNumber,
        figure,
        figurePositions,
      });

      const whiteKingIsChecked = checkIfKingIsChecked({
        figurePositions: newPositions,
        color: "white",
      });
      const blackKingIsChecked = checkIfKingIsChecked({
        figurePositions: newPositions,
        color: "black",
      });

      if ((turn % 2 === 0 && blackKingIsChecked) || (turn % 2 !== 0 && whiteKingIsChecked)) {
        return false;
      } else {
        setChecked({ white: whiteKingIsChecked, black: blackKingIsChecked }, console.log(checked));
        setFigurePositions(newPositions);
        const figureOnNewField = figurePositions[newLetter][newNumber - 1];

        if (figureOnNewField != null && figureOnNewField[0] !== figure[0]) {
          const capturedFigure = figureOnNewField.slice(1, figureOnNewField.length);

          if (figure[0] === "W") {
            const newCapturedFigures = [...capturedFigures.white, capturedFigure].sort();
            setCapturedFigures({ ...capturedFigures, white: newCapturedFigures });
            handleFigureCapture({ capturedFigure, color: "white", points, setPoints });
          } else {
            const newCapturedFigures = [...capturedFigures.black, capturedFigure].sort();
            setCapturedFigures({ ...capturedFigures, black: newCapturedFigures });
            handleFigureCapture({ capturedFigure, color: "black", points, setPoints });
          }
        }

        if (whiteKingIsChecked) {
          const checkMate = checkForCheckmate({ color: "white", figurePositions: newPositions });

          if (checkMate) {
            setCheckMate({ winner: "black" });
          }
        }

        if (blackKingIsChecked) {
          const checkMate = checkForCheckmate({ color: "black", figurePositions: newPositions });

          if (checkMate) {
            setCheckMate({ winner: "white" });
          }
        }

        rotateBoard({ figurePositions: newPositions, setFigurePositions });
        return true;
      }
    } else {
      return false;
    }
  }

  function restartGame() {
    setTurn(1);
    setChecked({ white: false, black: false });
    setCheckMate({ winner: null });
    setFigurePositions(initialChessField());
    setShowFigureSelection(false);
    setPawnPromotionField({ letter: null, number: null });
    setSelectedFigure({ number: null, letter: null, figure: null });
    setCapturedFigures({ white: [], black: [] });
    setPoints({ white: 0, black: 0 });
  }

  const fieldRows = Object.keys(figurePositions).map((letter) => {
    return (
      <GameContext.Provider
        value={{
          figurePositions,
          setFigurePositions,
          updateFigurePosition,
          setSelectedFigure,
          checked,
          rotateBoard,
          selectNewFigureForPawn,
          capturedFigures,
          setCapturedFigures,
          setPawnPromotionField,
          showFigureSelection,
          castle,
          checkIfCanCastle,
          checkIfPawnShouldBePromoted,
          turn,
          checkMate,
          setTurn,
          selectedFigure,
        }}
      >
        <FieldRow
          updateFigurePosition={updateFigurePosition}
          letter={letter}
          figures={figurePositions[letter]}
        />
      </GameContext.Provider>
    );
  });

  const checkMateScreen = checkMate.winner ? (
    <div className="checkmate-div">
      <h1>{checkMate.winner === "white" ? "White" : "Black"} wins!</h1>
    </div>
  ) : (
    <></>
  );

  const figureSelectionMenu = (
    <PawnPromotionMenu color={pawnPromotionField.color ?? "white"} promotePawn={promotePawn} />
  );

  const capturedFiguresDisplayWhite = (
    <CapturedFiguresDisplay color={"black"} capturedFigures={capturedFigures.white} />
  );

  const capturedFiguresDisplayBlack = (
    <CapturedFiguresDisplay color={"white"} capturedFigures={capturedFigures.black} />
  );

  const pointsDisplayBlack = (
    <div className="points-display-div">
      {points.black > points.white ? "+" + (points.black - points.white).toString() : ""}
    </div>
  );

  const pointsDisplayWhite = (
    <div className="points-display-div">
      {points.black < points.white ? "+" + (points.white - points.black).toString() : ""}
    </div>
  );

  return (
    <>
      <header>
        <button onClick={() => restartGame()} className="restart-btn">
          Restart
        </button>
        <h1>
          Turn: {turn} | Player: {currentPlayer}
        </h1>
      </header>
      <div className="main-container">
        {checkMateScreen}
        {showFigureSelection ? figureSelectionMenu : <></>}
        {pointsDisplayBlack}
        {capturedFiguresDisplayBlack}
        <div className="row">{fieldRows}</div>
        {capturedFiguresDisplayWhite}
        {pointsDisplayWhite}
      </div>
    </>
  );
}

export default App;
