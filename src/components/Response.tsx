import React from "react";
import { Message } from "@liftedinit/many-js";
import { CoseMessage } from "@liftedinit/many-js/dist/message/cose";
import { Tab, Tabs, TabList, TabPanel, TabPanels } from "@liftedinit/ui";

import Section from "./Section";

interface ResponseProps {
  res: string;
}

function Response({ res }: ResponseProps) {
  const cose = res.length
    ? CoseMessage.fromCborData(Buffer.from(res, "hex")).toString()
    : "";
  const message = res.length
    ? Message.fromCborData(Buffer.from(res, "hex")).toString()
    : "";
  return (
    <Section title="Response">
      <Tabs>
        <TabList>
          <Tab>Encoded (CBOR)</Tab>
          <Tab>Decoded (JSON)</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <textarea
              style={{ height: "15em" }}
              name="hex"
              value={res}
              disabled
            />
          </TabPanel>
          <TabPanel>
            <pre>{cose}</pre>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Section>
  );
}
export default Response;
