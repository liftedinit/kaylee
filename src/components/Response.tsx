import { Message as Msg } from "@liftedinit/many-js";
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Heading,
  Textarea,
} from "@liftedinit/ui";

interface ResponseProps {
  res: string;
}

function Response({ res }: ResponseProps) {
  return (
    <Box bg="white" p={6}>
      <Heading>Response</Heading>

      <Tabs>
        <TabList>
          <Tab>Encoded (CBOR)</Tab>
          <Tab>Decoded (JSON)</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Textarea isReadOnly name="hex" value={res} />
          </TabPanel>
          <TabPanel>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {res && Msg.fromCborData(Buffer.from(res, "hex")).toString()}
            </pre>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
export default Response;
