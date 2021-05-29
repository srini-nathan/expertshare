import { atom } from "recoil";

export const KEY = "app-dashboard-layout-options";

export interface AppDashboardLayoutOptions {
    hideNav: boolean;
}

export const normalLayout: AppDashboardLayoutOptions = {
    hideNav: false,
};

export const overViewLayout: AppDashboardLayoutOptions = {
    hideNav: true,
};

export const appDashboardLayoutOptions = atom<AppDashboardLayoutOptions>({
    key: KEY,
    default: normalLayout,
});
