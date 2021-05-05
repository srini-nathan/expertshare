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
import { Col, Form, Row } from "react-bootstrap";
import { Client, Container, Package } from "../../models";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { ClientApi, PackageApi } from "../../apis";
import {
    AppFormRadioSwitch,
    AppFormTextArea,
    AppLoader,
    AppCard,
    AppFormInput,
    AppFormCheckBox,
} from "../../../AppModule/components";
import { ListResponse } from "../../../AppModule/models";
import { sweetSuccess } from "../../../AppModule/components/Util";
import { ContainerApi } from "../../apis/ContainerApi";
import { errorToast, validation } from "../../../AppModule/utils";
import "./assets/scss/container_add_edit_style.scss";

const validationSchema = Yup.object().shape({
    domain: Yup.string().required("Domain is Required"),
    name: Yup.string().required("Name is Required"),
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

    name: string;

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
        this.name = "";
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
        await navigate(`/admin/clients/${clientId}/containers`);
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
                                <AppCard title="Details">
                                    <Form.Row>
                                        <Col md={6} sm={12}>
                                            <AppFormInput
                                                className="pl-0"
                                                md={12}
                                                lg={12}
                                                sm={12}
                                                xl={12}
                                                name={"name"}
                                                label={"Name"}
                                                required={true}
                                                withCounter={true}
                                                {...validation(
                                                    "name",
                                                    formState,
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.name?.message
                                                }
                                                value={container.name}
                                                control={control}
                                            />
                                            <AppFormInput
                                                className="pl-0"
                                                md={12}
                                                lg={12}
                                                sm={12}
                                                xl={12}
                                                name={"domain"}
                                                label={"Domain"}
                                                required={true}
                                                withCounter={true}
                                                {...validation(
                                                    "domain",
                                                    formState,
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.domain?.message
                                                }
                                                value={container.domain}
                                                control={control}
                                            />
                                            <AppFormInput
                                                className="pl-0"
                                                md={12}
                                                lg={12}
                                                sm={12}
                                                xl={12}
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
                                                    errors.containerGroup
                                                        ?.message
                                                }
                                                value={container.containerGroup}
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
                                                sm={12}
                                                xl={12}
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
                                        </Col>
                                    </Form.Row>
                                </AppCard>
                                <AppCard title="Storage">
                                    <Row className="p-3">
                                        <AppFormRadioSwitch
                                            fieldName={"storage"}
                                            radioValue={"S3"}
                                            control={control}
                                            label={"AWS S3 Bucket"}
                                            md={"2"}
                                        />
                                        <AppFormRadioSwitch
                                            fieldName={"storage"}
                                            radioValue={"Local"}
                                            control={control}
                                            label={"Local"}
                                            defaultChecked={true}
                                            md={"2"}
                                        />
                                    </Row>
                                    {storage === "S3" ? (
                                        <Row className="mt-2">
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
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.bucketKey?.message
                                                }
                                                value={container.bucketKey}
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
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.bucketSecret?.message
                                                }
                                                value={container.bucketSecret}
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
                                                    !isAddMode
                                                )}
                                                errorMessage={
                                                    errors.bucketName?.message
                                                }
                                                value={container.bucketName}
                                                control={control}
                                            />
                                        </Row>
                                    ) : (
                                        <></>
                                    )}
                                </AppCard>
                                <AppCard title="Packages">
                                    <Form.Row>
                                        {packages.map((e) => {
                                            return (
                                                <AppFormCheckBox
                                                    key={e.id}
                                                    name={e.packageKey.replace(
                                                        ".",
                                                        "_"
                                                    )}
                                                    label={e.packageKey.replace(
                                                        ".",
                                                        " "
                                                    )}
                                                    labelPosition={"left"}
                                                    value={String(e.id)}
                                                    register={register}
                                                />
                                            );
                                        })}
                                    </Form.Row>
                                </AppCard>
                                <div className="edit-client-footer-wrap p-0 w-100 ">
                                    <div className="edit-client-footer py-4 w-100 d-flex flex-column flex-sm-row align-items-center justify-content-end">
                                        <Link
                                            to={isAddMode ? "." : ".."}
                                            className="btn btn-secondary col-auto mr-0 ml-auto"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={formState.isSubmitting}
                                            className="btn btn-primary col-auto ml-3 mr-2"
                                        >
                                            {formState.isSubmitting && (
                                                <span className="spinner-border spinner-border-sm mr-1" />
                                            )}
                                            Save
                                        </button>
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
