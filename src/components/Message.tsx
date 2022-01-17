import React from "react";

import omni from "omni";
import { OmniError } from "omni/dist/cose";
import { KeyPair } from "omni/dist/keys";
import { getFormValue, handleForm } from "../utils";

const parseData = (data: string) => {
  if (!data) {
    return undefined;
  }
  if (data.slice(0, 2) === "[[") {
    return new Map(JSON.parse(data));
  }
  return JSON.parse(data);
};

const generateMessage =
  (keys: KeyPair | undefined) => async (form: HTMLFormElement) => {
    const method = getFormValue(form, "method");
    const data = getFormValue(form, "data");

    const envelope = omni.message.encode(
      { method, data: parseData(data) },
      keys
    );
    return envelope.toString("hex");
  };

interface MessageProps {
  keys?: KeyPair;
  setReq: (res: string) => void;
  serverUrl: string;
}

function Message({ keys, setReq, serverUrl }: MessageProps) {
  const [methodOptions, setMethodOptions] = React.useState<string[]>([]);
  React.useEffect(() => {
    const fetchEndpoints = async () => {
      let endpoints;
      try {
        endpoints = await omni.server.send(serverUrl, {
          method: "endpoints",
        });
        setMethodOptions(endpoints);
      } catch (e) {
        if (e instanceof OmniError) {
          console.log(e.message);
        } else {
          throw e;
        }
      } finally {
        setMethodOptions(endpoints ? endpoints : []);
      }
    };
    fetchEndpoints();
  }, [serverUrl]);
  const identity = keys
    ? omni.identity.fromPublicKey(keys.publicKey)
    : undefined;
  return (
    <div className="Message Section">
      <h2>Message</h2>
      <form onSubmit={handleForm(generateMessage(keys), setReq)}>
        <label>
          From
          <input
            name="from"
            disabled
            value={omni.identity.toString(identity)}
          />
        </label>
        <label>
          To
          <input name="to" placeholder="00" />
        </label>
        <label>
          Method
          <input list="method-options" name="method" />
          {methodOptions && methodOptions.length ? (
            <span>
              <datalist id="method-options">
                {methodOptions.map((option: string, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </datalist>
            </span>
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
