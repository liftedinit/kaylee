import React from "react";
import omni from "omni";

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
  return (
    <Section title="Response">
      <ButtonGroup tab={activeTab} setTab={setActiveTab}>
        <Button label="Encoded (CBOR)" />
        <Button label="Decoded (JSON)" />
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
          <pre>{omni.message.toJSON(Buffer.from(res, "hex"))}</pre>
        </Tab>
      </Tabs>
    </Section>
  );
}
export default Response;
