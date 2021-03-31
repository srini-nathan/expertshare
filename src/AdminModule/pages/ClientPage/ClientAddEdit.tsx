import React, { FC, useEffect, useState } from "react";
import {
    RouteComponentProps,
    Link,
    useNavigate,
    useParams,
} from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./client_add_edit_style.scss";
import { Client, Package } from "../../../lib/API/Api";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { TextInput } from "../../../SharedModule/components/TextInput/TextInput";
import { CustomCheckBox } from "../../../SharedModule/components/CustomCheckBox/CustomCheckBox";
import { ClientApi } from "../../apis/ClientApi";
import { PackageApi } from "../../apis/PackageApi";
import { ListResponse } from "../../../AppModule/models";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
    notes: Yup.string().required("Notes is Required"),
});
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

export type ClientFormType = {
    name: string;
    notes: string;
    packages: [];
};

export interface ClientAdd {
    name: string;
    notes: string;
    packages: string[];
}
export const ClientAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const [packages, setPackages] = React.useState<Package[]>([]);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        errors,
        formState,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const [clientFetched, setClientFetched] = useState(false);
    const [packageKeys, setPackageKeys] = useState<string[]>();

    useEffect(() => {
        if (!isAddMode) {
            ClientApi.findById<Client>(id).then((res) => {
                // eslint-disable-next-line no-console
                console.log(res);
                const fields: string[] = ["name", "notes"];
                fields.forEach((field) =>
                    setValue(field, getProperty(res, field as keyof Client))
                );
                setClientFetched(true);
            });
        }

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
    }, [id, isAddMode, clientFetched, setValue]);

    async function createClient(data: any) {
        const keys = Object.keys(data);
        const result = keys.reduce<ClientAdd>(
            (acc, item: string) => {
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
        // eslint-disable-next-line no-console
        console.log(result);
        await ClientApi.create<Client, ClientAdd>(result);
        await navigate(`/admin/client`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function updateClient({ name, notes }: ClientFormType) {
        await ClientApi.update(id, { name, notes });
        await navigate(`/admin/client`);
    }
    // async function updateClient({ name, notes, activate }: ClientFormType) {
    //     await Api.updateClient(name, notes, activate, id);
    //     await navigate(`/admin/client`);
    // }
    const onSubmit = async (data: any) => {
        if (isAddMode) {
            await createClient(data);
        } else {
            // await updateClient({ name, notes, activate });
        }
    };

    if (!isAddMode) {
        if (!clientFetched) {
            return <div>Loading!!!</div>;
        }
    }
    return (
        <div className="theme-primary-clr theme-primary-font">
            <div className="container-fluid p-0 mb-5">
                <div className="row m-0">
                    <PageHeader
                        linkText={"Client"}
                        linkUrl={"/admin/client"}
                        pageHeader={
                            isAddMode ? "Add new Client" : "Edit Client"
                        }
                    />
                    <div className="app-container center-block col-12">
                        <div className="edit-client">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                onReset={reset}
                            >
                                <div className="row m-0 px-0 px-xl-3 d-flex align-items-start">
                                    <TextInput
                                        label={"Name"}
                                        name={"name"}
                                        type={"text"}
                                        limit={true}
                                        maxCount={120}
                                        register={register}
                                        invalid={!!errors.name}
                                        message={errors.name?.message}
                                        placeholder={"Please Enter ..."}
                                    />
                                </div>
                                <div className="row mx-0 mb-2">
                                    <div className="col-12 mt-2 px-0 pl-xl-3">
                                        <div className="col-12 light-label theme-label-clr pb-1 mb-3">
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
                                <div className="row mx-0 pr-xl-3">
                                    <div className="col-12 px-0 px-xl-3">
                                        <div className="pr-xl-3">
                                            <div className="col-12 d-flex flex-wrap justify-content-between">
                                                <label
                                                    className="light-label theme-label-clr m-0"
                                                    htmlFor="edit-client-notes"
                                                >
                                                    Notes
                                                </label>
                                                <span className="input-letter-counter theme-input-letter-counter-clr">
                                                    0/120
                                                </span>

                                                <textarea
                                                    className={`theme-textarea-bg-clr theme-input-clr theme-input-border theme-input-border-radius theme-input-padding w-100 mt-1 ${
                                                        errors.notes
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    name="notes"
                                                    id="edit-client-notes"
                                                    rows={17}
                                                    ref={register}
                                                    placeholder="Please Enter..."
                                                />
                                                <div className="invalid-feedback">
                                                    {errors.notes?.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mx-0">
                                    <div className="col-12 pl-xl-0">
                                        <div className="edit-client-footer-wrap">
                                            <div className="edit-client-footer w-100 d-flex flex-column flex-sm-row align-items-center justify-content-end">
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        formState.isSubmitting
                                                    }
                                                    className="btn btn-primary"
                                                >
                                                    {formState.isSubmitting && (
                                                        <span className="spinner-border spinner-border-sm mr-1" />
                                                    )}
                                                    Save
                                                </button>
                                                <Link
                                                    to={isAddMode ? "." : ".."}
                                                    className="btn btn-link"
                                                >
                                                    Cancel
                                                </Link>
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
