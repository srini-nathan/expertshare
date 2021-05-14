import React, { FC, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { AppFormInput } from "../AppFormInput";
import { AppIcon } from "../AppIcon";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";

import "./assets/scss/style.scss";

export interface AppFormInputPasswordProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    maxCount?: number;
}

export const AppFormInputPassword: FC<AppFormInputPasswordProps> = ({
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    className = "",
    ...props
}): JSX.Element => {
    const [showPass, isShowPass] = useState<boolean>(false);
    const { isInvalid } = props;
    return (
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            className={`p-0 ${className}`}
        >
            <AppFormInput
                sm={12}
                md={12}
                lg={12}
                xl={12}
                type={showPass ? "text" : "password"}
                {...props}
            />
            <div
                className={`show-password ${isInvalid && "invalid"}`}
                onClick={() => isShowPass(!showPass)}
            >
                {showPass ? <AppIcon name="EyeOff" /> : <AppIcon name="Eye" />}
            </div>
        </Form.Group>
    );
};
