import { writable } from 'svelte/store';

export const Visible = writable(false);
export const Action = writable('select');
export const Parent = writable({ page: undefined, container: undefined, category: undefined });
export const Step = writable(0);
export const Tutorial = writable(false);

export const reset = () => {
	Action.set('select');
	Parent.set({ page: undefined, container: undefined, category: undefined });
	Step.set(0);
	Tutorial.set(false);
};
