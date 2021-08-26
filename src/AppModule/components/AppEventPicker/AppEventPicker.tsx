import React, { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppEventSelector } from "./AppEventSelector";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { Conference } from "../../../AdminModule/models";
import { AppEventListItem } from "./AppEventListItem";

export interface AppEventPickerProps {
    handleSelected?: (items: Conference[]) => void;
    list?: Conference[];
    selectedList: Conference[];
    title: string;
    icon: string;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    showAdd?: boolean;
    loadMore?: (value?: string) => void;
    onStateChange?: (state: boolean) => void;
    state?: boolean;
}

export const AppEventPicker: FC<AppEventPickerProps> = ({
    list = [],
    title,
    icon,
    sm,
    md,
    lg,
    xl,
    showAdd = false,
    loadMore,
    handleSelected = () => {},
    selectedList = [],
    onStateChange = () => {},
    state = false,
}): JSX.Element => {
    const [show, isShow] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        onStateChange(show);
    }, [show]);

    useEffect(() => {
        isShow(state);
    }, [state]);

    return (
        <Row className="m-0">
            <Col sm={12} className="create-session--speakers--header px-0">
                <Row className="m-0 p-0">
                    <Col
                        sm={"auto"}
                        className="create-session--speakers--header--name px-0"
                    >
                        <h3>
                            <i className={`fak fa-${icon}`}></i>
                            {title}
                        </h3>
                    </Col>
                    {showAdd && (
                        <>
                            <Col
                                sm={"auto"}
                                className="create-session--speakers--header--button mr-0 ml-auto px-0"
                            >
                                <AppButton
                                    onClick={() => {
                                        isShow(true);
                                    }}
                                    variant={"secondary"}
                                    className=" add-btn"
                                >
                                    <i className="fak fa-plus-light mr-2"></i>
                                    {t("common.button:add")}
                                </AppButton>
                            </Col>
                            <AppEventSelector
                                items={list}
                                show={show}
                                handleClose={isShow}
                                handleSelected={handleSelected}
                                selectedItems={selectedList}
                                loadMore={loadMore}
                            />
                        </>
                    )}
                </Row>
            </Col>
            <Col sm={12} className="create-session--speakers--container px-0">
                <Row className="m-0 p-0">
                    {selectedList.map((item: Conference) => {
                        return (
                            <Col
                                key={item.id}
                                md={md}
                                sm={sm}
                                lg={lg}
                                xl={xl}
                                className="create-session--moderators--container--item pl-0 mt-4"
                            >
                                <AppEventListItem item={item} />
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Row>
    );
};
