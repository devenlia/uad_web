import type { RequestHandler } from './$types';
import { error } from "@sveltejs/kit";
import type { Page } from "$lib/types";
export const POST : RequestHandler = async ({ request, fetch }) => {
  const data = await request.formData();
  const container = JSON.parse(<string>data.get("container"));

  let headers = new Headers()
  headers.set("content-type", "application/json")

  let res = await fetch("http://localhost:8080/content/container/add", {
    method: "POST",
    headers,
    body: JSON.stringify(container)
  })

  if (res.status != 200) {
    return new Response(await res.text(), { status: res.status });
  }
  else {
    let response = JSON.stringify({ success: true, page: await res.json()});
    return new Response(response, { status: 200 });
  }
};