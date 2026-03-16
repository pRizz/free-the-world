// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Expected the #app root element to exist before client mount.");
}

export default mount(() => <StartClient />, root);
