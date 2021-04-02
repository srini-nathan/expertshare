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
        icon: "success",
        confirmButtonText,
        animation: true,
    }).then();
};

export const sweetError = ({
    text,
    confirmButtonText,
}: SweetAlertInput): void => {
    Swal.fire({
        title: "Error!",
        text,
        icon: "error",
        confirmButtonText,
        animation: true,
    }).then();
};
