import omni from "../omni";
import KeyPair from "../omni/types/keypair";
import { getFormValue, handleForm } from "../utils";

const generateMessage =
  (keys: KeyPair | null) => async (form: HTMLFormElement) => {
    const method = getFormValue(form, "method");
    const data = getFormValue(form, "data");
    const envelope = await omni.message.messageToEnvelope(
      { method, data },
      keys
    );
    return envelope.toString("hex");
  };

interface MessageProps {
  keys: KeyPair | null;
  setReq: (res: string) => void;
}

function Message({ keys, setReq }: MessageProps) {
  return (
    <div className="Message Section">
      <h2>Message</h2>
      <form onSubmit={handleForm(generateMessage(keys), setReq)}>
        <label>
          From
          <input
            name="from"
            disabled
            value={omni.identity.keyPairToKid(keys)}
          />
        </label>
        <label>
          To
          <input name="to" placeholder="00" />
        </label>
        <label>
          Method
          <input name="method" defaultValue="endpoints" />
        </label>
        <label>
          Data
          <input name="data" />
        </label>
        <label>
          Timestamp
          <input name="timestamp" placeholder="Automatic" />
        </label>
        <label>
          Version
          <input name="version" placeholder="1" />
        </label>
        <br />
        <button>Generate</button>
      </form>
    </div>
  );
}

export default Message;
