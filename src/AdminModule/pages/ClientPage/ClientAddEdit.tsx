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
import "./assets/scss/client_add_edit_style.scss";
import { Col, Form, Row } from "react-bootstrap";
import { Client, Package } from "../../models";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { ClientApi, PackageApi } from "../../apis";

import { ListResponse } from "../../../AppModule/models";
import { sweetSuccess } from "../../../AppModule/components/Util";
import { AppFormTextArea, AppLoader } from "../../../AppModule/components";
import { errorToast, validation } from "../../../AppModule/utils";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AppFormCheckBox } from "../../../AppModule/components/AppFormCheckBox";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
    notes: Yup.string().optional(),
});

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

export type ClientFormType = {
    name: string;
    notes: string;
    [key: string]: string | boolean;
};

export interface ClientRequestData {
    name: string;
    notes: string;
    packages: string[];
}

export class ClientEntity {
    name: string;

    notes: string;

    packages: Package[];

    constructor() {
        this.name = "";
        this.notes = "";
        this.packages = [];
    }
}

export const ClientAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [client, setClient] = React.useState<ClientEntity>(
        new ClientEntity()
    );
    const [loading, setLoading] = useState<boolean>(!isAddMode);

    const {
        control,
        handleSubmit,
        formState,
        trigger,
        setValue,
        reset,
        register,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const [packageKeys, setPackageKeys] = useState<string[]>();

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
        if (!isAddMode) {
            ClientApi.getById<ClientEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Client not exist");
                    } else if (response !== null) {
                        const fetchedClientPackagesKeys = response.packages.map(
                            (item) => {
                                const key = item.packageKey.replace(".", "_");
                                return { key, value: item.id };
                            }
                        );

                        const fields: string[] = ["name", "notes"];
                        fields.forEach((field) =>
                            setValue(
                                field,
                                getProperty(
                                    response,
                                    field as keyof ClientEntity
                                )
                            )
                        );
                        fetchedClientPackagesKeys.forEach((pk) =>
                            setValue(pk.key, pk.value)
                        );
                        setClient(response);
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isAddMode]);

    // eslint-disable-next-line no-console
    console.log(packages);
    function buildPackageArray(keys: string[], data: ClientFormType) {
        return keys.reduce<ClientRequestData>(
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
            { name: "", notes: "", packages: [] }
        );
    }

    async function createClient(data: ClientFormType) {
        const keys = Object.keys(data);
        const result = buildPackageArray(keys, data);
        await ClientApi.create<Client, ClientRequestData>(result);
        await sweetSuccess({ text: "Client saved successfully " });
        await navigate(ClientApi.CLIENT_LIST_PAGE_PATH);
    }

    async function updateClient(data: ClientFormType) {
        const keys = Object.keys(data);
        const result = buildPackageArray(keys, data);
        await ClientApi.update<Client, ClientRequestData>(id, result);
        await sweetSuccess({ text: "Client updated successfully " });
        await navigate(ClientApi.CLIENT_LIST_PAGE_PATH);
    }

    const onSubmit = async (data: ClientFormType) => {
        if (isAddMode) {
            await createClient(data);
        } else {
            await updateClient(data);
        }
    };

    if (loading) {
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
    const { errors } = formState;
    return (
        <div className="theme-primary-clr theme-primary-font">
            <div className="container-fluid p-0 mb-5">
                <div className="row m-0">
                    <PageHeader
                        linkText={"Client"}
                        linkUrl={".."}
                        pageHeader={
                            isAddMode ? "Add new Client" : "Edit Client"
                        }
                    />
                    <div className="app-container center-block col-12">
                        <div className="edit-client">
                            <Form
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                                onReset={reset}
                            >
                                <div className="row m-0 px-0 px-xl-3 d-flex align-items-start">
                                    <AppFormInput
                                        name={"name"}
                                        label={"Name"}
                                        required={true}
                                        withCounter={true}
                                        {...validation(
                                            "name",
                                            formState,
                                            !isAddMode
                                        )}
                                        errorMessage={errors.name?.message}
                                        value={client.name}
                                        control={control}
                                    />
                                </div>
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
                                <div className="row mx-0 pr-xl-3">
                                    <div className="col-12 px-0 px-xl-3">
                                        <div className="pr-xl-3">
                                            <div className="col-12 d-flex p-0 flex-wrap justify-content-between">
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
                                                    value={client.notes}
                                                    control={control}
                                                />
                                            </div>
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
