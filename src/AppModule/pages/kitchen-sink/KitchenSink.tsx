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
    AppCard,
    AppFormInputPassword,
    AppDacastFrame,
    AppYoutubeFrame,
    AppVimeoFrame,
} from "../../components";
import { SimpleObject } from "../../../AdminModule/models";

const options = [
    { id: "1", value: "chocolate", label: "Chocolate" },
    { id: "2", value: "strawberry", label: "Strawberry" },
    { id: "3", value: "vanilla", label: "Vanilla" },
    { id: "4", value: "apple", label: "Apple" },
    { id: "5", value: "orange", label: "Orange" },
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
                        defaultValue={options[0]}
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
                    name="password"
                    label="Password"
                    placeholder="Input password"
                    description="hello this is description"
                    maxCount={150}
                    errorMessage="This field is required"
                    isValid={true}
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

                <AppCard
                    title="Card Title"
                    subtitle="This is bootstrap subtitle"
                >
                    <p>hello this is children</p>
                </AppCard>
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
            <hr className="col-12" />
            <Row>
                <AppDacastFrame
                    id="1552_f_297509"
                    provider="dacast"
                    width={640}
                    height={390}
                />
            </Row>
            <Row>
                <AppYoutubeFrame
                    url="https://www.youtube.com/watch?v=y9j-BL5ocW8"
                    height="390"
                    width="640"
                    configuration={{ autoplay: 1 }}
                />
            </Row>
            <hr className="col-12" />
            <Row>
                <AppVimeoFrame
                    url="https://vimeo.com/544191717"
                    height="390"
                    width="640"
                />
            </Row>
        </Fragment>
    );
};
