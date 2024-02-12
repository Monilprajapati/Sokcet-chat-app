import React from "react";

const Form = (props) => {
  return (
    <div className="formInput">
      <input
        className="formInput"
        type="text"
        placeholder="Enter your message..."
        value={props.username}
        onChange={props.onChange}
      />
      <button onClick={props.connect}>Connect</button>
    </div>
  );
};

export default Form;
