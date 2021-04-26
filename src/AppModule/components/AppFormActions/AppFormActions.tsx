import React, { FC } from "react";
import { NavigateFn } from "@reach/router";
import { AppButton } from "../AppButton";

interface AppFormActionsProps {
    isEditMode: boolean;
    navigation: NavigateFn;
}
export const AppFormActions: FC<AppFormActionsProps> = ({
    isEditMode,
    navigation,
}): JSX.Element => {
    return (
        <section>
            <hr />
            <div className="d-flex justify-content-end">
                <AppButton
                    type="button"
                    variant={"outline-primary"}
                    className="mr-4"
                    onClick={() => navigation("..").then()}
                >
                    Cancel
                </AppButton>
                <AppButton type="submit">
                    {isEditMode ? "Update" : "Save"}
                </AppButton>
            </div>
        </section>
    );
};
