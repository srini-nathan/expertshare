import React, { FC, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Container, Role } from "../../../AdminModule/models";
import { ContainerApi, RoleApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AppContext } from "../../contexts/AppContext";
import { ContainerTypes } from "../../contexts/types/container-types";
import { AuthState } from "../../../SecurityModule/models";
import { appContainer } from "../../atoms/AppContainer";

// @TODO: Remove this, as we have global context provider
export const AppConfiguration: FC = ({ children }) => {
    const { dispatch } = React.useContext(AppContext);
    const { state } = React.useContext(AuthContext);
    const setAppContainer = useSetRecoilState(appContainer);
    const { containerId } = state as AuthState;
    const [, setContainerConfiguration] = React.useState<any>();

    useEffect(() => {
        if (containerId) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ContainerApi.findById<Container>(containerId).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setAppContainer(response);
                        setContainerConfiguration(response.configuration);
                        dispatch({
                            type: ContainerTypes.SUCCESS,
                            payload: response,
                        });
                    }
                }
            );
        }
    }, [containerId]);

    useEffect(() => {
        // @TODO: Don't store in localstorage, store them in context and use them,and loads only when user is Super-Admin or Admin
        const roles = localStorage.getItem("roles");
        if (!roles) {
            RoleApi.find<Role>().then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Roles not found");
                    } else if (response !== null) {
                        localStorage.setItem(
                            "roles",
                            JSON.stringify(response.items)
                        );
                    }
                }
            );
        }
    }, []);

    return <>{children}</>;
};
