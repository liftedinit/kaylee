import { getFormValue, handleForm } from "../utils";

import Section from "./Section";

interface ServerProps {
  setServerUrl: (url: string) => void;
}

const getUrl = async (form: HTMLFormElement) => {
  const url = getFormValue(form, "url");
  return url;
};

function Server({ setServerUrl }: ServerProps) {
  return (
    <Section title="Server">
      <form onSubmit={handleForm(getUrl, setServerUrl)}>
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

export default Server;
