// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Expected the #app root element to exist before client mount.");
}

const dispose = mount(() => <StartClient />, root);

requestAnimationFrame(() => {
  root.dataset.hydrated = "true";
});

export default dispose;
