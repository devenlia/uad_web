import { DelVisible } from "./store";
import DeleteConfirmation from "./deleteConfirmation.svelte"

export default DeleteConfirmation;

let action : any = null;

export function openDeleteConfirmation(act : any) {
  action = act;
  DelVisible.set(true);
}

export const closeDeleteConfirmation = (act : boolean) => {
  if (act) {
    action();
  }

  DelVisible.set(false);
}