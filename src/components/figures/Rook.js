import React from 'react'
import whiteRook from "../../media/images/white/white-rook.png";
import blackRook from "../../media/images/black/black-rook.png"


export default function Rook({number, color, letter}) {
    const src = color !== "white" ? blackRook : whiteRook;

    const preventDragHandler = (e) => {
        e.preventDefault();
      };


    return (
        <img src={src} onDragStart={preventDragHandler} className="rook" />
    )
}
