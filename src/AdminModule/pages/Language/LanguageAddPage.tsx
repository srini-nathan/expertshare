import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { forEach as _forEach } from "lodash";
import {
    AppPageHeader,
    AppSwitch,
    AppBreadcrumb,
    AppButton,
    AppLoader,
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

export const LanguageAddPage: FC<RouteComponentProps> = ({
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
        return (
            <Row>
                <Col md={12} className="vh-100">
                    <AppLoader
                        spinnerAnimation="border"
                        spinnerVariant="primary"
                    />
                </Col>
            </Row>
        );
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
                            <Form.Group as={Col} md={4}>
                                <Form.Label>Is Active ?</Form.Label>
                                <AppSwitch
                                    id={"is-active"}
                                    name={"isActive"}
                                    value={true}
                                ></AppSwitch>
                            </Form.Group>
                        </Form.Row>
                        {/* @TODO: Move it to FormAction component */}
                        <div>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <AppButton
                                    type="button"
                                    variant={"outline-primary"}
                                    className="mr-4"
                                    onClick={() => nav("..").then()}
                                >
                                    Cancel
                                </AppButton>
                                <AppButton type="submit">
                                    {isEditMode ? "Update" : "Save"}
                                </AppButton>
                            </div>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
