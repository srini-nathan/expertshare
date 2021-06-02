import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Row } from "react-bootstrap";
import * as yup from "yup";
import { AppPageHeader, AppFormInputColorPicker } from "../../components";
import { validation } from "../../utils";

export const KitchenSink: FC<RouteComponentProps> = (): JSX.Element => {
    const { control, setValue, formState, handleSubmit } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                colorPicker: yup
                    .string()
                    .required()
                    .matches(
                        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3,4})$/,
                        {
                            message: "Only support valid HEX color code",
                        }
                    ),
            })
        ),
        mode: "all",
    });
    const { errors } = formState;
    return (
        <Fragment>
            <AppPageHeader title={"Kitchen Sink"} />
            <Form
                noValidate
                onSubmit={handleSubmit((data) => {
                    // eslint-disable-next-line no-console
                    console.log(data);
                })}
            >
                <Row>
                    <AppFormInputColorPicker
                        name={"colorPicker"}
                        control={control}
                        setValue={setValue}
                        required={true}
                        {...validation("colorPicker", formState, false)}
                        errorMessage={errors.colorPicker?.message}
                    />
                    <DevTool control={control} />
                </Row>
            </Form>
        </Fragment>
    );
};
