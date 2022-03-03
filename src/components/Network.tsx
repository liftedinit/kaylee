import { getFormValue, handleForm } from "../utils";

import Section from "./Section";

interface NetworkProps {
  setUrl: (url: string) => void;
}

const getUrl = async (form: HTMLFormElement) => {
  const url = getFormValue(form, "url");
  return url;
};

function Network({ setUrl }: NetworkProps) {
  return (
    <Section title="Network">
      <form onSubmit={handleForm(getUrl, setUrl)}>
        <label>
          URL
          <input name="url" defaultValue="http://localhost:8000" />
        </label>
        <br />
        <button>Connect</button>
      </form>
    </Section>
  );
}

export default Network;
