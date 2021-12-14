import React from "react";
import omni from "omni";
import { Identity as ID } from "omni/dist/identity";
import { getFormValue, handleForm } from "../utils";

import Button from "./Button";
import ButtonGroup from "./ButtonGroup";
import Section from "./Section";
import Tabs from "./Tabs";
import Tab from "./Tab";

interface IdentityProps {
  setKeys: (keys: ID) => void;
}

const importMnemonic = async (form: HTMLFormElement) => {
  const mnemonic = getFormValue(form, "mnemonic");
  return omni.identity.fromSeedWords(mnemonic);
};

const importPem = async (form: HTMLFormElement) => {
  const pem = getFormValue(form, "pem");
  return omni.identity.fromPem(pem);
};

function Identity({ setKeys }: IdentityProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [mnemonic, setMnemonic] = React.useState(omni.identity.getSeedWords());
  return (
    <Section title="Identity">
      <ButtonGroup tab={activeTab} setTab={setActiveTab}>
        <Button label="Anonymous" onClick={() => setKeys(null)} />
        <Button
          label="Random"
          onClick={() => setMnemonic(omni.identity.getSeedWords())}
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
