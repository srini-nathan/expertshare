import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormSwitch,
    AppFormActions,
    AppCard,
    AppFormInput,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { LanguageApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import {
    useParamId,
    useNavigator,
    useAuthState,
} from "../../../AppModule/hooks";
import { schema, validations } from "./schema";

const { name, locale } = validations;

export const LanguageAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<Language>(
        new Language(containerResourceId)
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<Language>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = (formData: Language) => {
        LanguageApi.createOrUpdate<Language>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Language>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode ? "Language updated" : "Language created"
                        );
                    });
                }
            }
        );
    };

    useEffect(() => {
        if (isEditMode) {
            LanguageApi.getById<Language>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Language not exist");
                    } else if (response !== null) {
                        setData(response);
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Language"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit Language" : "Add Language"}
            />
            <Row>
                <Col>
                    <AppCard>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={"Name"}
                                    maxCount={name.max}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    defaultValue={data.name}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"locale"}
                                    label={"Locale"}
                                    maxCount={locale.max}
                                    {...validation(
                                        "locale",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.locale?.message}
                                    defaultValue={data.locale}
                                    control={control}
                                />
                                <AppFormSwitch
                                    name={"isActive"}
                                    label={"Is Active ?"}
                                    {...validation(
                                        "locale",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isActive?.message}
                                    value={data.isActive}
                                    control={control}
                                />
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
