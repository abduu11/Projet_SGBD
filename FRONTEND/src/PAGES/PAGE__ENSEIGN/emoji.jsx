// src/components/Emoji.js
import React from "react";

const Emoji = ({ symbol, label }) => (
  <span role="img" aria-label={label} style={{ fontSize: "24px", marginRight: "8px" }}>
    {symbol}
  </span>
);

export default Emoji;
