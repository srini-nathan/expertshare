import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
} from "../../../AppModule/components";
import { UserGroup } from "../../models";
import { UserGroupApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { schema, validations } from "./schema";
import {
    useAuthState,
    useNavigator,
    useParamId,
} from "../../../AppModule/hooks";

const { name } = validations;

export const UserGroupAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { clientResourceId } = useAuthState();
    const [data, setData] = useState<UserGroup>(
        new UserGroup(clientResourceId)
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<UserGroup>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (formData: UserGroup) => {
        return UserGroupApi.createOrUpdate<UserGroup>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<UserGroup>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
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
            UserGroupApi.findById<UserGroup>(id).then(
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
            <AppBreadcrumb
                linkText={t("common.breadcrumb:userGroups")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.userGroup.form:header.titleEdit")
                        : t("admin.userGroup.form:header.title")
                }
            />
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={t("admin.userGroup.form:label.name")}
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
                            </Form.Row>
                        </AppCard>
                        <AppFormActions
                            isEditMode={isEditMode}
                            navigation={navigator}
                            isLoading={formState.isSubmitting}
                        />
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
