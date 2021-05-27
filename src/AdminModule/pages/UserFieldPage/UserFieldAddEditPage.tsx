import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { forEach as _forEach, find as _find } from "lodash";
import { CONSTANTS } from "../../../config";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormCheckBox,
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

const { UserField } = CONSTANTS;
const { FIELDTYPE } = UserField;

const schema = yup.object().shape({
    name: yup.string().required(),
    fieldKey: yup.string().required(),
    labelKey: yup.string().required(),
    fieldType: yup.string().required(),
    attr: yup.array().optional().nullable(),
    options: yup.array().when("fieldType", {
        is:
            FIELDTYPE.FIELDTYPE_SELECT ||
            FIELDTYPE.FIELDTYPE_MULTI_SELECT ||
            FIELDTYPE.FIELDTYPE_RADIO_GROUP ||
            FIELDTYPE.FIELDTYPE_CHECKBOX_GROUP,
        then: yup
            .array()
            .of(
                yup.object().shape({
                    key: yup.string().trim().required("option key is required"),
                    value: yup
                        .string()
                        .trim()
                        .required("option value is required"),
                })
            )
            .min(1, "Minimum of 1 option"),
    }),
});

export const UserFieldAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const [data, setData] = useState<UserFieldEntity>(new UserFieldEntity());
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [selected, setSelected] = useState<any>();
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
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = (formData: UserFieldEntity) => {
        UserFieldApi.createOrUpdate<UserFieldEntity>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
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
                    nav("..").then(() => {
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
    const renderOptions = (type: any) => {
        if (
            type ===
            (FIELDTYPE.FIELDTYPE_SELECT ||
                FIELDTYPE.FIELDTYPE_MULTI_SELECT ||
                FIELDTYPE.FIELDTYPE_CHECKBOX_GROUP ||
                FIELDTYPE.FIELDTYPE_RADIO_GROUP)
        ) {
            return true;
        }
        return false;
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
                                        required={true}
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
                                        required={true}
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
                                                fieldType: PrimitiveObject
                                            ) => {
                                                setSelected(fieldType.value);
                                                return fieldType?.value;
                                            },
                                            input: (value: string) => {
                                                return _find(options, {
                                                    value,
                                                });
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                            {selected && (
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
                            )}
                            {renderOptions(selected) && (
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
                            )}
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
                                    navigation={nav}
                                />
                            </Row>
                        </AppCard>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
