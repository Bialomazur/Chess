import React from "react";
import Rook from "./figures/Rook";
import Knight from "./figures/Knight";
import Queen from "./figures/Queen";
import Bishop from "./figures/Bishop";

export default function PawnPromotionMenu({ color, promotePawn }) {
  const figures = [
    ["Knight", Knight],
    ["Bishop", Bishop],
    ["Rook", Rook],
    ["Queen", Queen],
  ];

  function getImage(figure) {
    switch (figure) {
      case "Knight":
        return Knight;

      case "Bishop":
        return Bishop;

      case "Rook":
        return Rook;

      case "Queen":
        return Queen;
    }
  }

  const buttons = figures.map((f) => {
    const Image = getImage(f[0])
    const figure = f[0];
    return (
      <button onClick={(e) => promotePawn(figure)}>
        <Image color={color} />
      </button>
    );
  });

  return (
    <div className="figure-selection-div">
      <div className="row">{buttons}</div>
    </div>
  );
}
