import React from "react";
import { Ed25519KeyPairIdentity as KeyPair } from "@liftedinit/many-js";
import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Button,
} from "@liftedinit/ui";

interface IdentityProps {
  setKeys: (keys?: KeyPair) => void;
}

function Identity({ setKeys }: IdentityProps) {
  const [mnemonic, setMnemonic] = React.useState(KeyPair.getMnemonic());
  const [textarea, setTextarea] = React.useState("");
  return (
    <Box bg="white" p={6}>
      <Heading>Identity</Heading>
      <Tabs>
        <TabList>
          <Tab onClick={() => setKeys()}>Anonymous</Tab>
          <Tab onClick={() => setMnemonic(KeyPair.getMnemonic())}>Random</Tab>
          <Tab>Seed Words</Tab>
          <Tab>Import PEM</Tab>
        </TabList>

        <TabPanels>
          <TabPanel />
          <TabPanel>
            <FormControl>
              <FormLabel m={0} htmlFor="mnemonic">
                Seed Words
              </FormLabel>
              <Textarea
                id="mnemonic"
                isReadOnly
                value={mnemonic}
                onChange={(e) => setTextarea(e.target.value)}
              />
            </FormControl>
            <Button
              mt={6}
              onClick={() => setKeys(KeyPair.fromMnemonic(mnemonic))}
            >
              Import
            </Button>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel m={0} htmlFor="mnemonic">
                Seed Words
              </FormLabel>
              <Textarea
                id="mnemonic"
                onChange={(e) => setTextarea(e.target.value)}
              />
            </FormControl>
            <Button
              mt={6}
              onClick={() => setKeys(KeyPair.fromMnemonic(textarea))}
            >
              Import
            </Button>
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel m={0} htmlFor="pem">
                PEM File
              </FormLabel>
              <Textarea
                id="pem"
                onChange={(e) => setTextarea(e.target.value)}
              />
            </FormControl>
            <Button mt={6} onClick={() => setKeys(KeyPair.fromPem(textarea))}>
              Import
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Identity;
