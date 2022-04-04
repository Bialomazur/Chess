import React from 'react'
import whiteBishop from "../../media/images/white/white-bishop.png";
import blackBishop from "../../media/images/black/black-bishop.png";


export default function Bishop({number, color}) {
    const src = color !== "white" ? blackBishop : whiteBishop;

    const preventDragHandler = (e) => {
        e.preventDefault();
      };

    return (
        <div>
            <img onDragStart={preventDragHandler} src={src} className="bishop" />
        </div>
    )
}
