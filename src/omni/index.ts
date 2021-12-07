// export * as client from "./client";
// export * as identity from "./identity";
// export * as message from "./message";
import * as server from "./client";
import * as identity from "./identity";
import * as message from "./message";

const omni = { server, identity, message };
export default omni;
