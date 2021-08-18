import React, { FC } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export interface AppFormLabelProps {
    label: string;
    required: boolean;
    counter?: number;
    maxCount?: number;
    description?: string;
}

export const AppFormLabel: FC<AppFormLabelProps> = ({
    maxCount,
    counter = 0,
    label = "",
    description = "",
    required = false,
}) => {
    return label?.length > 0 ? (
        <Form.Label>
            {label}
            {required && <span className="required">*</span>}
            {description && (
                <div className="custom-input-description">
                    <span>i</span>
                    <div className="custom-input-description-content">
                        {description}
                    </div>
                </div>
            )}
            {maxCount && (
                <span className="counter">{`${counter}/${maxCount}`}</span>
            )}
        </Form.Label>
    ) : null;
};

export const AppFormLabelTranslatable: FC<AppFormLabelProps> = ({
    label = "",
    ...props
}) => {
    const { t } = useTranslation();
    return <AppFormLabel {...props} label={t(label)} />;
};
