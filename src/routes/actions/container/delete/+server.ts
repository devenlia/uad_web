import type { RequestHandler } from './$types';

export const POST : RequestHandler = async ({ request, fetch }) => {
  const data = await request.formData();
  let container = JSON.parse(<string>data.get("container"));

  let headers = new Headers()
  headers.set("content-type", "application/json")

  let res = await fetch(`http://localhost:8080/content/container/delete?id=${container.id}`, {method: "DELETE", headers})

  if (res.status != 200) {
    return new Response(await res.text(), { status: res.status });
  }
  else {
    let response = JSON.stringify({ success: true });
    return new Response(response, { status: 200 });
  }
};