import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Col, Form, Row } from "react-bootstrap";
import { Canceler } from "axios";
import { isString as _isString } from "lodash";
import { Client, Container, Package, UserGroup } from "../../models";
import { ClientApi, PackageApi, UserGroupApi } from "../../apis";
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
    AppTagSelect,
    AppUploader,
} from "../../../AppModule/components";
import {
    FileTypeInfo,
    SimpleObject,
    UnprocessableEntityErrorResponse,
    Upload,
} from "../../../AppModule/models";
import { ContainerApi } from "../../apis/ContainerApi";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { AppPackageSwitches } from "../../components";
import { CONSTANTS } from "../../../config";
import {
    useAuthState,
    useNavigator,
    useParamId,
    useBuildAssetPath,
} from "../../../AppModule/hooks";
import { UploadAPI } from "../../../AppModule/apis";

const { Container: ContainerConstant, Upload: UPLOAD } = CONSTANTS;
const {
    STORAGE: { STORAGE_S3, STORAGE_LOCAL },
} = ContainerConstant;
const {
    FILETYPEINFO: { FILETYPEINFO_CONTAINER_POSTER },
    FILETYPE: { FILETYPE_CONTAINER_POSTER },
} = UPLOAD;

type PartialContainer = Partial<Container>;

export const ContainerAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { clientId: storageClientId } = useAuthState();
    const { clientId = storageClientId } = useParams();
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const [data, setData] = React.useState<PartialContainer>(
        new Container(ClientApi.toResourceUrl(clientId))
    );
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [userGroups, setUserGroups] = React.useState<SimpleObject<string>[]>(
        []
    );
    const [selectedUserGroups, setSelectedUserGroups] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [storageType, setStorageType] = useState<string>("Local");
    const [loadingClient, setLoadingClient] = useState<boolean>(true);
    const [loadingUserGroups, setLoadingUserGroups] = useState<boolean>(true);
    const containerPosterPath = useBuildAssetPath(
        FILETYPEINFO_CONTAINER_POSTER as FileTypeInfo
    );
    const cancelTokenSourceRef = useRef<Canceler>();
    const [files, setFiles] = useState<File[]>([]);

    const { t } = useTranslation();

    let schema = {
        domain: Yup.string().required("Domain is Required"),
        name: Yup.string().required("Name is Required"),
        containerGroup: Yup.string().optional().nullable(),
        userGroups: Yup.array().optional(),
        description: Yup.string().optional().nullable(),
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
        register,
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        reset,
        setValue,
    } = useForm({
        resolver: yupResolver(Yup.object().shape(schema)),
        mode: "all",
    });

    const onFileSelect = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
    };

    useEffect(() => {
        setValue("storage", storageType);
    }, [storageType]);

    useEffect(() => {
        ClientApi.findById<Client>(clientId).then(
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
    }, [clientId]);

    useEffect(() => {
        if (isEditMode) {
            ContainerApi.getSecureContainer<Container>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        const packs = response.packages as Package[];
                        const groups = response.userGroups as UserGroup[];
                        const selected = [] as SimpleObject<string>[];
                        const payload = {
                            ...response,
                            packages: packs.map(({ id: packId }) =>
                                PackageApi.toResourceUrl(packId)
                            ),
                            userGroups: groups.map(({ id: ugId, name }) => {
                                selected.push({
                                    label: name,
                                    value: `${ugId}`,
                                    id: `${ugId}`,
                                });
                                return UserGroupApi.toResourceUrl(ugId);
                            }),
                        };
                        setSelectedUserGroups(selected);
                        setStorageType(response.storage);
                        setData(payload);
                        reset(payload);
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, reset, trigger]);

    useEffect(() => {
        setLoadingUserGroups(true);
        UserGroupApi.find<UserGroup>(1, { "client.id": clientId }, (c) => {
            cancelTokenSourceRef.current = c;
        }).then(({ response, error }) => {
            setLoadingUserGroups(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setUserGroups(
                    response.items.map((user) => {
                        return {
                            label: user.name,
                            value: `${user.id}`,
                            id: `${user.id}`,
                        };
                    })
                );
            }
        });
        const cancelPendingCall = cancelTokenSourceRef.current;
        return () => {
            if (cancelPendingCall) {
                cancelPendingCall();
            }
        };
    }, []);

    const submitForm = (formData: Container) => {
        const userGroupsSelectedItems = selectedUserGroups.map((e) => {
            return UserGroupApi.toResourceUrl(parseInt(e.id, 10));
        });
        formData.client = ClientApi.toResourceUrl(clientId);
        formData.userGroups = userGroupsSelectedItems;
        formData.storage = storageType;
        return ContainerApi.createOrUpdate<Container>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Partial<Container>>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode
                                ? "Container updated"
                                : "Container created"
                        );
                    });
                }
            }
        );
    };

    const onSubmit = async (formData: Container) => {
        if (files.length > 0) {
            const fd = new FormData();
            fd.set("file", files[0], files[0].name);
            fd.set("fileType", FILETYPE_CONTAINER_POSTER);

            return UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ errorMessage, response }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                        return submitForm(formData);
                    }

                    if (response && response.fileName) {
                        formData.imageName = response.fileName;
                    }

                    successToast("Image uploaded");
                    return submitForm(formData);
                }
            );
        }
        return submitForm(formData);
    };

    if (loading || loadingClient || loadingUserGroups) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:containers")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.clients.containers.form:header.titleEdit")
                        : t("admin.clients.containers.for:header.title")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard
                            title={t(
                                "admin.clients.containers.form:label.sectionDetails"
                            )}
                        >
                            <Form.Row>
                                <Col md={6} sm={12}>
                                    <AppFormInput
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"name"}
                                        label={t(
                                            "admin.clients.containers.form:label.name"
                                        )}
                                        {...validation(
                                            "name",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.name?.message}
                                        defaultValue={data?.name}
                                        control={control}
                                    />
                                    <AppFormInput
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"domain"}
                                        label={t(
                                            "admin.clients.containers.form:label.domain"
                                        )}
                                        {...validation(
                                            "domain",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.domain?.message}
                                        defaultValue={data.domain}
                                        control={control}
                                    />
                                    <AppFormInput
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        required={false}
                                        name={"containerGroup"}
                                        label={t(
                                            "admin.clients.containers.form:label.containerGroup"
                                        )}
                                        {...validation(
                                            "containerGroup",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.containerGroup?.message
                                        }
                                        defaultValue={data.containerGroup}
                                        control={control}
                                    />
                                    <AppFormTextArea
                                        className="pl-0"
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"description"}
                                        label={t(
                                            "admin.clients.containers.form:label.description"
                                        )}
                                        required={false}
                                        {...validation(
                                            "description",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.description?.message
                                        }
                                        defaultValue={data.description}
                                        control={control}
                                    />
                                </Col>
                                <Col md={6} sm={12}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore */}
                                    <Form.Group
                                        as={Col}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Form.Label>
                                            {t(
                                                "admin.clients.containers.form:label.image"
                                            )}
                                        </Form.Label>
                                        <AppUploader
                                            withCropper
                                            fileInfo={
                                                FILETYPEINFO_CONTAINER_POSTER as FileTypeInfo
                                            }
                                            imagePath={
                                                data.imageName
                                                    ? `${containerPosterPath}/${data.imageName}`
                                                    : ""
                                            }
                                            accept="image/*"
                                            onFileSelect={onFileSelect}
                                            onDelete={() => {
                                                setValue("imageName", "");
                                                setData({
                                                    ...data,
                                                    imageName: "",
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isActive"}
                                        label={t(
                                            "admin.clients.containers.form:label.isActive"
                                        )}
                                        labelPosition={"top"}
                                        value={1}
                                        defaultChecked={true}
                                        register={register}
                                    />
                                </Col>
                            </Form.Row>
                        </AppCard>
                        <AppCard
                            title={t(
                                "admin.clients.containers.form:label.sectionStorage"
                            )}
                        >
                            <Row className="p-3">
                                <AppFormRadioSwitch
                                    name={"storage"}
                                    defaultValue={data.storage}
                                    label={t(
                                        "admin.clients.containers.form:label.storage"
                                    )}
                                    control={control}
                                    onChange={setStorageType}
                                    required={true}
                                    options={[
                                        {
                                            value: STORAGE_S3,
                                            label: t(
                                                "admin.clients.containers.form:label.storage.s3"
                                            ).toString(),
                                        },
                                        {
                                            value: STORAGE_LOCAL,
                                            label: t(
                                                "admin.clients.containers.form:label.storage.local"
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
                                        "admin.clients.containers.form:label.storage.s3.bucketKey"
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
                                        "admin.clients.containers.form:label.storage.s3.bucketSecret"
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
                                        "admin.clients.containers.form:label.storage.s3.bucketName"
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
                                        "admin.clients.containers.form:label.storage.s3.bucketRegion"
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
                                        "admin.clients.containers.form:label.storage.s3.bucketEndpoint"
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
                        <AppCard
                            title={t(
                                "admin.clients.containers.form:label.packages"
                            )}
                        >
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
                        <AppCard
                            title={t(
                                "admin.clients.containers.form:label.sectionUserGroups"
                            )}
                        >
                            <Form.Row className="m-0">
                                <AppTagSelect
                                    options={userGroups}
                                    selectedItems={selectedUserGroups}
                                    label={t(
                                        "admin.clients.containers.form:label.userGroups"
                                    )}
                                    required={false}
                                    onChange={(item) => {
                                        let index = -1;
                                        selectedUserGroups.filter((e, i) => {
                                            if (e.id === item.id) {
                                                index = i;
                                            }
                                            return e;
                                        });
                                        if (index !== -1) {
                                            setSelectedUserGroups([
                                                ...selectedUserGroups.slice(
                                                    0,
                                                    index
                                                ),
                                                ...selectedUserGroups.slice(
                                                    index + 1
                                                ),
                                            ]);
                                        } else {
                                            setSelectedUserGroups([
                                                ...selectedUserGroups,
                                                item,
                                            ]);
                                        }
                                    }}
                                ></AppTagSelect>
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
