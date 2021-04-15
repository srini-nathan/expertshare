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
import { Client, Package } from "../../models";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { TextInput } from "../../../SharedModule/components/TextInput/TextInput";
import { CustomCheckBox } from "../../../SharedModule/components/CustomCheckBox/CustomCheckBox";
import { ClientApi, PackageApi } from "../../apis";
import { AppFormRadio } from "../../../AppModule/components";

import { ListResponse } from "../../../AppModule/models";
import { sweetSuccess } from "../../../AppModule/components/Util";

const validationSchema = Yup.object().shape({
    // name: Yup.string().required("Name is Required"),
    // notes: Yup.string().required("Notes is Required"),
});

// function getProperty<T, K extends keyof T>(obj: T, key: K) {
//     return obj[key];
// }

export type ContainerFormType = {
    domain: string;
    containerGroup: string;
    storage: string;
    bucketKey: string;
    bucketSecret: string;
    bucketName: string;
    isActive: string;
    client: string;
    [key: string]: string | boolean;
};

export interface ContainerRequestData {
    domain: string;
    containerGroup: string;
    storage: string;
    bucketKey: string;
    bucketSecret: string;
    bucketName: string;
    isActive: string;
    client: string;
    packages: string[];
}

export const ContainerAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId, id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [notes, setNotes] = React.useState<string>("");
    const [, setClient] = React.useState<Client>();
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

        // if (!isAddMode) {
        //     ClientApi.findById<Client>(id).then((res) => {
        //         const fetchedClientPackagesKeys = res.packages.map((item) => {
        //             const key = item.packageKey.replace(".", "_");
        //             return { key, value: item.id };
        //         });
        //
        //         const fields: string[] = ["name", "notes"];
        //         fields.forEach((field) =>
        //             setValue(field, getProperty(res, field as keyof Client))
        //         );
        //         fetchedClientPackagesKeys.forEach((pk) =>
        //             setValue(pk.key, pk.value)
        //         );
        //         setClientFetched(true);
        //     });
        // }
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
                bucketKey: "",
                bucketName: "",
                bucketSecret: "",
                client: "",
                containerGroup: "",
                domain: "",
                isActive: "",
                storage: "",
                packages: [],
            }
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function createContainer(data: ContainerFormType) {
        const keys = Object.keys(data);
        const result = buildPackageArray(keys, data);
        await ClientApi.create<Client, ContainerRequestData>(result);
        await sweetSuccess({ text: "Client saved successfully " });
        await navigate(ClientApi.CLIENT_LIST_PAGE_PATH);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function updateContainer(data: ContainerFormType) {
        const keys = Object.keys(data);
        const result = buildPackageArray(keys, data);
        await ClientApi.update<Client, ContainerRequestData>(id, result);
        await sweetSuccess({ text: "Client updated successfully " });
        await navigate(ClientApi.CLIENT_LIST_PAGE_PATH);
    }

    const onSubmit = async (data: ContainerFormType) => {
        // eslint-disable-next-line no-alert
        alert("i am here");
        // eslint-disable-next-line no-console
        console.log("on submit called");
        // eslint-disable-next-line no-console
        console.log(data);

        // if (isAddMode) {
        //     await createContainer(data);
        // } else {
        //     await updateContainer(data);
        // }
    };

    if (!clientFetched) {
        return <div>Loading!!!</div>;
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
                                                {notes.length}/120
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
                                                onChange={(e) => {
                                                    setNotes(e.target.value);
                                                }}
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
                                        register={register}
                                    />
                                </div>
                                <hr className="col-12 mb-5"></hr>
                                <div className="row m-0 px-0 px-xl-3 d-flex align-items-start container">
                                    <label className="light-label m-0  w-100 mb-2">
                                        Storage Type
                                    </label>
                                    <AppFormRadio
                                        name={"storage"}
                                        id="aws"
                                        label="Aws S3 Bucket"
                                        value="Aws S3 Bucket"
                                        register={register({ required: true })}
                                    />

                                    <AppFormRadio
                                        name={"storage"}
                                        id="local"
                                        label="Local"
                                        value="local"
                                        defaultChecked={true}
                                        register={register({ required: true })}
                                    />
                                </div>
                                {storage === "Aws S3 Bucket" ? (
                                    <>
                                        <div className="row m-0 px-0 mt-2 d-flex align-items-start container">
                                            <TextInput
                                                label={"AWS S3 Bucket Key"}
                                                name={"bucketKey"}
                                                type={"text"}
                                                limit={true}
                                                maxCount={120}
                                                register={register}
                                                invalid={!!errors.bucketKey}
                                                message={
                                                    errors.bucketKey?.message
                                                }
                                                placeholder={"Please Enter ..."}
                                            />
                                            <TextInput
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
                                <hr className="col-12 my-5"></hr>

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
