import React from "react";
import CheatingWarning from "./CheatingAlert";

export default function TestCheating() {
  return <>
    <CheatingWarning variant="warning" detail="Found opening a new tab"/>
  </>;
}
