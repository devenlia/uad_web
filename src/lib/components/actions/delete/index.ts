import { DelVisible } from "./store";

let action : any = null;

export function openDeleteModal(act : any) {
  action = act;
  DelVisible.set(true);
}

export const closeDeleteModal = (act : boolean) => {

  if (act) {
    action();
  }

  DelVisible.set(false);
}