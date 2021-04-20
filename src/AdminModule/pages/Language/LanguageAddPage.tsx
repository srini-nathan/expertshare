import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { forEach as _forEach } from "lodash";
import {
    AppPageHeader,
    AppSwitch,
    AppBreadcrumb,
    AppButton,
} from "../../../AppModule/components";
import { LanguageEntity } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { AppLoadableFallback } from "../../../AppModule/components/AppLoadableFallback";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";

const schema = yup.object().shape({
    name: yup.string().required(),
    locale: yup.string().required(),
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
        formState: { errors, touchedFields },
        setError,
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
                    }
                    setLoading(false);
                }
            );
        }
    }, [id]);

    if (loading) {
        return <AppLoadableFallback />;
    }

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
                            <Form.Group as={Col} md="4" controlId="name">
                                <Form.Label>Language</Form.Label>
                                <Controller
                                    name="name"
                                    defaultValue={data.name}
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            type="text"
                                            placeholder="Enter Language"
                                            isValid={
                                                touchedFields.name &&
                                                !errors.name
                                            }
                                            isInvalid={!!errors?.name}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type={"invalid"}>
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="locale">
                                <Form.Label>Locale</Form.Label>
                                <Controller
                                    name="locale"
                                    control={control}
                                    defaultValue={data.locale}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            type="text"
                                            placeholder="Enter Locale"
                                            isValid={
                                                touchedFields.locale &&
                                                !errors.locale
                                            }
                                            isInvalid={!!errors.locale}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type={"invalid"}>
                                    {errors.locale?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
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
