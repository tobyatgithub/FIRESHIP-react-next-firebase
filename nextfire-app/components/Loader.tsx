import React from "react";

type Loader = {
  show: boolean;
};

export default function Loader({ show = true }): JSX.Element {
  return show ? <div className="loader"></div> : <div></div>;
}
