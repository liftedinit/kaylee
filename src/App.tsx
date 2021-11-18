import React from "react";
import {
  encodeMessage,
  decodeResponse,
  generateKeys,
  getFormValue,
  replacer,
  sendMessage,
} from "./utils";

import "./App.css";

const generateMessage = async (form: HTMLFormElement) => {
  const method = getFormValue(form, "method");
  const data = getFormValue(form, "data");
  const keys = generateKeys();
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
  const [message, setMessage] = React.useState("");
  const [reply, setReply] = React.useState({});
  return (
    <div className="App">
      <h1>OmniMessage</h1>

      <h2>Generate</h2>
      <form onSubmit={handleForm(generateMessage, setMessage)}>
        <label>
          Method
          <input name="method" defaultValue="ledger.info" />
        </label>
        <label>
          Data
          <input name="data" />
        </label>
        <button>Generate</button>
      </form>

      <h2>Send</h2>
      <form onSubmit={handleForm(sendRequest, setReply)}>
        <label>
          URL
          <input name="url" defaultValue="http://localhost:8000" />
        </label>
        <textarea name="message" defaultValue={message} />
        <button>Send</button>
      </form>

      <h2>Reply</h2>
      <pre>{JSON.stringify(reply, replacer, 4)}</pre>
    </div>
  );
}

export default App;
