import React from "react";

import whiteQueen from "../../media/images/white/white-queen.png";
import blackQueen from "../../media/images/black/black-queen.svg";

export default function Queen({ number, color, letter }) {
    const src = color !== "white" ? blackQueen : whiteQueen;

    const preventDragHandler = (e) => {
      e.preventDefault();
    };

  return <img src={src} onDragStart={preventDragHandler} className="queen" />;
}
