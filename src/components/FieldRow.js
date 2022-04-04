import Field from "./Field";
import PropTypes from "prop-types";
import { useContext } from "react";
import FieldRowLabel from "./FieldRowLabel";
import { GameContext } from "../contexts/GameContext";

export default function FieldRow({ letter, figures }) {
  const letters = "ABCDEFGH";
  const { turn } = useContext(GameContext);

  const getFiguresArray = () => {
    const reverse = turn % 2 === 0;


    if (reverse) {
      const reversedFigures = JSON.parse(JSON.stringify(figures))
      reversedFigures.reverse();
      return reversedFigures;
    }

    return figures;
  };

  const fieldsJson = figures.map((figure, index) => {
    return {
      number: index + 1,
      index: letters.indexOf(letter),
      letter,
      figure,
    };
  });

  const fields = fieldsJson.map((f) => {
    return Field({
      number: f.number,
      letter: f.letter,
      figure: f.figure,
      index: f.index,
    });
  });

  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const label = FieldRowLabel(letter)

  return (
    <div onDragStart={preventDragHandler} className="col">
      {label}
      {fields}
      {label}
    </div>
  );
}

FieldRow.propTypes = {
  letter: PropTypes.string,
};
