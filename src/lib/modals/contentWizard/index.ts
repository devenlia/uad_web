import { Visible, Action, Parent, reset, Tutorial } from "./store";
import { addToast } from "$lib/stores/toastStore";
import ContentWizard from "./add.svelte";

export default ContentWizard;

export const openContentWizard = async (action : string, path? : any, parentId? : any, tutorial? : boolean) => {
  let parent : any;
  if (parentId && action !== "select")
    parent = await loadParent(parentId, action)
  else {
    parent = await loadParentByPath(path ?? "home");
  }

  Parent.set(parent);
  Action.set(action);
  Visible.set(true);
  Tutorial.set(tutorial?? false)
}

export async function closeContentWizard() {
  Visible.set(false);
  await new Promise(f => setTimeout(f, 1000));
  reset();
}

const loadParent = async (parentId: string, type: string) => {
  switch (type) {
    case "page":
      return {page: await fetchData(`http://localhost:8080/content/page/get?id=${parentId}`), container: null, category: null}
    case "container":
      return {page: await fetchData(`http://localhost:8080/content/page/get?id=${parentId}`), container: null, category: null}
    case "category":
      let catParentCont = await fetchData(`http://localhost:8080/content/container/get?id=${parentId}`)
      let catParentPage = await fetchData(`http://localhost:8080/content/page/get?id=${catParentCont.parentId}`)
      return {page: catParentPage, container: catParentCont, category: null}
    case "link":
      let parentCat = await fetchData(`http://localhost:8080/content/category/get?id=${parentId}`)
      let parentCont = await fetchData(`http://localhost:8080/content/container/get?id=${parentCat.parentId}`)
      let parentPage = await fetchData(`http://localhost:8080/content/page/get?id=${parentCont.parentId}`)
      return {page: parentPage, container: parentCont, category: parentCat}
    default:
      return loadParentByPath("home");
  }
}

const loadParentByPath = async (path: string) => {
  let parentPage = await fetchData(`http://localhost:8080/content/page/search?path=${path}`)
  return {page: parentPage, container: parentPage.containers[0], category: parentPage.containers[0]?.categories[0]}
}

const fetchData = async (url: string) => {
  let res: Response;
  res = await fetch(url);

  if (res.status != 200) {
    await closeContentWizard();

    addToast({id: "", priority: 2, message: "An error occurred while initializing the wizard. Please check the console for more details."})
    console.error(`An error occurred while initializing the wizard. Status: ${res.status}, Message: ${await res.text()}`);
  }

  return await res.json();
}