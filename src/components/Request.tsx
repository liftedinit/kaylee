import { handleForm, getFormValue } from "../utils";
import { Message, Network } from "@liftedinit/many-js";
import { CoseMessage } from "@liftedinit/many-js/dist/message/cose";
import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Heading,
  Button,
} from "@liftedinit/ui";

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
  const cose = req.length
    ? CoseMessage.fromCborData(Buffer.from(req, "hex")).toString()
    : "";
  const message = req.length
    ? Message.fromCborData(Buffer.from(req, "hex")).toString()
    : "";
  return (
    <Box bg="white" p={6}>
      <Heading>Request</Heading>
      <Tabs>
        <TabList>
          <Tab>Encoded (CBOR)</Tab>
          <Tab>Decoded (JSON)</Tab>
        </TabList>

        <TabPanels>
          <form onSubmit={handleForm(sendRequest(url), setRes)}>
            <TabPanel>
              <textarea
                style={{ height: "15em" }}
                name="hex"
                defaultValue={req}
              />
            </TabPanel>
            <TabPanel>
              <pre style={{ overflowWrap: "anywhere" }}>{cose}</pre>
            </TabPanel>
            <br />
            <Button mt={6}>Send</Button>
          </form>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
export default Request;
