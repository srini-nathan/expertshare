import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
    copyToClipBoard,
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
import { ETKEY, ETKEYINFO } from "../../../config";
import "./assets/scss/style.scss";

const schema = yup.object().shape({
    name: yup.string().min(2).required(),
    subject: yup.string().min(2).required(),
    etKey: yup.string().required(),
    content: yup.string().required(),
});

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
    const [fraolaValue, setFraolaValue] = useState<string>("");
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<EmailTemplate>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const getPlaceholders = (): string[] => {
        const infoKey = `ETKEYINFO_${selectedTemplate}`;
        const info: string[] = ETKEYINFO[infoKey] ?? [];
        return Object.entries(info).map(([, value]) => {
            return value;
        });
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
                            ? t(
                                  "admin.emailTemplate.form:message.success.updated"
                              )
                            : t(
                                  "admin.emailTemplate.form:message.success.created"
                              )
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
                        errorToast(
                            t("admin.emailTemplate.form:message.error.notFound")
                        );
                    } else if (response !== null) {
                        setData(response);
                        setSelectedTemplate(response.etKey);
                        setFraolaValue(response.content || "");
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
            <AppBreadcrumb
                linkText={t("common.breadcrumb:emailTemplates")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.emailTemplate.form:header.titleEdit")
                        : t("admin.emailTemplate.form:header.title")
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
                                    label={t(
                                        "admin.emailTemplate.form:label.template"
                                    )}
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
                                    placeholder={t(
                                        "admin.emailTemplate.form:label.template"
                                    )}
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
                                    label={t(
                                        "admin.emailTemplate.form:label.name"
                                    )}
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
                                    label={t(
                                        "admin.emailTemplate.form:label.subject"
                                    )}
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
                                    label={t(
                                        "admin.emailTemplate.form:label.content"
                                    )}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    value={fraolaValue}
                                    onChange={setFraolaValue}
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

                    <AppCard
                        title={t(
                            "admin.emailTemplate.form:label.sectionPlaceholder"
                        )}
                    >
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
                                                        ? t(
                                                              "admin.emailTemplate.form:tooltip.copiedToClipboard"
                                                          )
                                                        : t(
                                                              "admin.emailTemplate.form:tooltip.clickToCopy"
                                                          )}
                                                </Tooltip>
                                            );
                                        }}
                                    >
                                        <span
                                            className="emailTemplateKey"
                                            onClick={() => {
                                                copyToClipBoard(e);
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
