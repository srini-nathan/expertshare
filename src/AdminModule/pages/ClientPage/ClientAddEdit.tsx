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
import { Api, Client } from "../../../lib/API/Api";
import { PageHeader } from "../../../SharedModule/components/PageHeader/PageHeader";
import { TextInput } from "../../../SharedModule/components/TextInput/TextInput";

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
};

export const ClientAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
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
    useEffect(() => {
        if (!isAddMode) {
            Api.getClient(id).then((res) => {
                const fields: string[] = ["name", "notes"];
                fields.forEach((field) =>
                    setValue(field, getProperty(res, field as keyof Client))
                );
                setClientFetched(true);
            });
        }
    }, [id, isAddMode, clientFetched, setValue]);

    async function createClient({ name, notes }: ClientFormType) {
        await Api.createClient(name, notes);
        await navigate(`/admin/client`);
    }
    async function updateClient({ name, notes }: ClientFormType) {
        await Api.updateClient(name, notes, id);
        await navigate(`/admin/client`);
    }
    const onSubmit = async ({
        name,
        notes,
    }: {
        name: string;
        notes: string;
    }) => {
        if (isAddMode) {
            await createClient({ name, notes });
        } else {
            await updateClient({ name, notes });
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

                                    <div className="col-12 col-sm-3 pr-xl-5 pl-xl-3">
                                        <div className="custom-checkbox d-flex flex-column align-items-center align-items-sm-start mb-3">
                                            <div className="light-label theme-label-clr mb-1">
                                                Active
                                            </div>
                                            <input
                                                className="d-none theme-checkbox-bg-clr"
                                                type="checkbox"
                                                id="edit-client-design"
                                                name="edit-client-design"
                                            />
                                            <label
                                                className="position-relative mb-0"
                                                htmlFor="edit-client-design"
                                            ></label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-5">
                                        <label>Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            ref={register}
                                            className={`form-control ${
                                                errors.name ? "is-invalid" : ""
                                            }`}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.name?.message}
                                        </div>
                                    </div>
                                    <div className="form-group col-5">
                                        <label>Notes</label>
                                        <input
                                            name="notes"
                                            type="text"
                                            ref={register}
                                            className={`form-control ${
                                                errors.notes ? "is-invalid" : ""
                                            }`}
                                        />
                                        <div className="invalid-feedback">
                                            {errors.notes?.message}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button
                                        type="submit"
                                        disabled={formState.isSubmitting}
                                        className="btn btn-primary"
                                    >
                                        {formState.isSubmitting && (
                                            <span className="spinner-border spinner-border-sm mr-1"></span>
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
