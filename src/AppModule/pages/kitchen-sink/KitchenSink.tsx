import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import {
    AppDatePicker,
    AppFormDropdown,
    AppPageHeader,
    AppTagSelect,
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
            <hr />
            <hr />
            <Row>
                <Col>
                    <AppDatePicker value={new Date()} onChange={() => {}} />
                </Col>
            </Row>
            <hr />
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
            </Row>
        </Fragment>
    );
};
