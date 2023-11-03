import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url}) => {
  return {
    type: url.searchParams.get('type')
  };
};