import blackPawn from "../../media/images/black/black-pawn.png";
import whitePawn from "../../media/images/white/white-pawn.png";
import propTypes from "prop-types";
import { TurnContext } from "../../contexts/TurnContext";
import { useState, useContext } from "react";

export default function Pawn({ number, letter, color}) {
  const src = color !== "white" ? blackPawn : whitePawn;
  // const turn = useContext(TurnContext);

  // function checkIfPlayersTurn(){
  //   switch (src){
  //     case blackPawn:
  //       return turn % 2 === 0

  //     case whitePawn:
  //       return turn % 2 !== 0
  //   }
  // }

  

  const preventDragHandler = (e) => {
    e.preventDefault();
  }
  

  return <img src={src} onDragStart={preventDragHandler} className="pawn" />;
}

Pawn.propTypes = {
  number: propTypes.number,
  letter: propTypes.string,
};
