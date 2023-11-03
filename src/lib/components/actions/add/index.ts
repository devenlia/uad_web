import { Visible, Action, Parent, reset, Tutorial } from "./store";
import { invalidateAll } from "$app/navigation";


export function openModal(action : string, parent : any, tutorial? : boolean) {
  Action.set(action);
  Parent.set(parent);
  Visible.set(true);
  Tutorial.set(tutorial?? false)
}

export async function closeModal() {
  Visible.set(false);
  await new Promise(f => setTimeout(f, 1000));
  reset();
}