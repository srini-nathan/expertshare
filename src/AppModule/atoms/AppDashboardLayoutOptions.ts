import { atom } from "recoil";

const KEY = "app-dashboard-layout-options";

export interface AppDashboardLayoutOptions {
    hideNav: boolean;
    hideMessenger: boolean;
}

export const normalLayout: AppDashboardLayoutOptions = {
    hideNav: false,
    hideMessenger: false,
};

export const overViewLayout: AppDashboardLayoutOptions = {
    hideNav: true,
    hideMessenger: true,
};

export const appDashboardLayoutOptions = atom<AppDashboardLayoutOptions>({
    key: KEY,
    default: normalLayout,
});
