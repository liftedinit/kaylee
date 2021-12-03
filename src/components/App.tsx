import React from "react";
import { KeyPair } from "../lib/identity";
import Identity from "./Identity";
import Message from "./Message";
import Request from "./Request";
import Response from "./Response";

import "./App.css";
import logo from "../logo.png";

function App() {
  const [keys, setKeys] = React.useState<KeyPair | null>(null);
  const [req, setReq] = React.useState("");
  const [res, setRes] = React.useState("");
  return (
    <div className="App">
      <img
        className="Logo"
        src={logo}
        alt="Kaylee by L1 Labs"
        style={{ height: 50, marginLeft: -10 }}
      />

      <Identity setKeys={setKeys} />
      <Message keys={keys} setReq={setReq} />
      <div className="Columns">
        <div className="Column">
          <Request req={req} setRes={setRes} />
        </div>
        <div className="Column">
          <Response res={res} />
        </div>
      </div>
    </div>
  );
}

export default App;
