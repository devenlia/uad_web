// Copyright (C) 2023 Jannis Machowetz
import { writable } from 'svelte/store';

export const Visible = writable(false);
export const Action = writable('select');
export const Parent = writable({
	page: { id: '', name: '', path: '', containers: [], subpages: [] },
	container: { id: '', name: '', parentId: '', categories: [] },
	category: { id: '', name: '', parentId: '', links: [], sortIndex: 0 }
});
export const Step = writable(0);
export const Tutorial = writable(false);

export const reset = () => {
	Action.set('select');
	Parent.set({
		page: { id: '', name: '', path: '', containers: [], subpages: [] },
		container: { id: '', name: '', parentId: '', categories: [] },
		category: { id: '', name: '', parentId: '', links: [], sortIndex: 0 }
	});
	Step.set(0);
	Tutorial.set(false);
};
