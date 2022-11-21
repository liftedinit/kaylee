import React from "react";
import {
  Ed25519KeyPairIdentity as KeyPair,
  Message as Msg,
  Address,
} from "@liftedinit/many-js";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Flex,
  Input,
  Button,
} from "@liftedinit/ui";

function makeMessage(keys: KeyPair | undefined, form: MessageForm) {
  return Msg.fromObject({
    from: Address.fromString(form.from),
    to: Address.fromString(form.to),
    method: form.method,
    data: form.data
      ? form.data.slice(0, 2) === "[["
        ? new Map(JSON.parse(form.data))
        : JSON.parse(form.data)
      : undefined,
  })
    .toCborData(keys)
    .toString();
}

interface MessageForm {
  to: string;
  from: string;
  method: string;
  data: string;
  timestamp: string;
  version: string;
}

const initialForm = {
  to: "",
  from: "",
  method: "",
  data: "",
  timestamp: "",
  version: "",
};

interface MessageProps {
  keys?: KeyPair;
  setReq: (res: string) => void;
  url: string;
}

function Message({ keys, setReq, url }: MessageProps) {
  const address = new Address(
    keys ? Buffer.from(keys.publicKey) : undefined
  ).toString();
  const [form, setForm] = React.useState<MessageForm>({
    ...initialForm,
    from: address,
  });

  return (
    <Box bg="white" p={6}>
      <Heading>Message</Heading>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="from">
            From
          </FormLabel>
          <Input id="from" name="from" isReadOnly value={address} />
        </Flex>
      </FormControl>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="to">
            To
          </FormLabel>
          <Input
            id="to"
            name="to"
            placeholder="00"
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </Flex>
      </FormControl>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="method">
            Method
          </FormLabel>
          <Input
            id="method"
            name="method"
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </Flex>
      </FormControl>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="data">
            Data
          </FormLabel>
          <Input
            id="data"
            name="data"
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />
        </Flex>
      </FormControl>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="timestamp">
            Timestamp
          </FormLabel>
          <Input
            id="timestamp"
            name="timestamp"
            placeholder="Automatic"
            onChange={(e) =>
              setForm({
                ...form,
                [e.target.name]: e.target.value,
              })
            }
          />
        </Flex>
      </FormControl>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="Version">
            Version
          </FormLabel>
          <Input
            id="version"
            name="version"
            placeholder="1"
            onChange={(e) =>
              setForm({
                ...form,
                [e.target.name]: e.target.value,
              })
            }
          />
        </Flex>
      </FormControl>
      <Button mt={6} onClick={() => setReq(makeMessage(keys, form))}>
        Generate
      </Button>
    </Box>
  );
}

export default Message;
