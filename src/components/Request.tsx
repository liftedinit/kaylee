import React from "react";
import {
  Ed25519KeyPairIdentity as Id,
  Message as Msg,
  Network,
} from "@liftedinit/many-js";
import {
  Box,
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@liftedinit/ui";

const sendReq = async (url: string, hex: string) => {
  const network = new Network(url);
  const res = await network.sendEncoded(Buffer.from(hex, "hex"));
  return res.toString("hex");
};

interface RequestProps {
  url: string;
  id: Id | undefined;
  msg?: Msg;
  setRes: (res: string) => void;
}

function Request({ url, id, msg, setRes }: RequestProps) {
  const [hex, setHex] = React.useState("");
  const [json, setJson] = React.useState("");

  React.useEffect(() => {
    async function convertMsg(msg: Msg) {
      const cose = await msg?.toCoseMessage(id);
      setHex(cose.toCborData().toString("hex"));
    }
    msg && convertMsg(msg);
  }, [id, msg]);

  React.useEffect(() => {
    function hexToJson(hex: string) {
      const cose = Msg.fromCborData(Buffer.from(hex, "hex"));
      setJson(cose.toString());
    }
    hex && hexToJson(hex);
  }, [hex]);

  return (
    <Box bg="white" p={6}>
      <Heading>Request</Heading>
      <Tabs>
        <TabList>
          <Tab>Encoded (CBOR)</Tab>
          <Tab>Decoded (JSON)</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Textarea
              name="hex"
              h={300}
              defaultValue={hex}
              onChange={(e) => setHex(e.target.value)}
            />
          </TabPanel>
          <TabPanel>
            <pre style={{ whiteSpace: "pre-wrap" }}>{json}</pre>
          </TabPanel>
          <br />
          <Button mt={6} onClick={async () => setRes(await sendReq(url, hex))}>
            Send
          </Button>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
export default Request;
