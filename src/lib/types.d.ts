// Equivalent to Page.java
export type Page = {
  id: string;
  path: string;
  name: string;
  containers: Container[];
  subpages: SubPage[];
}

// Equivalent to Container.java
export type Container = {
  id: string;
  name: string;
  categories: Category[];
}

// Equivalent to Category.java
export type Category = {
  id: string;
  name: string;
  links: Link[];
}

// Equivalent to Link.java
export type Link = {
  id: string;
  url: string;
}

// Equivalent to SubPage.java
export type SubPage = {
  id: string;
  name: string;
}