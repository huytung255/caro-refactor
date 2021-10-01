import React, { useState } from "react";
const BoardModifier = ({ setter }) => {
  const [value, setValue] = useState(3);
  function handleChange(e) {
    const regex = /^[0-9\b]+$/;
    if (regex.test(e.target.value)) setValue(Number.parseInt(e.target.value));
    else return;
  }
  function handleApply() {
    if (value >= 3) setter(value);
  }
  return (
    <>
      <input
        type="number"
        value={value}
        min={3}
        onChange={(e) => handleChange(e)}
      />
      <button onClick={() => handleApply()}>Apply</button>
    </>
  );
};

export default BoardModifier;
