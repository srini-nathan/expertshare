import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import { Col, Form, Row } from "react-bootstrap";
import { Canceler } from "axios";
import { Client, Package } from "../../models";
import { ClientApi, PackageApi } from "../../apis";
import { CONSTANTS } from "../../../config";
import {
    AppFormTextArea,
    AppLoader,
    AppCard,
    AppBreadcrumb,
    AppPageHeader,
    AppFormRadioSwitch,
    AppFormActions,
} from "../../../AppModule/components";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { AppPackageSwitches } from "../../components";
import { useNavigator, useParamId } from "../../../AppModule/hooks";

type PartialClient = Partial<Client>;
const { Container: ContainerConstant } = CONSTANTS;
const {
    STORAGE: { STORAGE_S3, STORAGE_LOCAL },
} = ContainerConstant;

export const ClientAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { t } = useTranslation();

    const [data, setData] = React.useState<PartialClient>(new Client());
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
    const cancelTokenSourceRef = useRef<Canceler>();
    const [storageType, setStorageType] = useState<string>("Local");

    let schema = {
        name: Yup.string().required(),
        notes: Yup.string().nullable(),
        storage: Yup.string().required(),
        bucketKey: Yup.string().nullable(),
        bucketSecret: Yup.string().nullable(),
        bucketName: Yup.string().nullable(),
        bucketRegion: Yup.string().nullable(),
        bucketEndpoint: Yup.string().nullable(),
    };

    if (storageType === STORAGE_S3) {
        schema = {
            ...schema,
            bucketKey: Yup.string().required("Bucket Key is Required"),
            bucketSecret: Yup.string().required("Bucket Secret is Required"),
            bucketName: Yup.string().required("Bucket Name is Required"),
            bucketRegion: Yup.string().required("Bucket Region is Required"),
            bucketEndpoint: Yup.string().nullable(),
        };
    }

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        setValue,
    } = useForm<PartialClient>({
        resolver: yupResolver(Yup.object().shape(schema)),
        mode: "all",
    });

    useEffect(() => {
        setValue("storage", storageType);
    }, [storageType]);

    useEffect(() => {
        setLoadingPackages(true);
        PackageApi.find<Package>(1, {}, (c) => {
            cancelTokenSourceRef.current = c;
        }).then(({ response, error }) => {
            setLoadingPackages(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setPackages(response.items);
            }
        });
        const cancelPendingCall = cancelTokenSourceRef.current;
        return () => {
            if (cancelPendingCall) {
                cancelPendingCall();
            }
        };
    }, []);

    useEffect(() => {
        if (isEditMode) {
            ClientApi.findById<Client>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Client not exist");
                    } else if (response !== null) {
                        const packs = response.packages as Package[];
                        setData({
                            ...response,
                            packages: packs.map(({ id: packId }) =>
                                PackageApi.toResourceUrl(packId)
                            ),
                        });
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    const onSubmit = async (formData: Client) => {
        formData.storage = storageType;
        return ClientApi.createOrUpdate<Client>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<PartialClient>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode ? "Client updated" : "Client created"
                        );
                    });
                }
            }
        );
    };

    if (loading || loadingPackages) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:clients")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.client.form:header.titleEdit")
                        : t("admin.client.form:header.title")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"name"}
                                    label={t("admin.client.form:label.name")}
                                    placeholder={t(
                                        "admin.client.form:label.name"
                                    )}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    defaultValue={data.name}
                                    control={control}
                                />
                                <AppFormTextArea
                                    lg={6}
                                    xl={6}
                                    name={"notes"}
                                    label={t("admin.client.form:label.notes")}
                                    placeholder={t(
                                        "admin.client.form:label.notes"
                                    )}
                                    {...validation(
                                        "notes",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.notes?.message}
                                    defaultValue={data.notes || ""}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                        <AppCard
                            title={t("admin.clients.form:label.sectionStorage")}
                        >
                            <Row className="p-3">
                                <AppFormRadioSwitch
                                    name={"storage"}
                                    defaultValue={data.storage}
                                    label={t(
                                        "admin.clients.form:label.storage"
                                    )}
                                    control={control}
                                    onChange={setStorageType}
                                    required={true}
                                    options={[
                                        {
                                            value: STORAGE_S3,
                                            label: t(
                                                "admin.clients.form:label.storage.s3"
                                            ).toString(),
                                        },
                                        {
                                            value: STORAGE_LOCAL,
                                            label: t(
                                                "admin.clients.form:label.storage.local"
                                            ).toString(),
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
                            <Row
                                className={
                                    storageType === STORAGE_S3
                                        ? "mt-2"
                                        : "d-none"
                                }
                            >
                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketKey"}
                                    label={t(
                                        "admin.clients.form:label.storage.s3.bucketKey"
                                    )}
                                    {...validation(
                                        "bucketKey",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketKey?.message}
                                    defaultValue={data.bucketKey}
                                    control={control}
                                    key={"bucketKey"}
                                />

                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketSecret"}
                                    label={t(
                                        "admin.clients.form:label.storage.s3.bucketSecret"
                                    )}
                                    {...validation(
                                        "bucketSecret",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketSecret?.message}
                                    defaultValue={data.bucketSecret}
                                    control={control}
                                    key={"bucketSecret"}
                                />

                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketName"}
                                    label={t(
                                        "admin.clients.form:label.storage.s3.bucketName"
                                    )}
                                    {...validation(
                                        "bucketName",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketName?.message}
                                    defaultValue={data.bucketName}
                                    control={control}
                                    key={"bucketName"}
                                />
                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketRegion"}
                                    label={t(
                                        "admin.clients.form:label.storage.s3.bucketRegion"
                                    )}
                                    {...validation(
                                        "bucketRegion",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.bucketRegion?.message}
                                    defaultValue={data.bucketRegion}
                                    control={control}
                                    key={"bucketRegion"}
                                />
                                <AppFormInput
                                    md={"6"}
                                    lg={"6"}
                                    xl={"6"}
                                    name={"bucketEndpoint"}
                                    required={false}
                                    label={t(
                                        "admin.clients.form:label.storage.s3.bucketEndpoint"
                                    )}
                                    {...validation(
                                        "bucketEndpoint",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.bucketEndpoint?.message
                                    }
                                    defaultValue={data.bucketEndpoint}
                                    control={control}
                                    key={"bucketEndpoint"}
                                />
                            </Row>
                        </AppCard>
                        <AppCard title={t("admin.client.form:label.packages")}>
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
                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
