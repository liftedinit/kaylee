import React from "react";
import {
  Badge,
  Box,
  Button,
  CheckIcon,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@liftedinit/ui";
import { Network as Net, NetworkStatusInfo, Base } from "@liftedinit/many-js";

interface NetworkProps {
  url: string;
  setUrl: (url: string) => void;
}

function Network({ url, setUrl }: NetworkProps) {
  const [input, setInput] = React.useState(url);
  const [status, setStatus] = React.useState<NetworkStatusInfo | undefined>(
    undefined
  );
  const [endpoints, setEndpoints] = React.useState<string[]>([]);
  React.useEffect(() => {
    async function connect() {
      try {
        const network = new Net(url);
        network.apply([Base]);
        const { status } = await network.base.status();
        const { endpoints } = await network.base.endpoints();
        setStatus(status);
        setEndpoints(endpoints);
      } catch {
        setStatus(undefined);
      }
    }
    connect();
  }, [url]);
  return (
    <Box bg="white" p={6}>
      <Heading>Network</Heading>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="url">
            URL
          </FormLabel>
          <Input
            id="url"
            type="url"
            defaultValue={url}
            onChange={(e) => setInput(e.target.value)}
          />
        </Flex>
      </FormControl>
      <Button mt={6} onClick={() => setUrl(input)}>
        Connect
      </Button>
      {status && (
        <Flex mt={6} gap={6}>
          <CheckIcon color="green" />
          <Box>
            <Text>
              Connected to <b>{status.serverName}</b>
            </Text>
            <code>{status.address}</code>
            <Box>
              {endpoints.map((end) => (
                <Badge key={end} mr={1} variant="outline">
                  {end}
                </Badge>
              ))}
            </Box>
          </Box>
        </Flex>
      )}
    </Box>
  );
}

export default Network;
