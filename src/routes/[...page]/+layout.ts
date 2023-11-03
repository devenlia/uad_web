import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params}) => {
    let breadcrumbs = params.page.split("/").map((name, index, array) => {
        return {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            href: "/" + array.slice(0, index + 1).join("/")
        };
    });

    let desiredBreadcrumbs = breadcrumbs.length <= 3 ?
      breadcrumbs :
      [breadcrumbs[0], ...breadcrumbs.slice(-3)];

    return {
        breadcrumbs: desiredBreadcrumbs,
        path: params.page.replaceAll(/\//g, '.')
    };
};