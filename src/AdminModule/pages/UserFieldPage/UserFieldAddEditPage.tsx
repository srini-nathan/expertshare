import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { find as _find } from "lodash";
import { CONSTANTS } from "../../../config";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormCheckBox,
} from "../../../AppModule/components";
import { UserField } from "../../models";
import { UserFieldApi } from "../../apis";
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
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AppFormSelect } from "../../../AppModule/components/AppFormSelect";
import {
    useAuthState,
    useNavigator,
    useParamId,
} from "../../../AppModule/hooks";

const schema = yup.object().shape({
    name: yup.string().required(),
    fieldKey: yup.string().required(),
    labelKey: yup.string().required(),
    fieldType: yup.string().required(),
});

const {
    UserField: { FIELDTYPE },
} = CONSTANTS;

export const UserFieldAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { clientResourceId } = useAuthState();
    const [data, setData] = useState<UserField>(
        new UserField(clientResourceId)
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const options = Object.entries(FIELDTYPE).map(([key, value]) => ({
        value,
        label: key,
    }));

    const {
        register,
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<UserField>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = (formData: UserField) => {
        UserFieldApi.createOrUpdate<UserField>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<UserField>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode
                                ? "User Fields updated"
                                : "User Fields created"
                        );
                    });
                }
            }
        );
    };

    useEffect(() => {
        if (isEditMode) {
            UserFieldApi.findById<UserField>(id).then(
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

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb linkText={"User Fields"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit User Fields" : "Add User Fields"}
            />
            <Row>
                <Col md={12}>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Row>
                                <Col md={6} sm={12}>
                                    <AppFormInput
                                        name={"name"}
                                        label={"User Field Name"}
                                        md={12}
                                        lg={12}
                                        sm={12}
                                        xl={12}
                                        required={true}
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
                                        name={"fieldKey"}
                                        label={"User Field Key"}
                                        md={12}
                                        lg={12}
                                        sm={12}
                                        xl={12}
                                        {...validation(
                                            "fieldKey",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.fieldKey?.message}
                                        defaultValue={data.fieldKey}
                                        control={control}
                                    />
                                </Col>
                                <Col md={6} sm={12}>
                                    <AppFormInput
                                        name={"labelKey"}
                                        label={"User Label Key"}
                                        md={12}
                                        lg={12}
                                        sm={12}
                                        xl={12}
                                        {...validation(
                                            "labelKey",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.labelKey?.message}
                                        defaultValue={data.labelKey}
                                        control={control}
                                    />
                                    <AppFormSelect
                                        id={"ddFieldType"}
                                        name={"fieldType"}
                                        label={"Select fieldType"}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        required={true}
                                        {...validation(
                                            "fieldType",
                                            formState,
                                            isEditMode
                                        )}
                                        defaultValue={data.fieldType}
                                        placeholder={"Field Type"}
                                        errorMessage={errors.fieldType?.message}
                                        options={options}
                                        control={control}
                                        transform={{
                                            output: (
                                                template: PrimitiveObject
                                            ) => template?.value,
                                            input: (value: string) => {
                                                return _find(options, {
                                                    value,
                                                });
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                        <AppCard>
                            <Row>
                                <Col md={4} sm={6}>
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isActive"}
                                        label={"Active"}
                                        labelPosition={"top"}
                                        value={data.isActive === false ? 0 : 1}
                                        defaultChecked={data.isActive}
                                        register={register}
                                    />
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isExport"}
                                        label={"Export"}
                                        labelPosition={"top"}
                                        value={data.isExport === false ? 0 : 1}
                                        defaultChecked={data.isExport}
                                        register={register}
                                    />
                                </Col>
                                <Col md={4} sm={6}>
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isImport"}
                                        label={"Import"}
                                        labelPosition={"top"}
                                        value={data.isImport === false ? 0 : 1}
                                        defaultChecked={data.isImport}
                                        register={register}
                                    />
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isVcf"}
                                        label={"Vcf"}
                                        labelPosition={"top"}
                                        value={data.isVcf === false ? 0 : 1}
                                        defaultChecked={data.isVcf}
                                        register={register}
                                    />
                                </Col>
                                <Col md={4} sm={6}>
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isRequired"}
                                        label={"Required"}
                                        labelPosition={"top"}
                                        value={
                                            data.isRequired === false ? 0 : 1
                                        }
                                        defaultChecked={data.isRequired}
                                        register={register}
                                    />
                                </Col>
                                <AppFormActions
                                    isEditMode={isEditMode}
                                    navigation={navigator}
                                />
                            </Row>
                        </AppCard>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
