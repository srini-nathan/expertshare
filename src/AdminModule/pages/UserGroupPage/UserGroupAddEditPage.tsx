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
    AppCard,
} from "../../../AppModule/components";
import { UserGroupEntity } from "../../models";
import { UserGroupApi } from "../../apis";
import { errorToast, successToast, validation } from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";

const schema = yup.object().shape({
    name: yup.string().min(2).required(),
});

export const UserGroupAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const [data, setData] = useState<UserGroupEntity>(new UserGroupEntity());
    const [loading, setLoading] = useState<boolean>(isEditMode);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<UserGroupEntity>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = (formData: UserGroupEntity) => {
        UserGroupApi.createOrUpdate<UserGroupEntity>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    const { violations } = error;
                    _forEach(violations, (value: string, key: string) => {
                        const propertyName = key as keyof UserGroupEntity;
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
                            isEditMode
                                ? "User Group updated"
                                : "User Group created"
                        );
                    });
                }
            }
        );
    };

    useEffect(() => {
        if (isEditMode) {
            UserGroupApi.getById<UserGroupEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("User Group not exist");
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
            <AppBreadcrumb linkText={"User Group"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit User Group" : "Add User Group"}
            />
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={"Name"}
                                    required={true}
                                    withCounter={true}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    value={data.name}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
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
