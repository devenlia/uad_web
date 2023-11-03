import type { RequestHandler } from './$types';
import { error } from "@sveltejs/kit";
import type { Page } from "$lib/types";
export const POST : RequestHandler = async ({ request, fetch }) => {
  const data = await request.formData();
  let page = JSON.parse(<string>data.get("page"));

  console.log(page);

  if (page.id == "") {
    let res = await fetch(`http://localhost:8080/content/page/search?path=${page.path}`);

    if (res.status != 200) {
      return new Response(await res.text(), { status: res.status });
    }
    else {
      page = await res.json();
    }
  }

  console.log(page);

  let headers = new Headers()
  headers.set("content-type", "application/json")

  let res = await fetch(`http://localhost:8080/content/page/delete?id=${page.id}`, {method: "DELETE"})

  if (res.status != 200) {
    return new Response(await res.text(), { status: res.status });
  }
  else {
    let response = JSON.stringify({ success: true });
    return new Response(response, { status: 200 });
  }
};