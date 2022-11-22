import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@liftedinit/ui";

interface NetworkProps {
  url: string;
  setUrl: (url: string) => void;
}

function Network({ url, setUrl }: NetworkProps) {
  const [input, setInput] = React.useState(url);
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
    </Box>
  );
}

export default Network;
