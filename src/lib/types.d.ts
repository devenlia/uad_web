// Copyright (C) 2023 Jannis Machowetz

// Equivalent to Page.java
export type Page = {
	id: string;
	parentId: string;
	path: string;
	name: string;
	containers: Container[];
	subpages: SubPage[];
};

// Equivalent to Container.java
export type Container = {
	parentId: string;
	id: string;
	name: string;
	categories: Category[];
};

// Equivalent to Category.java
export type Category = {
	parentId: string;
	sortIndex: number;
	id: string;
	name: string;
	links: Link[];
};

// Equivalent to Link.java
export type Link = {
	parentId: string;
	name: string;
	href: string;
	sortIndex: number;
	id: string;
};

// Equivalent to SubPage.java
export type SubPage = {
	id: string;
	name: string;
};

export type RGB = [number, number, number];
