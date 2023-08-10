import React from "react";
import {
  Address,
  Ed25519KeyPairIdentity as Id,
  Message as Msg,
} from "@liftedinit/many-js";
import { Box, Button, Heading } from "@liftedinit/ui";
import Field from "./Field";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Box bg="white" p={6}>
      <Heading>Message</Heading>
      <Field name="from" label="From" isReadOnly value={form.from} />
      <Field name="to" label="To" placeholder="00" onChange={handleChange} />
      <Field name="method" label="Method" isRequired onChange={handleChange} />
      <Field name="data" label="Data" onChange={handleChange} />
      <Field
        name="timestamp"
        label="Timestamp"
        placeholder="Automatic"
        onChange={handleChange}
      />
      <Field
        name="version"
        label="Version"
        placeholder="1"
        onChange={handleChange}
      />
      <Button mt={6} onClick={async () => setMsg(makeMessage(form))}>
        Generate
      </Button>
      <pre>{id?.publicKey.toString()}</pre>
    </Box>
  );
}

export default Message;
