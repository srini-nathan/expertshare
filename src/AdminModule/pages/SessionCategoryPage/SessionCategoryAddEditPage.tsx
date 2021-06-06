import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    // AppFormSwitch,
    AppFormActions,
    AppCard,
    AppFormInput,
} from "../../../AppModule/components";
import { SessionCategory } from "../../models";
import { SessionCategoryApi } from "../../apis";
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

const { name } = validations;

export const SessionCategoryAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<SessionCategory>(
        new SessionCategory(containerResourceId)
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<SessionCategory>({
        resolver: yupResolver(schema),
        // mode: "all",
    });

    const onSubmit = async (formData: SessionCategory) => {
        return SessionCategoryApi.createOrUpdate<SessionCategory>(
            id,
            formData
        ).then(({ error, errorMessage }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<SessionCategory>(error, setError);
            } else if (errorMessage) {
                errorToast(errorMessage);
            } else {
                navigator("..").then(() => {
                    successToast(
                        isEditMode
                            ? "SessionCategory updated"
                            : "SessionCategory created"
                    );
                });
            }
        });
    };

    useEffect(() => {
        if (isEditMode) {
            SessionCategoryApi.findById<SessionCategory>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("SessionCategory not exist");
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
            <AppBreadcrumb linkText={"Session Category"} linkUrl={".."} />
            <AppPageHeader
                title={
                    isEditMode
                        ? "Edit Session Category"
                        : "Add Session Category"
                }
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
                                    name={"color"}
                                    label={"Color"}
                                    {...validation(
                                        "color",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.color?.message}
                                    defaultValue={data.color}
                                    control={control}
                                />
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={formState.isSubmitting}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
