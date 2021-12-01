import React from "react";
import { decodeHex } from "../lib/message";

interface ResponseProps {
  res: string;
}

function Response({ res }: ResponseProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <div className="Response">
      <h2>Response</h2>
      <div className="ButtonGroup">
        <button
          className={activeTab === 0 ? "active" : ""}
          onClick={() => {
            setActiveTab(0);
          }}
        >
          Encoded (CBOR)
        </button>
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => {
            setActiveTab(1);
          }}
        >
          Decoded (JSON)
        </button>
      </div>
      <div className="TabContent">
        <div className={activeTab === 0 ? "Tab active" : "Tab"}>
          <textarea
            style={{ height: "15em" }}
            name="hex"
            value={res}
            disabled
          />
        </div>
        <div className={activeTab === 1 ? "Tab active" : "Tab"}>
          <pre>{decodeHex(res)}</pre>
        </div>
      </div>
    </div>
  );
}
export default Response;
