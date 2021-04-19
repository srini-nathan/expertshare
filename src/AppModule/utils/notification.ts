import Swal, { SweetAlertOptions } from "sweetalert2";

const defaultConfig: SweetAlertOptions = {
    toast: true,
    timer: 2000,
    position: "top-end",
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

export const errorToast = (text: string, config?: SweetAlertOptions): void => {
    Swal.fire({
        text,
        title: "Error!",
        icon: "error",
        ...defaultConfig,
        ...config,
    }).then();
};
