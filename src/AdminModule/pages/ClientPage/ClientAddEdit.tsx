import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { forEach as _forEach, isString as _isString } from "lodash";
import { Col, Form, Row } from "react-bootstrap";
import { Canceler } from "axios";
import { ClientEntity, Package } from "../../models";
import { ClientApi, PackageApi } from "../../apis";
import {
    AppFormTextArea,
    AppLoader,
    AppCard,
    AppBreadcrumb,
    AppPageHeader,
    AppFormActions,
    AppFormSwitch,
} from "../../../AppModule/components";
import {
    checkAndAdd,
    checkAndRemove,
    errorToast,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";

const schema = Yup.object().shape({
    name: Yup.string().required(),
    notes: Yup.string().nullable(),
});

export const ClientAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id = null } = useParams();
    const isEditMode: boolean = id !== null;
    const hookNav = useNavigate();
    const nav = navigate ?? hookNav;

    const [data, setData] = React.useState<ClientEntity>(new ClientEntity());
    const [packages, setPackages] = React.useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
    const cancelTokenSourceRef = useRef<Canceler>();

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<ClientEntity>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    useEffect(() => {
        setLoadingPackages(true);
        PackageApi.find<Package>(1, {}, (c) => {
            cancelTokenSourceRef.current = c;
        }).then(({ response, error }) => {
            setLoadingPackages(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setPackages(response.items);
            }
        });
        const cancelPendingCall = cancelTokenSourceRef.current;
        return () => {
            if (cancelPendingCall) {
                cancelPendingCall();
            }
        };
    }, []);

    useEffect(() => {
        if (isEditMode) {
            ClientApi.getById<ClientEntity>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Client not exist");
                    } else if (response !== null) {
                        const packs = response.packages as Package[];
                        setData({
                            ...response,
                            packages: packs.map(({ id: packId }) =>
                                PackageApi.toResourceUrl(packId)
                            ),
                        });
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    const onSubmit = (formData: ClientEntity) => {
        ClientApi.createOrUpdate<ClientEntity>(id, {
            ...formData,
            packages: data.packages,
        }).then(({ error, errorMessage }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                const { violations } = error;
                _forEach(violations, (value: string, key: string) => {
                    const propertyName = key as keyof ClientEntity;
                    setError(propertyName, {
                        type: "backend",
                        message: value,
                    });
                });
            } else if (errorMessage) {
                errorToast(errorMessage);
            } else {
                nav("..").then(() => {
                    successToast(
                        isEditMode ? "Client updated" : "Client created"
                    );
                });
            }
        });
    };

    if (loading || loadingPackages) {
        return <AppLoader />;
    }

    const { errors } = formState;

    const isPackageActive = (resourceUrl: string): boolean => {
        const packs = data.packages as string[];
        return packs.indexOf(resourceUrl) > -1;
    };

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Client"} linkUrl={".."} />
            <AppPageHeader title={isEditMode ? "Edit Client" : "Add Client"} />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"name"}
                                    label={"Name"}
                                    required={true}
                                    withCounter={true}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    value={data.name}
                                    control={control}
                                />
                                <AppFormTextArea
                                    lg={6}
                                    xl={6}
                                    name={"notes"}
                                    label={"Notes"}
                                    required={false}
                                    withCounter={true}
                                    {...validation(
                                        "notes",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.notes?.message}
                                    value={data.notes || ""}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                        <AppCard title="Default Packages">
                            <Form.Row>
                                {packages.map(({ packageKey, id: packId }) => {
                                    const name = packageKey.replace(".", "_");
                                    const resourceUrl = PackageApi.toResourceUrl(
                                        packId
                                    );
                                    return (
                                        <AppFormSwitch
                                            key={name}
                                            name={name}
                                            label={packageKey}
                                            control={control}
                                            defaultChecked={isPackageActive(
                                                resourceUrl
                                            )}
                                            onChange={(event) => {
                                                const packs = data.packages as string[];
                                                if (
                                                    event.currentTarget.checked
                                                ) {
                                                    checkAndAdd<string>(
                                                        packs,
                                                        resourceUrl
                                                    );
                                                } else {
                                                    checkAndRemove<string>(
                                                        packs,
                                                        resourceUrl
                                                    );
                                                }
                                                setData({
                                                    ...data,
                                                    packages: packs,
                                                });
                                            }}
                                        />
                                    );
                                })}
                            </Form.Row>
                        </AppCard>
                        <AppFormActions
                            isEditMode={isEditMode}
                            navigation={nav}
                        />
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
