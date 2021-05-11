import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { forEach as _forEach } from "lodash";
import { Col, Form, Row } from "react-bootstrap";
import { ClientEntity, ContainerEntity, Package } from "../../models";
import { ClientApi, PackageApi } from "../../apis";
import {
    AppFormTextArea,
    AppLoader,
    AppCard,
    AppFormInput,
    AppFormCheckBox,
    AppFormActions,
    AppBreadcrumb,
    AppPageHeader,
    AppFormRadioSwitch,
} from "../../../AppModule/components";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { ContainerApi } from "../../apis/ContainerApi";
import { errorToast, successToast, validation } from "../../../AppModule/utils";
import { AppPackageSwitches } from "../../components";
import { CONSTANTS } from "../../../config";

const { Container } = CONSTANTS;
const {
    STORAGE: { STORAGE_S3, STORAGE_LOCAL },
} = Container;

const schema = Yup.object().shape({
    domain: Yup.string().required("Domain is Required"),
    name: Yup.string().required("Name is Required"),
    containerGroup: Yup.string().optional(),
    description: Yup.string().optional(),
    storage: Yup.string().required(),
    bucketKey: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Key is Required"),
    }),
    bucketSecret: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Secret is Required"),
    }),
    bucketName: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Name is Required"),
    }),
    bucketRegion: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Region is Required"),
    }),
});

export const ContainerAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { clientId = null, id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const [data, setData] = React.useState<ContainerEntity>(
        new ContainerEntity(ClientApi.toResourceUrl(clientId))
    );
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [loadingClient, setLoadingClient] = useState<boolean>(true);

    const {
        register,
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        getValues,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
    });

    useEffect(() => {
        ClientApi.getById<ClientEntity>(clientId).then(
            ({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Client not exist");
                } else if (response !== null) {
                    const packs = response.packages as Package[];
                    setPackages(packs);
                }
                setLoadingClient(false);
            }
        );
    }, [clientId, isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            ContainerApi.getById<ContainerEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        const packs = response.packages as Package[];
                        setData({
                            ...response,
                            packages: packs.map(({ id: packId }) =>
                                PackageApi.toResourceUrl(packId)
                            ),
                        });
                        // @TODO: without setting value, it should work
                        setValue("name", response.name);
                        setValue("domain", response.domain);
                        setValue("storage", response.storage);
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, setValue, trigger]);

    const onSubmit = (formData: ContainerEntity) => {
        ContainerApi.createOrUpdate<ContainerEntity>(id, {
            ...formData,
            packages: data.packages,
        }).then(({ error, errorMessage }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                const { violations } = error;
                _forEach(violations, (value: string, key: string) => {
                    const propertyName = key as keyof ContainerEntity;
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
                        isEditMode ? "Container updated" : "Container created"
                    );
                });
            }
        });
    };

    if (loading && loadingClient) {
        return <AppLoader />;
    }

    const { errors } = formState;

    const isS3 = STORAGE_S3 === getValues<string>("storage");

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Container"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit Container" : "Add Container"}
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard title="Details">
                            <Form.Row>
                                <Col md={6} sm={12}>
                                    <AppFormInput
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
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
                                    <AppFormInput
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"domain"}
                                        label={"Domain"}
                                        required={true}
                                        withCounter={true}
                                        {...validation(
                                            "domain",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.domain?.message}
                                        value={data.domain}
                                        control={control}
                                    />
                                    <AppFormInput
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"containerGroup"}
                                        label={"Container Group"}
                                        withCounter={true}
                                        {...validation(
                                            "containerGroup",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.containerGroup?.message
                                        }
                                        value={data.containerGroup}
                                        control={control}
                                    />
                                </Col>
                                <Col md={6} sm={12}>
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isActive"}
                                        label={"Active"}
                                        labelPosition={"top"}
                                        value={1}
                                        defaultChecked={true}
                                        register={register}
                                    />
                                    <AppFormTextArea
                                        className="pr-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"description"}
                                        label={"Description"}
                                        required={false}
                                        withCounter={true}
                                        {...validation(
                                            "description",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.description?.message
                                        }
                                        value={data.description}
                                        control={control}
                                    />
                                </Col>
                            </Form.Row>
                        </AppCard>
                        <AppCard title="Storage">
                            <Row className="p-3">
                                <AppFormRadioSwitch
                                    name={"storage"}
                                    defaultValue={data.storage}
                                    label={"storage"}
                                    control={control}
                                    required={true}
                                    options={[
                                        {
                                            value: STORAGE_S3,
                                            label: STORAGE_S3,
                                        },
                                        {
                                            value: STORAGE_LOCAL,
                                            label: STORAGE_LOCAL,
                                        },
                                    ]}
                                    {...validation(
                                        "storage",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.storage?.message}
                                />
                            </Row>
                            <Row className={isS3 ? "mt-2" : "d-none"}>
                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketKey"}
                                    label={"AWS S3 Bucket Key"}
                                    required={true}
                                    withCounter={true}
                                    {...validation(
                                        "bucketKey",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketKey?.message}
                                    value={data.bucketKey || ""}
                                    control={control}
                                />

                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketSecret"}
                                    label={"AWS S3 Bucket Secret"}
                                    required={true}
                                    withCounter={true}
                                    {...validation(
                                        "bucketSecret",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketSecret?.message}
                                    value={data.bucketSecret || ""}
                                    control={control}
                                />

                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketName"}
                                    label={"AWS S3 Bucket Name"}
                                    required={true}
                                    withCounter={true}
                                    {...validation(
                                        "bucketName",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketName?.message}
                                    value={data.bucketName || ""}
                                    control={control}
                                />
                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketRegion"}
                                    label={"AWS S3 Bucket Region"}
                                    required={true}
                                    withCounter={true}
                                    {...validation(
                                        "bucketRegion",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketRegion?.message}
                                    value={data.bucketRegion || ""}
                                    control={control}
                                />
                            </Row>
                        </AppCard>
                        <AppCard title="Packages">
                            <Form.Row>
                                <AppPackageSwitches
                                    packages={packages}
                                    control={control}
                                    activePacks={data.packages as string[]}
                                    onChange={(activePacks) => {
                                        setData({
                                            ...data,
                                            packages: activePacks,
                                        });
                                    }}
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
