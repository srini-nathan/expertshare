import React, { FC, useEffect, useRef } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { ActionMeta, ValueType } from "react-select";
import { useTranslation } from "react-i18next";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
    AppFormDropdown,
    AppButton,
    AppIcon,
    AppTagSelectDropDown,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { PrimitiveObject, SimpleObject } from "../../../AppModule/models";

import "./assets/scss/style.scss";

export interface AppTranslationToolbarProps {
    onCreateNew: () => void;
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
    onCreateNew,
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
        <Row className={"translation-page d-flex justify-content-end mt-2"}>
            <Col md={3} sm={6} className="px-1">
                <AppTagSelectDropDown
                    options={values}
                    selectedItems={selectedValues}
                    label={label}
                    onChange={onChangeSelect}
                />
            </Col>
            <Col md={3} sm={6} className="px-1">
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
            <Col md={3} sm={6} className="px-1 mt-sm-2 mt-md-0">
                <InputGroup>
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
            <Col md="auto" sm={6} className=" my-2 my-md-0">
                <AppButton
                    variant={"secondary"}
                    className="justify-content-center"
                    block
                    onClick={onCreateNew}
                >
                    + Create
                </AppButton>
            </Col>
        </Row>
    );
};
