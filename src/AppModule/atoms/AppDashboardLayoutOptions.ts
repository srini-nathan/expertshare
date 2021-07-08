import { atom } from "recoil";

const KEY = "app-dashboard-layout-options";

export interface AppDashboardLayoutOptions {
    hideNav: boolean;
    hideMessenger: boolean;
    navPosition?: "left" | "bottom";
}

export const normalLayout: AppDashboardLayoutOptions = {
    hideNav: false,
    hideMessenger: false,
    navPosition: "bottom",
};

export const overViewLayout: AppDashboardLayoutOptions = {
    hideNav: true,
    hideMessenger: true,
    navPosition: "bottom",
};

export const appDashboardLayoutOptions = atom<AppDashboardLayoutOptions>({
    key: KEY,
    default: normalLayout,
});
