import { ICellRendererParams } from "ag-grid-community";

export interface AppGridActionParams extends ICellRendererParams {
    value: number;
    callback: (id: number) => void;
    editLink: string;
    addLink: string;
    listTree?: boolean;
    listTreeSubUrl?: string;
    ui: string;
    enableDelete?: boolean;
}
