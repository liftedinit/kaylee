import React from "react";
import omni from "omni";
import { handleForm, getFormValue } from "../utils";

import Section from "./Section";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import Tabs from "./Tabs";
import Tab from "./Tab";

const sendRequest = (serverUrl: string) => async (form: HTMLFormElement) => {
  const hex = getFormValue(form, "hex");
  const response = await omni.server.sendEncoded(
    serverUrl,
    Buffer.from(hex, "hex")
  );
  return response.toString("hex");
};

interface RequestProps {
  req: string;
  setRes: (res: string) => void;
  serverUrl: string;
}

function Request({ req, setRes, serverUrl }: RequestProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <Section title="Request">
      <ButtonGroup tab={activeTab} setTab={setActiveTab}>
        <Button label="Encoded (CBOR)" />
        <Button label="Decoded (JSON)" />
      </ButtonGroup>

      <form onSubmit={handleForm(sendRequest(serverUrl), setRes)}>
        <Tabs tab={activeTab}>
          <Tab>
            <textarea
              style={{ height: "15em" }}
              name="hex"
              defaultValue={req}
            />
          </Tab>
          <Tab>
            <pre style={{ overflowWrap: "anywhere" }}>
              {omni.message.toJSON(Buffer.from(req, "hex"))}
            </pre>
          </Tab>
        </Tabs>
        <br />
        <button>Send</button>
      </form>
    </Section>
  );
}
export default Request;
