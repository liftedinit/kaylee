import React from "react";
import {
  Address,
  Ed25519KeyPairIdentity as Id,
  Message as Msg,
} from "@liftedinit/many-js";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@liftedinit/ui";

function makeMessage(form: MessageForm) {
  return Msg.fromObject({
    from: Address.fromString(form.from),
    to: form.to.length ? Address.fromString(form.to) : undefined,
    method: form.method,
    data: form.data.length
      ? form.data.slice(0, 2) === "[["
        ? new Map(JSON.parse(form.data))
        : JSON.parse(form.data)
      : undefined,
  });
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
  id?: Id;
  setMsg: (msg: Msg) => void;
}

function Message({ id, setMsg }: MessageProps) {
  const [form, setForm] = React.useState<MessageForm>(initialForm);

  React.useEffect(() => {
    const address = new Address(
      id ? Buffer.from(id.publicKey) : undefined
    ).toString();
    setForm((f) => ({ ...f, from: address }));
  }, [id]);

  return (
    <Box bg="white" p={6}>
      <Heading>Message</Heading>
      <FormControl>
        <Flex>
          <FormLabel w="200px" htmlFor="from">
            From
          </FormLabel>
          <Input id="from" name="from" isReadOnly value={form.from} />
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
      <FormControl isRequired>
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
      <Button mt={6} onClick={async () => setMsg(makeMessage(form))}>
        Generate
      </Button>
    </Box>
  );
}

export default Message;
