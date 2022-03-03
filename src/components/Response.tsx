import React from "react";
import { Message } from "many";
import { CoseMessage } from "many/dist/message/cose";

import Section from "./Section";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import Tabs from "./Tabs";
import Tab from "./Tab";

interface ResponseProps {
  res: string;
}

function Response({ res }: ResponseProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const cose = res.length
    ? CoseMessage.fromCborData(Buffer.from(res, "hex")).toString()
    : "";
  const message = res.length
    ? Message.fromCborData(Buffer.from(res, "hex")).toString()
    : "";
  return (
    <Section title="Response">
      <ButtonGroup tab={activeTab} setTab={setActiveTab}>
        <Button label="Encoded (CBOR)" />
        <Button label="Decoded (JSON)" />
        <Button label="Message (JSON)" />
      </ButtonGroup>

      <Tabs tab={activeTab}>
        <Tab>
          <textarea
            style={{ height: "15em" }}
            name="hex"
            value={res}
            disabled
          />
        </Tab>
        <Tab>
          <pre>{cose}</pre>
        </Tab>
        <Tab>
          <pre>{message}</pre>
        </Tab>
      </Tabs>
    </Section>
  );
}
export default Response;
