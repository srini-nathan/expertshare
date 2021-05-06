import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { forEach as _forEach } from "lodash";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppFormTextArea,
} from "../../../AppModule/components";
import { EmailEntity } from "../../models";
import { EmailApi } from "../../apis";
import { errorToast, successToast, validation } from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AppFormSelect } from "../../../AppModule/components/AppFormSelect";

const schema = yup.object().shape({
    name: yup.string().min(2).required(),
    subject: yup.string().min(2).required(),
    etKey: yup.string(),
    content: yup.string().required(),
});

export const EmailAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;
    const defaultThemeList = [
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

    const [data, setData] = useState<EmailEntity>(new EmailEntity());
    const [themeList, setThemeList] = useState(defaultThemeList);
    const [selectedTheme, setSelectedTheme] = useState<any>(
        defaultThemeList[0]
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<EmailEntity>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = (formData: EmailEntity) => {
        formData.etKey = selectedTheme.value;
        formData.container = "/api/containers/1";
        EmailApi.createOrUpdate<EmailEntity>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    const { violations } = error;
                    _forEach(violations, (value: string, key: string) => {
                        const propertyName = key as keyof EmailEntity;
                        setError(propertyName, {
                            type: "backend",
                            message: value,
                        });
                    });
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    setThemeList(
                        defaultThemeList.slice(
                            defaultThemeList.indexOf(selectedTheme, 1)
                        )
                    );
                    nav("..").then(() => {
                        successToast(
                            isEditMode
                                ? "Email template updated"
                                : "Email template created"
                        );
                    });
                }
            }
        );
    };

    useEffect(() => {
        if (isEditMode) {
            EmailApi.getById<EmailEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Email template not exist");
                    } else if (response !== null) {
                        setData(response);
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb linkText={"template"} linkUrl={".."} />
            <AppPageHeader
                title={
                    isEditMode ? "Edit Email Template" : "Add Email Template"
                }
            />
            <Row>
                <Col md="12">
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppFormInput
                            name={"name"}
                            label={"Email template name"}
                            md={12}
                            lg={12}
                            sm={12}
                            xl={12}
                            required={true}
                            withCounter={true}
                            {...validation("name", formState, isEditMode)}
                            errorMessage={errors.name?.message}
                            value={data.name}
                            control={control}
                        />
                        <AppFormSelect
                            id={"ddTheme"}
                            defaultValue={
                                isEditMode
                                    ? themeList.filter(
                                          (item) =>
                                              item.value.indexOf(data.etKey) !==
                                              -1
                                      )
                                    : themeList[0]
                            }
                            placeholder={"Theme"}
                            options={themeList}
                            onChange={(selectedValue) => {
                                setSelectedTheme(selectedValue);
                            }}
                        />
                        <AppFormInput
                            name={"subject"}
                            label={"Email template Subject"}
                            md={12}
                            lg={12}
                            sm={12}
                            xl={12}
                            required={true}
                            withCounter={true}
                            {...validation("subject", formState, isEditMode)}
                            errorMessage={errors.subject?.message}
                            value={data.subject}
                            control={control}
                        />
                        <AppFormTextArea
                            name={"content"}
                            label={"Content"}
                            md={12}
                            lg={12}
                            sm={12}
                            xl={12}
                            required={true}
                            withCounter={true}
                            {...validation("content", formState, isEditMode)}
                            errorMessage={errors.content?.message}
                            value={data.content}
                            control={control}
                        />
                        <AppFormActions
                            isEditMode={isEditMode}
                            navigation={nav}
                        />
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
