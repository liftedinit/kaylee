import React from "react";
import { KeyPair } from "omni/dist/keys";

import Columns from "./Columns";
import Identity from "./Identity";
import Logo from "./Logo";
import Message from "./Message";
import Request from "./Request";
import Response from "./Response";
import Server from "./Server";

import "./App.css";

function App() {
  const [serverUrl, setServerUrl] = React.useState("http://localhost:8000");
  const [keys, setKeys] = React.useState<KeyPair | undefined>();
  const [req, setReq] = React.useState("");
  const [res, setRes] = React.useState("");

  return (
    <div className="App">
      <Logo />

      <Server setServerUrl={setServerUrl} />
      <Identity setKeys={setKeys} />
      <Message keys={keys} setReq={setReq} serverUrl={serverUrl} />
      <Columns>
        <Request req={req} setRes={setRes} serverUrl={serverUrl} />
        <Response res={res} />
      </Columns>
    </div>
  );
}

export default App;
