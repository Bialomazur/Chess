import React from "react";
import whiteKnight from "../../media/images/white/white-knight.png";
import blackKnight from "../../media/images/black/black-knight.png";

export default function Knight({ number, color}) {

  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const src = color !== "white" ? blackKnight : whiteKnight;
  return <img onDragStart={preventDragHandler} src={src} className="knight" />;
}
