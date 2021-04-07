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
    }).then();
};

export const sweetError = ({
    text,
    confirmButtonText = "OK",
}: SweetAlertInput): void => {
    Swal.fire({
        title: "Error!",
        text,
        icon: "error",
        confirmButtonText,
    }).then();
};
