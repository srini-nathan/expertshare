import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { find as _find } from "lodash";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormInput,
    AppFormSelect,
    AppFormRichTextArea,
} from "../../../AppModule/components";
import { EmailTemplate } from "../../models";
import { EmailTemplateApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import {
    PrimitiveObject,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import {
    useAuthState,
    useNavigator,
    useParamId,
} from "../../../AppModule/hooks";

const schema = yup.object().shape({
    name: yup.string().min(2).required(),
    subject: yup.string().min(2).required(),
    etKey: yup.string().required(),
    content: yup.string().required(),
});

const defaultThemeList: PrimitiveObject[] = [
    {
        id: "1",
        value: "forgot_password_email",
        label: "forgot_password_email",
    },
    {
        id: "2",
        value: "user_create_profile_activation_email",
        label: "user_create_profile_activation_email",
    },
    {
        id: "3",
        value: "reset_password_email",
        label: "reset_password_email",
    },
];

export const EmailTemplateAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<EmailTemplate>(
        new EmailTemplate(containerResourceId)
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);

    const {
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<EmailTemplate>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (formData: EmailTemplate) => {
        return EmailTemplateApi.createOrUpdate<EmailTemplate>(
            id,
            formData
        ).then(({ error, errorMessage }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<EmailTemplate>(error, setError);
            } else if (errorMessage) {
                errorToast(errorMessage);
            } else {
                navigator("..").then(() => {
                    successToast(
                        isEditMode
                            ? "Email template updated"
                            : "Email template created"
                    );
                });
            }
        });
    };

    useEffect(() => {
        if (isEditMode) {
            EmailTemplateApi.findById<EmailTemplate>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Email template not exist");
                    } else if (response !== null) {
                        setData(response);
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors, isSubmitting } = formState;

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Email Templates"} linkUrl={".."} />
            <AppPageHeader
                title={
                    isEditMode ? "Edit Email Template" : "Add Email Template"
                }
            />
            <Row>
                <Col md="12">
                    <AppCard>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={"Name"}
                                    md={12}
                                    lg={12}
                                    sm={12}
                                    xl={12}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    defaultValue={data.name}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormSelect
                                    id={"ddTheme"}
                                    name={"etKey"}
                                    label={"Select template"}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    {...validation(
                                        "etKey",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.etKey?.message}
                                    defaultValue={data.etKey}
                                    placeholder={"Theme"}
                                    options={defaultThemeList}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) =>
                                            template?.value,
                                        input: (value: string) => {
                                            return _find(defaultThemeList, {
                                                value,
                                            });
                                        },
                                    }}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormInput
                                    name={"subject"}
                                    label={"Subject"}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    {...validation(
                                        "subject",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.subject?.message}
                                    defaultValue={data.subject}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormRichTextArea
                                    name={"content"}
                                    label={"Content"}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    {...validation(
                                        "content",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.content?.message}
                                    defaultValue={data.content}
                                    control={control}
                                />
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={isSubmitting}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
