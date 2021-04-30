import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
    AppDatePicker,
    AppFormDropdown,
    AppPageHeader,
    AppTagSelect,
    AppFormTextArea,
    AppLoader,
    AppFormInputPassword,
} from "../../components";
import { SimpleObject } from "../../../AdminModule/models";

const options = [
    { id: "1", value: "chocolate", label: "Chocolate" },
    { id: "2", value: "strawberry", label: "Strawberry" },
    { id: "3", value: "vanilla", label: "Vanilla" },
    { id: "4", value: "apple", label: "Apple" },
    { id: "5", value: "orange", label: "Orange" },
    { id: "6", value: "pinapple", label: "Pinapple" },
    { id: "7", value: "cherry", label: "Cherry" },
    { id: "8", value: "cherry", label: "Cherry 1" },
    { id: "9", value: "cherry", label: "Cherry 2" },
    { id: "10", value: "cherry", label: "Cherry 3" },
    { id: "11", value: "cherry", label: "Cherry 4" },
    { id: "12", value: "cherry", label: "Cherry 5" },
    { id: "13", value: "cherry", label: "Cherry 6" },
    { id: "14", value: "cherry", label: "Cherry 7" },
    { id: "15", value: "cherry", label: "Cherry 8" },
    { id: "16", value: "cherry", label: "Cherry 9" },
    { id: "17", value: "cherry", label: "Cherry 10" },
    { id: "18", value: "cherry", label: "Cherry 11" },
    { id: "19", value: "cherry", label: "Cherry 12" },
    { id: "20", value: "cherry", label: "Cherry 13" },
    { id: "21", value: "cherry", label: "Cherry 14" },
    { id: "22", value: "cherry", label: "Cherry 15" },
    { id: "23", value: "cherry", label: "Cherry 16" },
    { id: "24", value: "cherry", label: "Cherry 17" },
    { id: "25", value: "cherry", label: "Cherry 18" },
    { id: "26", value: "cherry", label: "Cherry 19" },
];

export const KitchenSink: FC<RouteComponentProps> = (): JSX.Element => {
    const { control } = useForm();
    const [selectedItems, setSelectedItem] = React.useState<
        SimpleObject<string>[]
    >([]);
    return (
        <Fragment>
            <AppPageHeader title={"Kitchen Sink"} />
            <Row>
                <Col>
                    <AppFormDropdown
                        id={"example"}
                        value={"chocolate"}
                        options={options}
                    />
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppDatePicker value={new Date()} onChange={() => {}} />
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <Col md={6}>
                    <AppTagSelect
                        options={options}
                        selectedItems={selectedItems}
                        label="Category"
                        require
                        description="Hi this is description for this field"
                        onChange={(item) => {
                            const index = selectedItems.indexOf(item);
                            if (index !== -1) {
                                setSelectedItem([
                                    ...selectedItems.slice(0, index),
                                    ...selectedItems.slice(index + 1),
                                ]);
                            } else setSelectedItem([...selectedItems, item]);
                        }}
                    />
                </Col>
                <hr className="col-12" />

                <AppFormInputPassword
                    id="password"
                    required
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                    name="passsword"
                    label="Password"
                    placeholder="Input password"
                    description="hello this is description"
                    maxCount={150}
                    errorMessage="This field is required"
                    isInvalid={true}
                    control={control}
                />
                <hr className="col-12" />

                <AppFormTextArea
                    id="textarea"
                    required
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                    name="textarea"
                    label="Text Area"
                    value="hello"
                    placeholder="hello"
                    description="hello this is description"
                    maxCount={150}
                    //  rows={5}
                    errorMessage="This field is required"
                    isInvalid={true}
                    control={control}
                />
                <hr className="col-12" />

                {/* <AppFormRadioSwitch */}
                {/*    required */}
                {/*    sm="6" */}
                {/*    fieldName="radio_switch" */}
                {/*    label="Success Calculated By" */}
                {/*    // values={[ */}
                {/*    //     { label: "Overall", value: "overall" }, */}
                {/*    //     { label: "Per Session", value: "per_session" }, */}
                {/*    // ]} */}
                {/*    description="hello this is descriprion" */}
                {/*    errorMessage="This field is required" */}
                {/*    invalid={true} */}
                {/*    // defaultValue="overall" */}
                {/* /> */}

                <hr className="col-12" />

                <div
                    className="col-md-12 vh-100"
                    style={{ border: "1px solid" }}
                >
                    <AppLoader
                        spinnerAnimation="border"
                        spinnerVariant="primary"
                    />
                </div>

                <div
                    className="col-md-6 vh-100"
                    style={{ border: "1px solid" }}
                >
                    <AppLoader
                        spinnerAnimation="border"
                        spinnerVariant="primary"
                    />
                </div>
                <div
                    className="col-md-6 vh-100"
                    style={{ border: "1px solid" }}
                >
                    <AppLoader
                        spinnerAnimation="grow"
                        spinnerVariant="primary"
                    />
                </div>
            </Row>
        </Fragment>
    );
};
