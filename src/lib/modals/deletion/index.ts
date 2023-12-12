// Copyright (C) 2023 Jannis Machowetz
import { Visible } from './store';
import DeleteConfirmation from './deleteConfirmation.svelte';

export default DeleteConfirmation;

let action: any = null;
export let Type: string, Message: string;

export function openDeleteConfirmation(act: any, type : string, message : string) {
	Type = type;
  Message = message;
	action = act;
	Visible.set(true);
}

export const closeDeleteConfirmation = (act: boolean) => {
	if (act) {
		action();
	}

	Visible.set(false);
};
