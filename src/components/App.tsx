import React from "react";
import KeyPair from "../omni/types/keypair";

import Columns from "./Columns";
import Identity from "./Identity";
import Logo from "./Logo";
import Message from "./Message";
import Request from "./Request";
import Response from "./Response";

import "./App.css";

function App() {
  const [keys, setKeys] = React.useState<KeyPair | null>(null);
  const [req, setReq] = React.useState("");
  const [res, setRes] = React.useState("");

  return (
    <div className="App">
      <Logo />

      <Identity setKeys={setKeys} />
      <Message keys={keys} setReq={setReq} />
      <Columns>
        <Request req={req} setRes={setRes} />
        <Response res={res} />
      </Columns>
    </div>
  );
}

export default App;
