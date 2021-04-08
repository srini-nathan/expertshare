import Swal from "sweetalert2";

interface SweetAlertInput {
    text: string;
    confirmButtonText?: string;
}
export const sweetSuccess = ({
    text,
    confirmButtonText = "OK",
}: SweetAlertInput): void => {
    Swal.fire({
        title: "Success",
        text,
        toast: true,
        timer: 2000,
        icon: "success",
        position: "top-end",
        confirmButtonText,
    }).then();
};

export const sweetError = ({
    text,
    confirmButtonText = "OK",
}: SweetAlertInput): void => {
    Swal.fire({
        title: "Error!",
        text,
        timer: 2000,
        position: "top-end",
        toast: true,
        icon: "error",
        confirmButtonText,
    }).then();
};
