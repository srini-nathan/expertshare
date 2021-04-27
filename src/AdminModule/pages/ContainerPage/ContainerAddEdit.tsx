import React, { FC, useEffect, useState } from "react";
import {
    RouteComponentProps,
    useNavigate,
    useParams,
    Link,
} from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./container_add_edit_style.scss";
import { Col, Form, Row } from "react-bootstrap";
import { Client, Container, Package } from "../../models";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { ClientApi, PackageApi } from "../../apis";
import {
    AppFormRadioSwitch,
    AppFormTextArea,
    AppLoader,
} from "../../../AppModule/components";
import { ListResponse } from "../../../AppModule/models";
import { sweetSuccess } from "../../../AppModule/components/Util";
import { ContainerApi } from "../../apis/ContainerApi";
import { errorToast, validation } from "../../../AppModule/utils";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AppFormCheckBox } from "../../../AppModule/components/AppFormCheckBox";

const validationSchema = Yup.object().shape({
    domain: Yup.string().required("Domain is Required"),
    containerGroup: Yup.string().optional(),
    notes: Yup.string().optional(),
    bucketKey: Yup.string().when("storage", {
        is: "S3",
        then: Yup.string().required("Bucket Key is Required"),
    }),
    bucketSecret: Yup.string().when("storage", {
        is: "S3",
        then: Yup.string().required("Bucket Secret is Required"),
    }),
    bucketName: Yup.string().when("storage", {
        is: "S3",
        then: Yup.string().required("Bucket Name is Required"),
    }),
});

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

export type ContainerFormType = {
    domain: string;
    containerGroup: string;
    storage: string;
    bucketKey: string;
    bucketSecret: string;
    bucketName: string;
    isActive: string;
    client: string;
    notes: string;
    [key: string]: string | boolean;
};

export interface ContainerRequestData {
    domain: string;
    containerGroup?: string;
    storage: string;
    bucketKey?: string;
    bucketSecret?: string;
    bucketName?: string;
    isActive?: boolean;
    client?: string;
    notes?: string;
    packages: string[];
    configuration?: string[];
}

export class ContainerEntity {
    domain: string;

    containerGroup?: string;

    storage: string;

    bucketKey?: string;

    bucketSecret?: string;

    bucketName?: string;

    isActive?: boolean;

    client?: string;

    notes?: string;

    packages: Package[];

    configuration?: string[];

    constructor() {
        this.domain = "";
        this.storage = "Local";
        this.packages = [];
    }
}
export const ContainerAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId, id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [client, setClient] = React.useState<Client>();
    const {
        control,
        handleSubmit,
        formState,
        trigger,
        setValue,
        reset,
        register,
        watch,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const [clientFetched, setClientFetched] = useState(false);
    const [containerFetched, setContainerFetched] = useState(false);
    const [packageKeys, setPackageKeys] = useState<string[]>();
    const storage = watch("storage");
    const [container, setContainer] = React.useState<ContainerEntity>(
        new ContainerEntity()
    );
    // const [loading, setLoading] = useState<boolean>(!isAddMode);
    const { errors } = formState;
    useEffect(() => {
        PackageApi.findAll<Package>().then(
            ({ items }: ListResponse<Package>) => {
                setPackageKeys(
                    items
                        .map((p) => p.packageKey)
                        .map((key) => key.replace(".", "_"))
                );
                setPackages(items);
            }
        );
        if (isAddMode) {
            ClientApi.getById<Client>(clientId).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Client not exist");
                    } else if (response !== null) {
                        setClient(response);
                        const fetchedClientPackagesKeys = response.packages.map(
                            (item) => {
                                const key = item.packageKey.replace(".", "_");
                                return { key, value: item.id };
                            }
                        );
                        fetchedClientPackagesKeys.forEach((pk) =>
                            setValue(pk.key, pk.value)
                        );
                        trigger();
                    }
                    setClientFetched(true);
                }
            );

            // ClientApi.getById<Client>(clientId).then((res) => {
            //     setClient(res);
            //     const fetchedClientPackagesKeys = res.packages.map((item) => {
            //         const key = item.packageKey.replace(".", "_");
            //         return { key, value: item.id };
            //     });
            //     fetchedClientPackagesKeys.forEach((pk) =>
            //         setValue(pk.key, pk.value)
            //     );
            //     setClientFetched(true);
            // });
        }
        if (!isAddMode) {
            ContainerApi.findById<ContainerEntity>(id).then((res) => {
                const fetchedClientPackagesKeys = res.packages.map((item) => {
                    const key = item.packageKey.replace(".", "_");
                    return { key, value: item.id };
                });

                const fields: string[] = [
                    "domain",
                    "containerGroup",
                    "storage",
                    "bucketKey",
                    "bucketSecret",
                    "bucketName",
                    "isActive",
                    // "notes",
                ];
                fields.forEach((field) =>
                    setValue(
                        field,
                        getProperty(res, field as keyof ContainerEntity)
                    )
                );
                fetchedClientPackagesKeys.forEach((pk) =>
                    setValue(pk.key, pk.value)
                );
                setClientFetched(true);
                setContainer(res);
                setContainerFetched(true);
            });
        }
    }, [id, isAddMode, clientFetched, setValue, clientId]);

    function buildPackageArray(keys: string[], data: ContainerFormType) {
        return keys.reduce<ContainerRequestData>(
            (acc, item) => {
                if (packageKeys?.includes(item)) {
                    if (data[item] !== false) {
                        const newPackageString = `/api/packages/${data[item]}`;
                        const newPackageArray = [
                            ...acc.packages,
                            newPackageString,
                        ];
                        return { ...acc, packages: newPackageArray };
                    }
                    return acc;
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                acc[item] = data[item];
                return acc;
            },
            {
                configuration: [],
                domain: "",
                storage: "",
                packages: [],
            }
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function createContainer(data: ContainerFormType) {
        const keys = Object.keys(data);
        const result = buildPackageArray(keys, data);
        delete result.notes;
        delete result.configuration;
        const includeData = {
            ...result,
            client: `/api/clients/${client?.id}`,
            isActive: data.isActive === "1",
        };
        await ContainerApi.create<Container, ContainerRequestData>(includeData);
        await sweetSuccess({ text: "Client saved successfully " });
        await navigate(`/admin/client/${clientId}/container`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function updateContainer(data: ContainerFormType) {
        const keys = Object.keys(data);
        const result = buildPackageArray(keys, data);
        delete result.notes;
        delete result.configuration;
        const includeData = {
            ...result,
            client: `/api/clients/${client?.id}`,
            isActive: data.isActive === "1",
        };
        await ContainerApi.update<Container, ContainerRequestData>(
            id,
            includeData
        );
        await sweetSuccess({ text: "Client updated successfully " });
        await navigate(`/admin/client/${clientId}/container`);
    }

    const onSubmit = async (data: ContainerFormType) => {
        if (isAddMode) {
            await createContainer(data);
        } else {
            await updateContainer(data);
        }
    };
    if (!isAddMode && !containerFetched) {
        return (
            <Row>
                <Col md={12} className="vh-100">
                    <AppLoader
                        spinnerAnimation="border"
                        spinnerVariant="primary"
                    />
                </Col>
            </Row>
        );
    }

    if (!clientFetched) {
        return (
            <Row>
                <Col md={12} className="vh-100">
                    <AppLoader
                        spinnerAnimation="border"
                        spinnerVariant="primary"
                    />
                </Col>
            </Row>
        );
    }

    // eslint-disable-next-line no-console
    console.log(storage);

    return (
        <div className="theme-primary-clr theme-primary-font">
            <div className="container-fluid p-0 mb-5">
                <div className="row m-0">
                    <PageHeader
                        linkText={"Client"}
                        linkUrl={ClientApi.CLIENT_LIST_PAGE_PATH}
                        pageHeader={
                            isAddMode ? "Add Container" : "Edit Container"
                        }
                    />
                    <div className="app-container center-block col-12">
                        <div className="edit-client">
                            <Form
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                                onReset={reset}
                            >
                                <div className="row m-0 px-0 d-flex align-items-start">
                                    <AppFormInput
                                        name={"domain"}
                                        label={"Domain"}
                                        required={true}
                                        withCounter={true}
                                        {...validation(
                                            "domain",
                                            formState,
                                            !isAddMode
                                        )}
                                        errorMessage={errors.domain?.message}
                                        value={container.domain}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"containerGroup"}
                                        label={"Container Group"}
                                        required={true}
                                        withCounter={true}
                                        {...validation(
                                            "containerGroup",
                                            formState,
                                            !isAddMode
                                        )}
                                        errorMessage={
                                            errors.containerGroup?.message
                                        }
                                        value={container.containerGroup}
                                        control={control}
                                    />
                                    <div className={"col-md-4 px-3"}>
                                        <div className="d-flex flex-wrap justify-content-between mb-4">
                                            <AppFormTextArea
                                                name={"notes"}
                                                label={"Notes"}
                                                required={false}
                                                withCounter={true}
                                                {...validation(
                                                    "notes",
                                                    formState,
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.notes?.message
                                                }
                                                value={container.notes}
                                                control={control}
                                            />
                                        </div>
                                    </div>
                                    <AppFormCheckBox
                                        className="container-checkbox"
                                        name={"isActive"}
                                        label={"Active"}
                                        labelPosition={"top"}
                                        value={1}
                                        defaultChecked={true}
                                        register={register}
                                    />
                                </div>
                                <hr className="col-12 mb-5" />
                                <div className="row m-0 px-0 px-xl-3 d-flex align-items-start container">
                                    <AppFormRadioSwitch
                                        fieldName={"storage"}
                                        radioValue={"S3"}
                                        control={control}
                                        label={"AWS S3 Bucket"}
                                    />
                                    <AppFormRadioSwitch
                                        fieldName={"storage"}
                                        radioValue={"Local"}
                                        control={control}
                                        label={"Local"}
                                        defaultChecked={true}
                                    />
                                </div>
                                {storage === "S3" ? (
                                    <>
                                        <div className="row m-0 px-0 mt-2 d-flex align-items-start container">
                                            <AppFormInput
                                                name={"bucketKey"}
                                                label={"AWS S3 Bucket Key"}
                                                required={true}
                                                withCounter={true}
                                                {...validation(
                                                    "bucketKey",
                                                    formState,
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.bucketKey?.message
                                                }
                                                value={container.bucketKey}
                                                control={control}
                                            />

                                            <AppFormInput
                                                name={"bucketSecret"}
                                                label={"AWS S3 Bucket Secret"}
                                                required={true}
                                                withCounter={true}
                                                {...validation(
                                                    "bucketSecret",
                                                    formState,
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.bucketSecret?.message
                                                }
                                                value={container.bucketSecret}
                                                control={control}
                                            />

                                            <AppFormInput
                                                name={"bucketName"}
                                                label={"AWS S3 Bucket Name"}
                                                required={true}
                                                withCounter={true}
                                                {...validation(
                                                    "bucketName",
                                                    formState,
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.bucketName?.message
                                                }
                                                value={container.bucketName}
                                                control={control}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <hr className="col-12 my-5" />

                                <div className="row mx-0 mb-2">
                                    <div className="col-12 mt-2 px-0 pl-xl-3">
                                        <div className="col-12 light-label theme-label-clr px-0 pb-1 mb-3">
                                            Default Packages
                                        </div>
                                    </div>
                                    <div className="edit-client-packages w-100">
                                        <div className="d-flex flex-wrap">
                                            {packages.map((e) => {
                                                return (
                                                    <AppFormCheckBox
                                                        key={e.id}
                                                        name={e.packageKey.replace(
                                                            ".",
                                                            "_"
                                                        )}
                                                        label={e.packageKey}
                                                        labelPosition={"left"}
                                                        value={String(e.id)}
                                                        register={register}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mx-0">
                                    <div className="col-12 pl-xl-0">
                                        <div className="edit-client-footer-wrap">
                                            <div className="edit-client-footer w-100 d-flex flex-column flex-sm-row align-items-center justify-content-end">
                                                <Link
                                                    to={isAddMode ? "." : ".."}
                                                    className="btn m-2 btn-secondary"
                                                >
                                                    Cancel
                                                </Link>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        formState.isSubmitting
                                                    }
                                                    className="btn m-2 btn-primary"
                                                >
                                                    {formState.isSubmitting && (
                                                        <span className="spinner-border spinner-border-sm mr-1" />
                                                    )}
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
