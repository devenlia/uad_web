import { type Writable, writable } from "svelte/store";
import type { Page } from "$lib/types";


export const Visible = writable(false);
export const Action = writable("select");
export const Parent = writable({page: null, container: null, category: null});
export const Step = writable(0);
export const Tutorial = writable(false);

export const reset = () => {
  Action.set("select");
  Parent.set({page: null, container: null, category: null});
  Step.set(0);
  Tutorial.set(false);
}