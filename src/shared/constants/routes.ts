// here routes are defined
enum RouteNames {
  dashboard = "dashboard",
  attachments = "attachments",
  attachmentsDetail = "attachmentsDetail",
}

export const appRoutes: { [key in RouteNames]: IRouteStructure } = {
  [RouteNames.dashboard]: {
    path: "/",
  },
  [RouteNames.attachments]: {
    path: "/attachments",
  },
  [RouteNames.attachmentsDetail]: {
    path: "/attachments/:id",
    name: "/attachments/",
  },
};
interface IRouteStructure {
  path: string;
  redirect?: string;
  query?: string;
  name?: string;
}
