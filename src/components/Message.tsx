import React from "react";
import { Identity, KeyPair, Message as Msg } from "many";

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
    return Msg.fromObject({ method, data: parseData(data) })
      .toCborData(keys)
      .toString("hex");
  };

interface MessageProps {
  keys?: KeyPair;
  setReq: (res: string) => void;
  url: string;
}

function Message({ keys, setReq, url }: MessageProps) {
  const [methodOptions, setMethodOptions] = React.useState<string[]>([]);
  React.useEffect(() => {
    //   const fetchEndpoints = async () => {
    //     let endpoints;
    //     try {
    //       const network = new Network(url, keys);
    //       endpoints = await network.call("endpoints");
    //       setMethodOptions(endpoints);
    //     } catch (e) {
    //       if (e instanceof ManyError) {
    //         console.log(e.message);
    //       } else {
    //         throw e;
    //       }
    //     } finally {
    //       setMethodOptions(endpoints ? endpoints : []);
    //     }
    //   };
    //   fetchEndpoints();
    setMethodOptions([]);
  }, [url]);
  const identity = keys
    ? Identity.fromPublicKey(keys.publicKey)
    : new Identity();
  return (
    <div className="Message Section">
      <h2>Message</h2>
      <form onSubmit={handleForm(generateMessage(keys), setReq)}>
        <label>
          From
          <input name="from" disabled value={identity.toString()} />
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
