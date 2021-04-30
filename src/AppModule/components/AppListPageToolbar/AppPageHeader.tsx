import React, { FC, useEffect, useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { navigate } from "@reach/router";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Canceler } from "axios";
import { AppButton } from "../AppButton";

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
        <Row className={"p-2"}>
            <Col className={"d-flex justify-content-end"}>
                <Form>
                    <Form.Row>
                        <Col>
                            <Form.Control
                                onChange={handleQuickSearch}
                                type={"search"}
                            ></Form.Control>
                        </Col>
                        <Col>
                            {createLink ? (
                                <AppButton
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
