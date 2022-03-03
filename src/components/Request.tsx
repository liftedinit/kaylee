import React from "react";
import { handleForm, getFormValue } from "../utils";
import { Message, Network } from "many";
import { CoseMessage } from "many/dist/message/cose";

import Section from "./Section";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import Tabs from "./Tabs";
import Tab from "./Tab";

const sendRequest = (url: string) => async (form: HTMLFormElement) => {
  const hex = getFormValue(form, "hex");
  const network = new Network(url);
  const res = await network.sendEncoded(Buffer.from(hex, "hex"));
  return res.toString("hex");
};

interface RequestProps {
  req: string;
  setRes: (res: string) => void;
  url: string;
}

function Request({ req, setRes, url }: RequestProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const cose = req.length
    ? CoseMessage.fromCborData(Buffer.from(req, "hex")).toString()
    : "";
  const message = req.length
    ? Message.fromCborData(Buffer.from(req, "hex")).toString()
    : "";
  return (
    <Section title="Request">
      <ButtonGroup tab={activeTab} setTab={setActiveTab}>
        <Button label="Encoded (CBOR)" />
        <Button label="Decoded (JSON)" />
        <Button label="Message (JSON)" />
      </ButtonGroup>

      <form onSubmit={handleForm(sendRequest(url), setRes)}>
        <Tabs tab={activeTab}>
          <Tab>
            <textarea
              style={{ height: "15em" }}
              name="hex"
              defaultValue={req}
            />
          </Tab>
          <Tab>
            <pre style={{ overflowWrap: "anywhere" }}>{cose}</pre>
          </Tab>
          <Tab>
            <pre style={{ overflowWrap: "anywhere" }}>{message}</pre>
          </Tab>
        </Tabs>
        <br />
        <button>Send</button>
      </form>
    </Section>
  );
}
export default Request;
