import React from "react";
import { getFormValue, handleForm } from "../utils";
import {
  KeyPair,
  createMnemonic,
  mnemonicToKeyPair,
  pemToKeyPair,
} from "../lib/identity";
import "./Identity.css";

interface IdentityProps {
  setKeys: (keys: KeyPair | null) => void;
}

const importMnemonic = async (form: HTMLFormElement) => {
  const mnemonic = getFormValue(form, "mnemonic");
  return mnemonicToKeyPair(mnemonic);
};

const importPem = async (form: HTMLFormElement) => {
  const pem = getFormValue(form, "pem");
  return pemToKeyPair(pem);
};

function Identity({ setKeys }: IdentityProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [mnemonic, setMnemonic] = React.useState(createMnemonic());
  return (
    <div className="Identity Section">
      <h2>Identity</h2>
      <div className="ButtonGroup">
        <button
          className={activeTab === 0 ? "active" : ""}
          onClick={() => {
            setKeys(null);
            setActiveTab(0);
          }}
        >
          Anonymous
        </button>
        <button
          className={activeTab === 1 ? "active" : ""}
          onClick={() => {
            setMnemonic(createMnemonic());
            setActiveTab(1);
          }}
        >
          Random
        </button>
        <button
          className={activeTab === 2 ? "active" : ""}
          onClick={() => setActiveTab(2)}
        >
          Seed Words
        </button>
        <button
          className={activeTab === 3 ? "active" : ""}
          onClick={() => setActiveTab(3)}
        >
          Import PEM
        </button>
      </div>
      <div className="TabContent">
        <div className={activeTab === 0 ? "Tab active" : "Tab"} />
        <div className={activeTab === 1 ? "Tab active" : "Tab"}>
          <form onSubmit={handleForm(importMnemonic, setKeys)}>
            <textarea name="mnemonic" disabled value={mnemonic} />
            <button>Import</button>
          </form>
        </div>
        <div className={activeTab === 2 ? "Tab active" : "Tab"}>
          <form onSubmit={handleForm(importMnemonic, setKeys)}>
            <textarea name="mnemonic" />
            <button>Import</button>
          </form>
        </div>
        <div className={activeTab === 3 ? "Tab active" : "Tab"}>
          <form onSubmit={handleForm(importPem, setKeys)}>
            <textarea name="pem" />
            <button>Import</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Identity;
