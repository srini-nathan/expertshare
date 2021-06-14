import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { forEach as _forEach, find as _find } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { CONSTANTS } from "../../../config";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormSwitch,
} from "../../../AppModule/components";
import { UserFieldEntity } from "../../models";
import { UserFieldApi } from "../../apis";
import { errorToast, successToast, validation } from "../../../AppModule/utils";
import {
    PrimitiveObject,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AppFormSelect } from "../../../AppModule/components/AppFormSelect";
import { AppFieldTypeElement } from "../../components";

import { schema, validations } from "./schema";
import { useNavigator, useParamId } from "../../../AppModule/hooks";

const { UserField } = CONSTANTS;
const { FIELDTYPE } = UserField;
const { name, fieldKey, labelKey } = validations;

const options: PrimitiveObject[] = Object.entries(FIELDTYPE).map(
    ([key, value]) => ({
        value,
        label: key,
    })
);

export const UserFieldAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);

    const [data, setData] = useState<UserFieldEntity>(new UserFieldEntity());
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [selected, setSelected] = useState<string>(FIELDTYPE.FIELDTYPE_TEXT);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (formData: UserFieldEntity) => {
        if (formData.options) {
            const choice = (formData.options as any).map((e: any) => {
                return {
                    [e.key]: e.value,
                };
            });
            formData.options = {
                choice,
            };
        }
        if (formData.attr)
            formData.attr = (formData.attr as any).map((e: any) => {
                return {
                    [e.key]: e.value,
                };
            });

        return UserFieldApi.createOrUpdate<UserFieldEntity>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    // @TODO: need to replace this block with setViolations,
                    // need to fix an issue with the function
                    const { violations } = error;
                    _forEach(violations, (value: string, key: string) => {
                        const propertyName = key as keyof UserFieldEntity;
                        setError(propertyName, {
                            type: "backend",
                            message: value,
                        });
                    });
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

    const renderOptions = (type: string) => {
        return (
            type === FIELDTYPE.FIELDTYPE_SELECT ||
            type === FIELDTYPE.FIELDTYPE_MULTI_SELECT ||
            type === FIELDTYPE.FIELDTYPE_CHECKBOX_GROUP ||
            type === FIELDTYPE.FIELDTYPE_RADIO_GROUP
        );
    };

    useEffect(() => {
        if (isEditMode) {
            UserFieldApi.findById<UserFieldEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Email template not exist");
                    } else if (response !== null) {
                        setData(response);
                        setSelected(response.fieldType);
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
            <AppBreadcrumb linkText={"User Fields"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit User Fields" : "Add User Fields"}
            />
            <Row>
                <Col md={12}>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Row>
                                <AppFormInput
                                    name={"name"}
                                    label={"User Field Name"}
                                    maxCount={name.max}
                                    lg={6}
                                    xl={6}
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
                                    maxCount={fieldKey.max}
                                    lg={6}
                                    xl={6}
                                    {...validation(
                                        "fieldKey",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.fieldKey?.message}
                                    defaultValue={data.fieldKey}
                                    control={control}
                                />
                            </Row>
                            <Row>
                                <AppFormInput
                                    name={"labelKey"}
                                    label={"User Label Key"}
                                    maxCount={labelKey.max}
                                    lg={6}
                                    xl={6}
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
                                    lg={6}
                                    xl={6}
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
                                            fieldType: PrimitiveObject
                                        ) => {
                                            setSelected(
                                                fieldType.value as string
                                            );
                                            return fieldType?.value;
                                        },
                                        input: (value: string) => {
                                            return _find(options, {
                                                value,
                                            });
                                        },
                                    }}
                                />
                            </Row>
                            {selected ? (
                                <Row>
                                    <Col xs={12}>
                                        <AppFieldTypeElement
                                            name={"attr"}
                                            header={"Attributes"}
                                            isEditMode={isEditMode}
                                            control={control}
                                            defaultValue={data.attr}
                                            setValue={setValue}
                                            required={false}
                                            errors={errors}
                                        />
                                    </Col>
                                </Row>
                            ) : (
                                <></>
                            )}
                            {renderOptions(selected) ? (
                                <AppFieldTypeElement
                                    name={"options"}
                                    header={"Options"}
                                    isEditMode={isEditMode}
                                    control={control}
                                    defaultValue={data.options}
                                    setValue={setValue}
                                    required={true}
                                    errors={errors}
                                />
                            ) : (
                                <> </>
                            )}
                        </AppCard>

                        <AppCard>
                            <Row>
                                <AppFormSwitch
                                    md={4}
                                    sm={6}
                                    name={"isActive"}
                                    required={false}
                                    label={"Is Active ?"}
                                    {...validation(
                                        "isActive",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data.isActive}
                                    control={control}
                                />
                                <AppFormSwitch
                                    md={4}
                                    sm={6}
                                    name={"isExport"}
                                    required={false}
                                    label={"Is Exportable ?"}
                                    {...validation(
                                        "isExport",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data.isExport}
                                    control={control}
                                />
                                <AppFormSwitch
                                    md={4}
                                    sm={6}
                                    name={"isImport"}
                                    required={false}
                                    label={"Is Importable ?"}
                                    {...validation(
                                        "isImport",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data.isImport}
                                    control={control}
                                />
                                <AppFormSwitch
                                    md={4}
                                    sm={6}
                                    name={"isVcf"}
                                    required={false}
                                    label={"Is VCF ?"}
                                    {...validation(
                                        "isVcf",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data.isVcf}
                                    control={control}
                                />
                                <AppFormSwitch
                                    md={4}
                                    sm={6}
                                    name={"isRequired"}
                                    required={false}
                                    label={"Is Required ?"}
                                    {...validation(
                                        "isRequired",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data.isRequired}
                                    control={control}
                                />
                            </Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={formState.isSubmitting}
                            />
                        </AppCard>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
