import { atom } from "recoil";

export const KEY = "app-dashboard-layout-options";

export interface AppDashboardLayoutOptions {
    hideNav: boolean;
    hideMessenger: boolean;
    navPosition?: "left" | "bottom";
}

export const normalLayout: AppDashboardLayoutOptions = {
    hideNav: false,
    hideMessenger: false,
    navPosition: "left",
};

export const overViewLayout: AppDashboardLayoutOptions = {
    hideNav: true,
    hideMessenger: true,
    navPosition: "left",
};

export const appDashboardLayoutOptions = atom<AppDashboardLayoutOptions>({
    key: KEY,
    default: normalLayout,
});
