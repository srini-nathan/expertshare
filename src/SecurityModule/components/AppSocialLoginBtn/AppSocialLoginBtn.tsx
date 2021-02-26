import React, { FunctionComponent } from "react";
import styled from "styled-components";
import {
    AppButtonProps,
    AppButton,
} from "../../../AppModule/components/AppButton/AppButton";
import google from "../../assets/images/icon-brand-google.png";

export enum AppSocialLoginBtnType {
    CUSTOM = "Custom",
    GOOGLE = "Google",
}

export interface AppSocialLoginBtnProps extends AppButtonProps {
    iconImage?: string;
    type?: AppSocialLoginBtnType;
}

const AppGoogleLoginBtn = styled(AppButton)``;

const AppBrandIconImg = styled.img`
    width: 1.5em;
    height: auto;
    margin-right: 0.2em;
    margin-top: -0.3em;
    margin-bottom: -0.2em;
`;

export const AppSocialLoginBtn: FunctionComponent<AppSocialLoginBtnProps> = ({
    type = AppSocialLoginBtnType.GOOGLE,
    variant = "outline-primary",
    ...props
}) => {
    const { iconImage, ...restProps } = props;
    let icon = null;

    if (type === AppSocialLoginBtnType.CUSTOM && iconImage) {
        icon = iconImage;
    }

    if (type === AppSocialLoginBtnType.GOOGLE) {
        icon = google;
    }

    return (
        <AppGoogleLoginBtn variant={variant} {...restProps}>
            {icon ? <AppBrandIconImg src={icon} /> : null}
            {props.children}
        </AppGoogleLoginBtn>
    );
};
