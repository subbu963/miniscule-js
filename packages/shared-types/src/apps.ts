export type TAppName = string;

export interface IRoute {
    activeWhen: string | ((path: string) => boolean);
    app: TAppName;
}
