import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
    AppDatePicker,
    AppFormDropdown,
    AppPageHeader,
    AppTagSelect,
    AppTagSelectDropDown,
    AppFormTextArea,
    AppLoader,
    AppCard,
    AppFormInputPassword,
    AppDacastFrame,
    AppKnovioPlayer,
    AppYoutubeFrame,
    AppVimeoFrame,
    AppFormRadioSwitch,
    AppUploader,
    AppFormRichTextArea,
} from "../../components";
import { SimpleObject } from "../../models";

const options = [
    { id: "1", value: "chocolate", label: "Chocolate" },
    { id: "2", value: "strawberry", label: "Strawberry" },
    { id: "3", value: "vanilla", label: "Vanilla" },
    { id: "4", value: "apple", label: "Apple" },
    { id: "5", value: "orange", label: "Orange" },
    { id: "7", value: "pineapple", label: "Pineapple" },
    { id: "8", value: "banana", label: "Banana" },
    { id: "9", value: "lemon", label: "Lemon" },
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
                    <AppTagSelectDropDown
                        options={options}
                        selectedItems={selectedItems}
                        label="Category"
                        required
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
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppDatePicker defaultValue={new Date()} />
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppTagSelect
                        options={options}
                        selectedItems={selectedItems}
                        label="Category"
                        required
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
            </Row>
            <hr className="col-12" />
            <Row>
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
            </Row>
            <hr className="col-12" />
            <Row>
                <AppFormTextArea
                    id="textarea"
                    required
                    md="4"
                    sm="4"
                    lg="4"
                    xl="4"
                    name="textarea"
                    label="Text Area"
                    defaultValue="hello"
                    placeholder="hello"
                    description="hello this is description"
                    maxCount={150}
                    rows={5}
                    errorMessage="This field is required"
                    isInvalid={true}
                    control={control}
                />
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppCard
                        title="Card Title"
                        subtitle="This is bootstrap subtitle"
                    >
                        <p>hello this is children</p>
                    </AppCard>
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <AppFormRadioSwitch
                    required={true}
                    sm="6"
                    name="radio_switch"
                    label="Success Calculated By"
                    options={options}
                    description="hello this is descriprion"
                    errorMessage="This field is required"
                    defaultValue="chocolate"
                    control={control}
                />
            </Row>
            <hr className="col-12" />
            <Row>
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
                <AppKnovioPlayer
                    linkUrl="https://view.knowledgevision.com/presentation/e31fff7a14ee4a9aa82dca008384c32a"
                    height={390}
                    width={640}
                />
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppDacastFrame
                        id="1552_f_297509"
                        provider="dacast"
                        width={640}
                        height={390}
                    />
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppYoutubeFrame
                        url="https://www.youtube.com/watch?v=y9j-BL5ocW8"
                        height="390"
                        width="640"
                        configuration={{ autoplay: 1 }}
                    />
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <Col>
                    <AppVimeoFrame
                        url="https://vimeo.com/544191717"
                        height="390"
                        width="640"
                    />
                </Col>
            </Row>
            <hr className="col-12" />
            <Row>
                <AppFormRichTextArea
                    id="richtext"
                    required
                    md="12"
                    sm="12"
                    lg="12"
                    xl="12"
                    name="richtext"
                    label="Rich Text Area"
                    defaultValue="hello"
                    placeholder="Rich Text Area"
                    description="hello this is description"
                    maxCount={150}
                    withCounter={true}
                    errorMessage="This field is required"
                    control={control}
                />
            </Row>
            <Row>
                <AppUploader
                    accept="image/*" // For more information see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input
                    withCropper
                />
            </Row>
        </Fragment>
    );
};
