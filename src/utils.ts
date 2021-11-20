import React from "react";

export function getFormValue(form: HTMLFormElement, name: string): string {
  return (form.elements.namedItem(name) as HTMLInputElement).value;
}

export function replacer(key: string, value: any) {
  if (typeof value === "bigint") {
    return parseInt(value.toString());
  }
  if (value.tag === 10000) {
    return Buffer.from(value.value).toString("hex");
  }
  return value;
}

export function handleForm(handler: Function, callback: Function) {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback(await handler(event.currentTarget));
  };
}
