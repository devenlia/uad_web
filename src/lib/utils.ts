import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { dev } from "$app/environment";
import type { HttpMethod } from "@sveltejs/kit";
import { addToast } from "$lib/stores/toastStore";

export const getBackendUrl = () => {
  if (dev)
    return "http://localhost:8080"
  else {
    let url = PUBLIC_BACKEND_URL?.toLowerCase()
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url.endsWith('/') ? url.slice(0, -1) : url;
    }
  }
}

export const fetchRequest = async (fetch : any, url: string, method: HttpMethod, body? : string) => {
  let headers = new Headers()
  headers.set("content-type", "application/json")

  let res = await fetch(url, { headers, method, body })

  if (res.status !== 200 )  {
    throwError(res.status, await res.text())
    return { status: res.status }
  }
  else
    return method != "DELETE" ? await res.json() : null
};

export const throwError = (status : number, text : string) => {
  addToast({id: "", priority: 2, message: `An error occurred. Please check the console for detailed information.`})
  console.error(`An error occurred. Status: ${status}, Message: ${text}`);
}