import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Col, Form, Row } from "react-bootstrap";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from "@hookform/devtools";
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
} from "../../../AppModule/components";
import {
    SimpleObject,
    UnprocessableEntityErrorResponse,
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
} from "../../../AppModule/hooks";

const { Container: ContainerConstant } = CONSTANTS;
const {
    STORAGE: { STORAGE_S3, STORAGE_LOCAL },
} = ContainerConstant;
type PartialContainer = Partial<Container>;

const schema = Yup.object().shape({
    domain: Yup.string().required("Domain is Required"),
    name: Yup.string().required("Name is Required"),
    containerGroup: Yup.string().optional().nullable(),
    userGroups: Yup.array().optional(),
    description: Yup.string().optional().nullable(),
    storage: Yup.string().required(),
    bucketKey: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Key is Required").nullable(),
    }),
    bucketSecret: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Secret is Required").nullable(),
    }),
    bucketName: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Name is Required").nullable(),
    }),
    bucketRegion: Yup.string().when("storage", {
        is: STORAGE_S3,
        then: Yup.string().required("Bucket Region is Required").nullable(),
    }),
});

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
    const [loadingClient, setLoadingClient] = useState<boolean>(true);
    const [loadingUserGroups, setLoadingUserGroups] = useState<boolean>(true);
    const cancelTokenSourceRef = useRef<Canceler>();

    const {
        register,
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        getValues,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: "all",
    });

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
            ContainerApi.findById<Container>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        const packs = response.packages as Package[];
                        const groups = response.userGroups as UserGroup[];
                        const payload = {
                            ...response,
                            packages: packs.map(({ id: packId }) =>
                                PackageApi.toResourceUrl(packId)
                            ),
                            userGroups: groups.map(({ id: ugId, name }) => {
                                setSelectedUserGroups([
                                    ...selectedUserGroups,
                                    { label: name, value: `${ugId}` },
                                ]);
                                return UserGroupApi.toResourceUrl(ugId);
                            }),
                        };
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

    const onSubmit = (formData: Container) => {
        formData.client = ClientApi.toResourceUrl(clientId);
        ContainerApi.createOrUpdate<Container>(id, formData).then(
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

    if (loading || loadingClient || loadingUserGroups) {
        return <AppLoader />;
    }

    const { errors } = formState;

    const isS3 = STORAGE_S3 === getValues("storage");

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Container"} linkUrl={".."} />
            <AppPageHeader
                title={isEditMode ? "Edit Container" : "Add Container"}
            />
            <Row>
                <Col>
                    <DevTool control={control} />
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
                                        label={"Domain"}
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
                                        name={"containerGroup"}
                                        label={"Container Group"}
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
                                    label={"AWS S3 Bucket Secret"}
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
                                    label={"AWS S3 Bucket Name"}
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
                                    label={"AWS S3 Bucket Region"}
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
                        <AppCard title="User Groups">
                            <Form.Row>
                                <AppTagSelect
                                    options={userGroups}
                                    selectedItems={selectedUserGroups}
                                    label="User Groups"
                                    require
                                    description="Hi this is description for this field"
                                    onChange={(item) => {
                                        const groups = selectedUserGroups;
                                        const index = groups.indexOf(item);
                                        if (index !== -1) {
                                            delete groups[index];
                                            setSelectedUserGroups(groups);
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
                        <AppFormActions
                            isEditMode={isEditMode}
                            navigation={navigator}
                        />
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
