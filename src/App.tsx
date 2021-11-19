import React from "react";
import {
  encodeMessage,
  decodeResponse,
  createMnemonic,
  generateKeys,
  generateKeysFromPem,
  getFormValue,
  replacer,
  sendMessage,
  KeyPair,
} from "./utils";

import "./App.css";

const importMnemonic = async (form: HTMLFormElement) => {
  const mnemonic = getFormValue(form, "mnemonic");
  return generateKeys(mnemonic);
};

const importPem = async (form: HTMLFormElement) => {
  const pem = getFormValue(form, "pem");
  return generateKeysFromPem(pem);
};

const generateMessage = (keys: KeyPair) => async (form: HTMLFormElement) => {
  const method = getFormValue(form, "method");
  const data = getFormValue(form, "data");
  const message = await encodeMessage({ method, data }, keys);
  return message.toString("hex");
};

const sendRequest = async (form: HTMLFormElement) => {
  const message = getFormValue(form, "message");
  const url = getFormValue(form, "url");
  const response = await sendMessage(url, Buffer.from(message, "hex"));
  const reply = await decodeResponse(response);
  // @TODO: Verify response
  return reply;
};

const handleForm =
  (handler: Function, callback: Function) =>
  async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback(await handler(event.currentTarget));
  };

function App() {
  const [keys, setKeys] = React.useState({
    publicKey: new Uint8Array(),
    privateKey: new Uint8Array(),
  });
  const [message, setMessage] = React.useState("");
  const [reply, setReply] = React.useState({});
  return (
    <div className="App">
      <h1>OmniPanel</h1>

      <h2>Identity</h2>
      <form onSubmit={handleForm(importMnemonic, setKeys)}>
        <label>Mnemonic</label>
        <textarea name="mnemonic" defaultValue={createMnemonic()} />
        <button>Import</button>
      </form>
      <form onSubmit={handleForm(importPem, setKeys)}>
        <label>PEM</label>
        <textarea name="pem" defaultValue={""} />
        <button>Import</button>
      </form>

      <h2>Message</h2>
      <form onSubmit={handleForm(generateMessage(keys), setMessage)}>
        <label>
          Method
          <input name="method" defaultValue="ledger.info" />
        </label>
        <label>
          Data
          <input name="data" />
        </label>
        <br />
        <label>Keys</label>
        <pre>{JSON.stringify(keys)}</pre>
        <button>Generate</button>
      </form>

      <h2>Send</h2>
      <form onSubmit={handleForm(sendRequest, setReply)}>
        <label>
          URL
          <input name="url" defaultValue="http://localhost:8000" />
        </label>
        <br />
        <label>Message</label>
        <textarea name="message" defaultValue={message} />
        <button>Send</button>
      </form>

      <h2>Reply</h2>
      <pre>{JSON.stringify(reply, replacer)}</pre>
    </div>
  );
}

export default App;
