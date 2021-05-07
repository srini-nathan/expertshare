export interface SettingTabs {
    [key: string]: TabItem;
}
export interface TabItem {
    [key: string]: Item;
}

export interface Item {
    label: string;
    type: string;
    attr?: ItemAttr;
    options?: ItemOptions;
}

export interface ItemAttr {
    type: string;
}
export interface ItemOptions {
    choices: { [key: string]: string };
    multiple: boolean;
    defaultValue: string;
}
