import React from "react";
import ReactDOM from "react-dom";
import './app.css';

const Row = ({ index, style }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {itemsArray[index].name}
  </div>
);

export default Example = () => (
  <div
    styleName="main"
  >
    {itemsArray.map((item, index) => Row({ index }))}
  </div>
);
