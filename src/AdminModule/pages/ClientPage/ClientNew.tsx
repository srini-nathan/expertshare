import React, { FC } from "react";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container } from "react-bootstrap";
import { AppButton } from "../../../AppModule/components";
import { Api } from "../../../lib/API/Api";

// TODO: define a naming convention for it

export type ClientFormType = {
    name: string;
    notes: string;
};
export const ClientNew: FC<RouteComponentProps> = (): JSX.Element => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<ClientFormType>();
    const onSubmit = async ({ name, notes }: ClientFormType) => {
        await Api.createClient(name, notes);
        await navigate(`/admin/client`);
    };
    return (
        <>
            <Container fluid>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="offset-2 col-md-8">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                className="form-control"
                                id="name"
                                aria-describedby="nameHelp"
                                type="text"
                                name="name"
                                ref={register({ required: true })}
                                placeholder="Name"
                            />
                            <small
                                id="nameHelp"
                                className="form-text text-muted"
                            >
                                Name of the client
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Notes</label>
                            <input
                                className="form-control"
                                id="notes"
                                aria-describedby="notesHelp"
                                type="text"
                                name="notes"
                                ref={register({ required: true })}
                                placeholder="Notes"
                            />
                            <small
                                id="notesHelp"
                                className="form-text text-muted"
                            >
                                Write additional notes about client here
                            </small>
                        </div>
                    </div>
                    <div className="offset-2 col-md-8">
                        <AppButton block={true} type={"submit"}>
                            Create Client
                        </AppButton>
                    </div>
                </form>
            </Container>
        </>
    );
};

export default ClientNew;
