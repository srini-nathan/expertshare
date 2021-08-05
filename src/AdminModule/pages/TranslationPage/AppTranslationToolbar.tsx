import React, { FC, useEffect, useRef } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { ActionMeta, ValueType } from "react-select";
import { useTranslation } from "react-i18next";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
    AppFormDropdown,
    AppIcon,
    AppTagSelectDropDown,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { PrimitiveObject, SimpleObject } from "../../../AppModule/models";

import "./assets/scss/style.scss";

export interface AppTranslationToolbarProps {
    label?: string;
    description?: string;
    options: Language[];
    selectedItems: Language[];
    onChangeSelect: (item: SimpleObject<string>) => void;
    onChangeSelectFilter: (
        value: ValueType<PrimitiveObject, boolean>,
        actionMeta: ActionMeta<PrimitiveObject>
    ) => void;
    onQuickFilterChange?: (s: string) => void;
}

export const AppTranslationToolbar: FC<AppTranslationToolbarProps> = ({
    options,
    label,
    selectedItems,
    onChangeSelect,
    onChangeSelectFilter,
    onQuickFilterChange = () => {},
}): JSX.Element => {
    const values: SimpleObject<string>[] = options.map((e) => {
        return {
            id: e.locale,
            value: e.name,
            label: e.name,
        };
    });
    const selectedValues: SimpleObject<string>[] = selectedItems.map((e) => {
        return {
            id: e.locale,
            value: e.name,
            label: e.name,
        };
    });
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
        <>
            <Row
                className={"translation-page d-flex justify-content-end w-100"}
            >
                <Col lg={2} md={3} sm={6} className="px-1 mt-2 mt-md-0">
                    <AppTagSelectDropDown
                        options={values}
                        selectedItems={selectedValues}
                        label={label}
                        onChange={onChangeSelect}
                    />
                </Col>
                <Col xl={2} lg={3} md={4} sm={6} className="px-1 mt-2 mt-md-0">
                    <AppFormDropdown
                        id="where-filter"
                        defaultValue={{
                            label: "Translation Key",
                            value: "tKey",
                        }}
                        onChange={onChangeSelectFilter}
                        options={[
                            {
                                label: t(
                                    "admin.translation.filter:searchBy.translationGroup"
                                ).toString(),
                                value: "translationGroup.tgKey",
                            },
                            {
                                label: t(
                                    "admin.translation.filter:searchBy.translationKey"
                                ).toString(),
                                value: "tKey",
                            },
                            {
                                label: t(
                                    "admin.translation.filter:searchBy.translationValue"
                                ).toString(),
                                value: "translationValues.val",
                            },
                        ]}
                    />
                </Col>
                <Col lg={3} md={3} sm={6} className="px-1 mt-2 mt-md-0">
                    <InputGroup className="header-search">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                                <AppIcon name="Search" />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            onChange={handleQuickSearch}
                            placeholder="Search ..."
                            type={"search"}
                        ></Form.Control>
                    </InputGroup>
                </Col>
            </Row>
        </>
    );
};
