import React from "react";
import { Ed25519KeyPairIdentity as Id } from "@liftedinit/many-js";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@liftedinit/ui";

interface IdentityProps {
  setId: (id?: Id) => void;
}

function Identity({ setId }: IdentityProps) {
  const [mnemonic, setMnemonic] = React.useState(Id.getMnemonic());
  const [textarea, setTextarea] = React.useState("");
  return (
    <Box bg="white" p={6}>
      <Heading>Identity</Heading>
      <Tabs>
        <TabList>
          <Tab onClick={() => setId()}>Anonymous</Tab>
          <Tab onClick={() => setMnemonic(Id.getMnemonic())}>Random</Tab>
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
            <Button mt={6} onClick={() => setId(Id.fromMnemonic(mnemonic))}>
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
            <Button mt={6} onClick={() => setId(Id.fromMnemonic(textarea))}>
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
            <Button mt={6} onClick={() => setId(Id.fromPem(textarea))}>
              Import
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Identity;
