import React, { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Col, Form, Row, InputGroup } from "react-bootstrap";
import { navigate } from "@reach/router";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Canceler } from "axios";
import { AppButton } from "../AppButton";
import { AppIcon } from "../AppIcon";
import { cancelAllPrevRequest } from "../../utils";
import "./assets/scss/style.scss";

export interface AppListPageToolbarProps {
    createLink?: string;
    grantedControl?: boolean;
    createLabel?: string;
    onQuickFilterChange?: (s: string) => void;
    cancelTokenSources?: Canceler[];
}

export const AppListPageToolbar: FC<AppListPageToolbarProps> = ({
    createLink,
    createLabel = "common.button:create",
    onQuickFilterChange = () => {},
    cancelTokenSources = [],
    grantedControl = true,
}): JSX.Element => {
    const search$ = useRef(new Subject<string>());
    const destroy$ = new Subject<string>();
    const { t } = useTranslation();
    useEffect(() => {
        search$.current
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(destroy$)
            )
            .subscribe((search: string) => {
                cancelAllPrevRequest(cancelTokenSources);
                onQuickFilterChange(search);
            });
        return () => {
            destroy$.next();
            destroy$.complete();
        };
    });

    function handleQuickSearch(event: React.ChangeEvent<HTMLInputElement>) {
        search$.current.next(event.currentTarget.value);
    }

    return (
        <Row>
            <Col className={"d-flex justify-content-end"} xs="12" sm="auto">
                <Form className={"w-100"}>
                    <Form.Row className={"justify-content-end"}>
                        <Col xs="6" sm="auto" className="mb-2">
                            <InputGroup className="header-search">
                                <Form.Control
                                    onChange={handleQuickSearch}
                                    placeholder={t("common.button:search")}
                                    type={"search"}
                                ></Form.Control>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">
                                        <AppIcon name="Search" />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                        <Col xs="6" sm="auto" className="mb-2">
                            {createLink && grantedControl ? (
                                <AppButton
                                    className={"text-capitalize w-100"}
                                    variant={"secondary"}
                                    onClick={() => {
                                        navigate(createLink);
                                    }}
                                >
                                    + {t(createLabel)}
                                </AppButton>
                            ) : null}
                        </Col>
                    </Form.Row>
                </Form>
            </Col>
        </Row>
    );
};
