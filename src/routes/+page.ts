import type { PageLoad } from './$types';
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ url }) => {
  if (url.pathname == "/") {
    throw redirect(302, '/home');
  }

  return { content: false}
};