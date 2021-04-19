import React, { FC, useEffect, useState } from "react";
import {
    Link,
    RouteComponentProps,
    useNavigate,
    useParams,
} from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./container_add_edit_style.scss";
import { Client, Container, Package } from "../../models";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { TextInput } from "../../../SharedModule/components/TextInput/TextInput";
import { CustomCheckBox } from "../../../SharedModule/components/CustomCheckBox/CustomCheckBox";
import { ClientApi, PackageApi } from "../../apis";
import { AppFormRadio, AppSpinner } from "../../../AppModule/components";

import { ListResponse } from "../../../AppModule/models";
import { sweetSuccess } from "../../../AppModule/components/Util";
import { ContainerApi } from "../../apis/ContainerApi";

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

export const ContainerAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId, id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [client, setClient] = React.useState<Client>();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        errors,
        formState,
        watch,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const [clientFetched, setClientFetched] = useState(false);
    const [packageKeys, setPackageKeys] = useState<string[]>();
    const storage = watch("storage");
    const notes = watch("notes");
    const domain = watch("domain");
    const containerGroup = watch("containerGroup");
    const bucketKey = watch("bucketKey");
    const bucketSecret = watch("bucketSecret");
    const bucketName = watch("bucketName");

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
            ClientApi.findById<Client>(clientId).then((res) => {
                setClient(res);
                const fetchedClientPackagesKeys = res.packages.map((item) => {
                    const key = item.packageKey.replace(".", "_");
                    return { key, value: item.id };
                });
                fetchedClientPackagesKeys.forEach((pk) =>
                    setValue(pk.key, pk.value)
                );
                setClientFetched(true);
            });
        }
        if (!isAddMode) {
            ContainerApi.findById<Container>(id).then((res) => {
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
                ];
                // eslint-disable-next-line no-console
                console.log(res, fields);
                fields.forEach((field) =>
                    setValue(field, getProperty(res, field as keyof Container))
                );
                fetchedClientPackagesKeys.forEach((pk) =>
                    setValue(pk.key, pk.value)
                );
                setClientFetched(true);
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

    if (!clientFetched) {
        return <AppSpinner />;
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
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                onReset={reset}
                            >
                                <div className="row m-0 px-0 d-flex align-items-start">
                                    <TextInput
                                        length={domain?.length}
                                        label={"Domain"}
                                        name={"domain"}
                                        type={"text"}
                                        limit={true}
                                        maxCount={120}
                                        register={register}
                                        invalid={!!errors.domain}
                                        message={errors.domain?.message}
                                        placeholder={"Please Enter ..."}
                                    />
                                    <TextInput
                                        label={"Container Group"}
                                        name={"containerGroup"}
                                        type={"text"}
                                        limit={true}
                                        maxCount={120}
                                        length={containerGroup?.length}
                                        register={register}
                                        invalid={!!errors.containerGroup}
                                        message={errors.containerGroup?.message}
                                        placeholder={"Please Enter ..."}
                                    />
                                    <div className={"col-md-4 px-3"}>
                                        <div className="d-flex flex-wrap justify-content-between mb-4">
                                            <label
                                                className="light-label m-0"
                                                htmlFor="edit-client-notes"
                                            >
                                                Notes
                                            </label>
                                            <span className="input-letter-counter theme-input-letter-counter-clr">
                                                {notes?.length}/120
                                            </span>
                                            <textarea
                                                className={`text-area w-100 mt-1 ${
                                                    errors.notes
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                name="notes"
                                                id="edit-client-notes"
                                                rows={4}
                                                maxLength={120}
                                                ref={register}
                                                placeholder="Please Enter..."
                                            >
                                                {notes}
                                            </textarea>
                                            <div className="invalid-feedback">
                                                {errors.notes?.message}
                                            </div>
                                        </div>
                                    </div>
                                    <CustomCheckBox
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
                                    <label className="light-label m-0  w-100 mb-2">
                                        Storage Type
                                    </label>
                                    <AppFormRadio
                                        name={"storage"}
                                        id="aws"
                                        label="Aws S3 Bucket"
                                        value="S3"
                                        register={register({ required: true })}
                                    />

                                    <AppFormRadio
                                        name={"storage"}
                                        id="local"
                                        label="Local"
                                        value="Local"
                                        defaultChecked={true}
                                        register={register({ required: true })}
                                    />
                                </div>
                                {storage === "S3" ? (
                                    <>
                                        <div className="row m-0 px-0 mt-2 d-flex align-items-start container">
                                            <TextInput
                                                label={"AWS S3 Bucket Key"}
                                                name={"bucketKey"}
                                                type={"text"}
                                                limit={true}
                                                length={bucketKey?.length}
                                                maxCount={120}
                                                register={register}
                                                invalid={!!errors.bucketKey}
                                                message={
                                                    errors.bucketKey?.message
                                                }
                                                placeholder={"Please Enter ..."}
                                            />
                                            <TextInput
                                                length={bucketSecret?.length}
                                                label={"AWS S3 Bucket Secret"}
                                                name={"bucketSecret"}
                                                type={"text"}
                                                limit={true}
                                                maxCount={120}
                                                register={register}
                                                invalid={!!errors.bucketSecret}
                                                message={
                                                    errors.bucketSecret?.message
                                                }
                                                placeholder={"Please Enter ..."}
                                            />
                                            <TextInput
                                                length={bucketName?.length}
                                                label={"AWS S3 Bucket Name"}
                                                name={"bucketName"}
                                                type={"text"}
                                                limit={true}
                                                maxCount={120}
                                                register={register}
                                                invalid={!!errors.bucketName}
                                                message={
                                                    errors.bucketName?.message
                                                }
                                                placeholder={"Please Enter ..."}
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
                                                    <CustomCheckBox
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
