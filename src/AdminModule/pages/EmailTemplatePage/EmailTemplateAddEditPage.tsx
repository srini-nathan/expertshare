import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
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
import { CONSTANTS } from "../../../config";
import "./assets/scss/style.scss";

const schema = yup.object().shape({
    name: yup.string().min(2).required(),
    subject: yup.string().min(2).required(),
    etKey: yup.string().required(),
    content: yup.string().required(),
});

const { EmailTemplate: EMAIL_TEMPLATE } = CONSTANTS;
const { ETKEY, ETKEYINFO } = EMAIL_TEMPLATE;
const {
    ETKEYINFO_USER_ACTIVATION,
    ETKEYINFO_FORGOT_PASSWORD,
    ETKEYINFO_CREATE_PROFILE_ACTIVATION,
    ETKEYINFO_USER_INVITATION,
} = ETKEYINFO;

const options: PrimitiveObject[] = Object.entries(ETKEY).map(([, value]) => ({
    value,
    label: value,
}));

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
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");

    const {
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<EmailTemplate>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const copyToClipboard = (text: string) => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    };

    const getPlaceholders = (): string[] => {
        switch (selectedTemplate) {
            case "USER_ACTIVATION":
                return Object.entries(ETKEYINFO_USER_ACTIVATION).map(
                    ([, value]) => {
                        return value;
                    }
                );
            case "FORGOT_PASSWORD":
                return Object.entries(ETKEYINFO_FORGOT_PASSWORD).map(
                    ([, value]) => {
                        return value;
                    }
                );
            case "CREATE_PROFILE_ACTIVATION":
                return Object.entries(ETKEYINFO_CREATE_PROFILE_ACTIVATION).map(
                    ([, value]) => {
                        return value;
                    }
                );
            case "USER_INVITATION":
                return Object.entries(ETKEYINFO_USER_INVITATION).map(
                    ([, value]) => {
                        return value;
                    }
                );
            default:
                return [];
        }
    };

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
                                <AppFormSelect
                                    id={"etKey"}
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
                                    placeholder={"Email Template"}
                                    options={options}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) => {
                                            setSelectedTemplate(
                                                template?.value as string
                                            );
                                            return template?.value;
                                        },
                                        input: (value: string) => {
                                            return _find(options, {
                                                value,
                                            });
                                        },
                                    }}
                                />
                            </Form.Row>
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
                                    minHeight={450}
                                />
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={isSubmitting}
                            />
                        </Form>
                    </AppCard>

                    <AppCard title="Placeholders">
                        <div className="email-template-container">
                            {getPlaceholders().map((e, i) => {
                                let show = false;
                                return (
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => {
                                            return (
                                                <Tooltip id={e} {...props}>
                                                    {show
                                                        ? "Copied!"
                                                        : "Click to Copy"}
                                                </Tooltip>
                                            );
                                        }}
                                    >
                                        <span
                                            className="emailTemplateKey"
                                            onClick={() => {
                                                copyToClipboard(e);
                                                show = true;
                                            }}
                                            key={i}
                                        >
                                            <i className="far fa-clone"></i>

                                            {e}
                                        </span>
                                    </OverlayTrigger>
                                );
                            })}
                        </div>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
