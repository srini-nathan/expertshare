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
import { Api, Client } from "../../../lib/API/Api";

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
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? "Add Client" : "Edit Client"}</h1>
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
                <Link to={isAddMode ? "." : ".."} className="btn btn-link">
                    Cancel
                </Link>
            </div>
        </form>
    );
};
export default ClientAddEdit;
