import React from "react";

import omni from "../omni";
import { Identity as ID } from "../omni/types";
import { getFormValue, handleForm } from "../utils";

const generateMessage = (keys: ID) => async (form: HTMLFormElement) => {
  const method = getFormValue(form, "method");
  const data = getFormValue(form, "data");
  const envelope = omni.message.encode({ method, data }, keys);
  return envelope.toString("hex");
};

interface MessageProps {
  keys: ID;
  setReq: (res: string) => void;
  serverUrl: string;
}

function Message({ keys, setReq, serverUrl }: MessageProps) {
  const [methodOptions, setMethodOptions] = React.useState<string[]>([]);
  React.useEffect(() => {
    const fetchEndpoints = async () => {
      const endpoints = await omni.server.send(serverUrl, {
        method: "endpoints",
      });
      setMethodOptions(endpoints);
    };
    fetchEndpoints();
  }, [serverUrl]);
  return (
    <div className="Message Section">
      <h2>Message</h2>
      <form onSubmit={handleForm(generateMessage(keys), setReq)}>
        <label>
          From
          <input name="from" disabled value={omni.identity.toHex(keys)} />
        </label>
        <label>
          To
          <input name="to" placeholder="00" />
        </label>
        <label>
          Method
          {methodOptions.length ? (
            <select name="method" defaultValue="endpoints">
              {methodOptions.map((option: string, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            ""
          )}
        </label>
        <label>
          Data
          <input name="data" />
        </label>
        <label>
          Timestamp
          <input name="timestamp" placeholder="Automatic" />
        </label>
        <label>
          Version
          <input name="version" placeholder="1" />
        </label>
        <br />
        <button>Generate</button>
      </form>
    </div>
  );
}

export default Message;
