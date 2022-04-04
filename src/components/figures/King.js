import React from "react";

import whiteKing from "../../media/images/white/white-king.png";
import blackKing from "../../media/images/black/black-king.png";

export default function King({ number, color, letter }) {
    const src = color !== "white" ? blackKing : whiteKing;

    const preventDragHandler = (e) => {
      e.preventDefault();
    };


  return (
    <div>
      <img onDragStart={preventDragHandler} src={src} className="king" />
    </div>
  );
}
