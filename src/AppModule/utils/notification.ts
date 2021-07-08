import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

const defaultConfig: SweetAlertOptions = {
    toast: true,
    timer: 2500,
    position: "top-end",
};

const callerIdConfig: SweetAlertOptions = {
    toast: true,
    timer: 30000,
    position: "top-end",
    showDenyButton: true,
    showConfirmButton: true,
};

export const successToast = (
    text: string,
    config?: SweetAlertOptions
): void => {
    Swal.fire({
        text,
        title: "Success",
        icon: "success",
        ...defaultConfig,
        ...config,
    }).then();
};

export const warningToast = (
    text: string,
    config?: SweetAlertOptions
): void => {
    Swal.fire({
        text,
        title: "Warning",
        icon: "warning",
        ...defaultConfig,
        ...config,
    }).then();
};

export const errorToast = (text: string, config?: SweetAlertOptions): void => {
    Swal.fire({
        text,
        title: "Error!",
        icon: "error",
        ...defaultConfig,
        ...config,
    }).then();
};

export const showLoader = (
    text: string,
    config?: SweetAlertOptions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<SweetAlertResult<any>> => {
    return Swal.fire({
        text,
        didOpen: () => {
            Swal.showLoading();
        },
        ...defaultConfig,
        ...config,
        toast: false,
        backdrop: true,
        position: "center",
        showConfirmButton: false,
    }).then();
};

export const hideLoader = (): void => {
    Swal.close();
};

export const showIncomingCall = (
    text: string,
    config?: SweetAlertOptions
): Promise<SweetAlertResult<boolean>> => {
    return Swal.fire({
        ...callerIdConfig,
        ...config,
        text,
        title: "Success",
        icon: "success",
    });
};

export const showOutgoingCall = (
    text: string,
    config?: SweetAlertOptions
): Promise<SweetAlertResult<boolean>> => {
    return Swal.fire({
        ...callerIdConfig,
        ...config,
        text,
        title: "Success",
        icon: "success",
        showConfirmButton: false,
    });
};
