import React, { FC } from "react";
import { NavigateFn } from "@reach/router";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";

interface AppFormActionsProps {
    isEditMode: boolean;
    backLink?: string;
    navigation: NavigateFn;
    isLoading?: boolean;
}
export const AppFormActions: FC<AppFormActionsProps> = ({
    isEditMode,
    backLink,
    navigation,
    isLoading,
}): JSX.Element => {
    return (
        <div className="d-flex justify-content-end footer-action w-100 p-4">
            <AppButton
                type="button"
                variant={"secondary"}
                className="mr-4"
                disabled={isLoading}
                onClick={() =>
                    backLink
                        ? navigation(backLink).then()
                        : navigation("..").then()
                }
            >
                Cancel
            </AppButton>
            <AppButton
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                loadingTxt={isEditMode ? "Updating..." : "Saving..."}
            >
                {isEditMode ? "Update" : "Save"}
            </AppButton>
        </div>
    );
};
