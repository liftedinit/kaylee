import React from "react";
import omni from "omni";
import { KeyPair } from "omni/dist/keys";
import { getFormValue, handleForm } from "../utils";

import Button from "./Button";
import ButtonGroup from "./ButtonGroup";
import Section from "./Section";
import Tabs from "./Tabs";
import Tab from "./Tab";

interface IdentityProps {
  setKeys: (keys?: KeyPair) => void;
}

const importMnemonic = async (form: HTMLFormElement) => {
  const mnemonic = getFormValue(form, "mnemonic");
  return omni.keys.fromSeedWords(mnemonic);
};

const importPem = async (form: HTMLFormElement) => {
  const pem = getFormValue(form, "pem");
  return omni.keys.fromPem(pem);
};

function Identity({ setKeys }: IdentityProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [mnemonic, setMnemonic] = React.useState(omni.keys.getSeedWords());
  return (
    <Section title="Identity">
      <ButtonGroup tab={activeTab} setTab={setActiveTab}>
        <Button label="Anonymous" onClick={() => setKeys()} />
        <Button
          label="Random"
          onClick={() => setMnemonic(omni.keys.getSeedWords())}
        />
        <Button label="Seed Words" />
        <Button label="Import PEM" />
      </ButtonGroup>
      <Tabs tab={activeTab}>
        <Tab />
        <Tab>
          <form onSubmit={handleForm(importMnemonic, setKeys)}>
            <textarea name="mnemonic" disabled value={mnemonic} />
            <button>Import</button>
          </form>
        </Tab>
        <Tab>
          <form onSubmit={handleForm(importMnemonic, setKeys)}>
            <textarea name="mnemonic" />
            <button>Import</button>
          </form>
        </Tab>
        <Tab>
          <form onSubmit={handleForm(importPem, setKeys)}>
            <textarea name="pem" />
            <button>Import</button>
          </form>
        </Tab>
      </Tabs>
    </Section>
  );
}

export default Identity;
