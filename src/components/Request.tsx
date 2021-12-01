import React from "react";
import { handleForm, getFormValue } from "../utils";
import { sendHex } from "../lib/client";
import { decodeHex, receiveResponse } from "../lib/message";

const sendRequest = async (form: HTMLFormElement) => {
  const hex = getFormValue(form, "hex");
  const url = getFormValue(form, "url");
  const response = await sendHex(url, hex);
  const reply = await receiveResponse(response);
  // @TODO: Verify response
  return reply;
};

interface RequestProps {
  req: string;
  setRes: (res: string) => void;
}

function Request({ req, setRes }: RequestProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <div className="Request">
      <h2>Request</h2>
      <div className="ButtonGroup">
        <button
          className={activeTab === 0 ? "active" : ""}
          onClick={() => setActiveTab(0)}
        >
          Encoded (CBOR)
        </button>
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => setActiveTab(1)}
        >
          Decoded (JSON)
        </button>
      </div>
      <div className="TabContent">
        <form onSubmit={handleForm(sendRequest, setRes)}>
          <div className={activeTab === 0 ? "Tab active" : "Tab"}>
            <textarea
              style={{ height: "15em" }}
              name="hex"
              defaultValue={req}
            />
          </div>
          <div className={activeTab === 1 ? "Tab active" : "Tab"}>
            <pre style={{ overflowWrap: "anywhere" }}>{decodeHex(req)}</pre>
          </div>
          <label>
            URL
            <input name="url" defaultValue="http://localhost:8000" />
          </label>
          <br />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}
export default Request;
