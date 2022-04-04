import React from 'react'
import Rook from './figures/Rook'
import Bishop from './figures/Bishop'
import Queen from './figures/Queen'
import Knight from './figures/Knight'
import Pawn from './figures/Pawn'


export default function CapturedFiguresDisplay({capturedFigures, color}) {

    function determineImage(figure){

        switch (figure){

            case "Pawn":
                return Pawn;

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

    const figures = capturedFigures.map(f => {
        const Image = determineImage(f);
        return <div className="figure-image-container"><Image color={color}/></div>
    })

    return (
        <div className="figures-display">
            {figures}
        </div>
    )
}
