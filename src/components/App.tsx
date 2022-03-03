import React from "react";
import { KeyPair } from "many";

import Columns from "./Columns";
import Identity from "./Identity";
import Logo from "./Logo";
import Message from "./Message";
import Request from "./Request";
import Response from "./Response";
import Network from "./Network";

import "./App.css";

function App() {
  const [url, setUrl] = React.useState("http://localhost:8000");
  const [keys, setKeys] = React.useState<KeyPair | undefined>();
  const [req, setReq] = React.useState("");
  const [res, setRes] = React.useState("");

  return (
    <div className="App">
      <Logo />

      <Network setUrl={setUrl} />
      <Identity setKeys={setKeys} />
      <Message keys={keys} setReq={setReq} url={url} />
      <Columns>
        <Request req={req} setRes={setRes} url={url} />
        <Response res={res} />
      </Columns>
    </div>
  );
}

export default App;
