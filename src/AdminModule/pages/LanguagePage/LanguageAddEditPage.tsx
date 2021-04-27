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
    AppFormSwitch,
    AppFormActions,
} from "../../../AppModule/components";
import { LanguageEntity } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast, validation } from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";

const schema = yup.object().shape({
    name: yup.string().min(2).required(),
    locale: yup.string().min(2).required(),
    isActive: yup.boolean(),
});

export const LanguageAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const [data, setData] = useState<LanguageEntity>(new LanguageEntity());
    const [loading, setLoading] = useState<boolean>(isEditMode);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<LanguageEntity>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = (formData: LanguageEntity) => {
        LanguageApi.createOrUpdate<LanguageEntity>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    const { violations } = error;
                    _forEach(violations, (value: string, key: string) => {
                        const propertyName = key as keyof LanguageEntity;
                        setError(propertyName, {
                            type: "backend",
                            message: value,
                        });
                    });
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    nav("..").then(() => {
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
            LanguageApi.getById<LanguageEntity>(id).then(
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
    }, [id, isEditMode]);

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
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Form.Row>
                            <AppFormInput
                                name={"name"}
                                label={"Name"}
                                required={true}
                                withCounter={true}
                                {...validation("name", formState, isEditMode)}
                                errorMessage={errors.name?.message}
                                value={data.name}
                                control={control}
                            />
                            <AppFormInput
                                name={"locale"}
                                label={"Locale"}
                                required={true}
                                withCounter={true}
                                {...validation("locale", formState, isEditMode)}
                                errorMessage={errors.locale?.message}
                                value={data.locale}
                                control={control}
                            />
                            <AppFormSwitch
                                name={"isActive"}
                                label={"Is Active ?"}
                                {...validation("locale", formState, isEditMode)}
                                errorMessage={errors.isActive?.message}
                                value={data.isActive}
                                control={control}
                            />
                        </Form.Row>
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
