import React from "react";
import {
  Ed25519KeyPairIdentity as Id,
  Message as Msg,
} from "@liftedinit/many-js";

import Logo from "./Logo";
import Network from "./Network";
import Identity from "./Identity";
import Message from "./Message";
import Request from "./Request";
import Response from "./Response";

import { Container, Stack } from "@liftedinit/ui";

function App() {
  const [url, setUrl] = React.useState("http://localhost:8000");
  const [id, setId] = React.useState<Id | undefined>();
  const [msg, setMsg] = React.useState<Msg | undefined>();
  const [res, setRes] = React.useState("");

  return (
    <Container>
      <Logo />
      <Stack gap={6}>
        <Network url={url} setUrl={setUrl} />
        <Identity setId={setId} />
        <Message id={id} setMsg={setMsg} />
        <Request url={url} id={id} msg={msg} setRes={setRes} />
        <Response res={res} />
      </Stack>
    </Container>
  );
}

export default App;
