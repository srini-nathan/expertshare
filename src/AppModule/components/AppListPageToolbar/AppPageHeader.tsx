import React, { FC, useEffect, useRef } from "react";
import { Col, Form, Row, InputGroup } from "react-bootstrap";
import { navigate } from "@reach/router";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Canceler } from "axios";
import { AppButton } from "../AppButton";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";

export interface AppListPageToolbarProps {
    createLink?: string;
    createLabel?: string;
    onQuickFilterChange?: (s: string) => void;
    cancelTokenSources?: Canceler[];
}

export const AppListPageToolbar: FC<AppListPageToolbarProps> = ({
    createLink,
    createLabel = "Create New",
    onQuickFilterChange = () => {},
    cancelTokenSources = [],
}): JSX.Element => {
    const search$ = useRef(new Subject<string>());
    const destroy$ = new Subject<string>();

    useEffect(() => {
        search$.current
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(destroy$)
            )
            .subscribe((search: string) => {
                while (cancelTokenSources.length > 0) {
                    const c = cancelTokenSources.shift();
                    if (c) {
                        c();
                    }
                }
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
            <Col className={"d-flex justify-content-end"}>
                <Form>
                    <Form.Row>
                        <Col md="auto">
                            <InputGroup>
                                <Form.Control
                                    onChange={handleQuickSearch}
                                    placeholder="Search ..."
                                    type={"search"}
                                ></Form.Control>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">
                                        <AppIcon name="Search" />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Col>
                        <Col md="auto">
                            {createLink ? (
                                <AppButton
                                    variant={"secondary"}
                                    onClick={() => {
                                        navigate(createLink);
                                    }}
                                >
                                    + {createLabel}
                                </AppButton>
                            ) : null}
                        </Col>
                    </Form.Row>
                </Form>
            </Col>
        </Row>
    );
};
