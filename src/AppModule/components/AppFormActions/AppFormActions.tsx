import React, { FC } from "react";
import { NavigateFn } from "@reach/router";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";

interface AppFormActionsProps {
    isEditMode: boolean;
    navigation: NavigateFn;
}
export const AppFormActions: FC<AppFormActionsProps> = ({
    isEditMode,
    navigation,
}): JSX.Element => {
    return (
        <div className="d-flex justify-content-end footer-action w-100 p-4">
            <AppButton
                type="button"
                variant={"secondary"}
                className="mr-4"
                onClick={() => navigation("..").then()}
            >
                Cancel
            </AppButton>
            <AppButton type="submit">
                {isEditMode ? "Update" : "Save"}
            </AppButton>
        </div>
    );
};
