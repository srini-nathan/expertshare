import React, { FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { Session } from "../../../AdminModule/models";
import { AppSessionListItem } from "./AppSessionListItem";

export interface AppSessionSelectorProps {
    show: boolean;
    handleClose: (show: boolean) => void;
    handleSelected: (items: Session[]) => void;
    items: Session[];
    selectedItems: Session[];
    totalItem?: number;
    loadMore?: (value?: string) => void;
}

interface BadgeProps {
    id: number;
    name: string;
    handleRemoveId: (id: number) => void;
}

export const AppSessionSelector: FC<AppSessionSelectorProps> = ({
    show,
    handleClose,
    items,
    handleSelected,
    selectedItems = [],
    loadMore,
}): JSX.Element => {
    const { t } = useTranslation();
    const addActiveId = (id: number) => {
        const item = items.find((i: Session) => i.id === id);

        handleSelected([...(selectedItems as Session[]), item as Session]);
    };

    const getActive = (id: number): boolean => {
        const item = selectedItems.find((i: Session) => i.id === Number(id));

        if (item) return true;
        return false;
    };
    const Badge: FC<BadgeProps> = ({ id, name, handleRemoveId }) => {
        const removeId = (event: any) => {
            handleRemoveId(event.currentTarget.id);
        };

        return (
            <div className="badge badge-green">
                {name}
                <button
                    aria-label="Close"
                    type="button"
                    className="badge-green--close"
                    id={`${id}`}
                    onClick={removeId}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        );
    };

    const removeItem = (id: number) => {
        const newItems = selectedItems.filter((item) => {
            return item.id !== Number(id);
        });
        handleSelected(newItems);
    };

    return (
        <React.Fragment>
            {show && (
                <div className="edit-users--popup">
                    <div className="edit-users--popup--container w-100">
                        <div className="header p-3">
                            <div className="row m-0 p-0">
                                <div className="header--title col-auto pl-0">
                                    <h2 className="mb-0">
                                        <i className="fak fa-create-group mr-2"></i>
                                        {t("exhibitor.form:select.session")}
                                    </h2>
                                </div>
                                <div className="header--close col-auto mr-0 ml-auto pr-0">
                                    <AppButton
                                        onClick={() => {
                                            handleClose(false);
                                        }}
                                        variant="secondary"
                                    >
                                        <i className="fak fa-times-light"></i>
                                    </AppButton>
                                </div>
                                <div className="header--search col-12 px-0 pt-3">
                                    <div className="search-input-box left-icon">
                                        <Form.Control
                                            onChange={(e: any) => {
                                                if (loadMore)
                                                    loadMore(e.target.value);
                                            }}
                                            placeholder="Search ..."
                                            type={"name"}
                                        ></Form.Control>
                                        <i
                                            className="fak fa-search-light"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="content"
                            onScroll={(e: any) => {
                                const {
                                    scrollTop,
                                    offsetHeight,
                                    scrollHeight,
                                } = e.target;
                                const height = scrollHeight - offsetHeight;
                                if (loadMore) {
                                    if (scrollTop === height) {
                                        loadMore();
                                    }
                                }
                            }}
                        >
                            <Row className="m-0 content--inner">
                                {items.map((item: Session) => {
                                    return (
                                        <div
                                            className="content--inner--item"
                                            key={item.id}
                                        >
                                            <Row className="m-0">
                                                <div className="detail  col-auto">
                                                    <AppSessionListItem
                                                        item={item}
                                                    />
                                                </div>
                                                <div className="add col-auto mr-0 ml-auto">
                                                    <AppButton
                                                        disabled={getActive(
                                                            item.id
                                                        )}
                                                        onClick={() =>
                                                            addActiveId(item.id)
                                                        }
                                                        className={`more ${
                                                            getActive(
                                                                item.id
                                                            ) && "green-btn"
                                                        }`}
                                                        variant="light"
                                                    >
                                                        <i className="fal fa-plus-circle btn-icon"></i>
                                                    </AppButton>
                                                </div>
                                            </Row>
                                        </div>
                                    );
                                    return <></>;
                                })}
                            </Row>
                        </div>
                    </div>
                    <div className="select-box py-3 px-1">
                        <div className="select-box--header">
                            <div className="row m-0 p-0">
                                <div className="title col-6">
                                    <h4 className="mb-0">
                                        {t("exhibitor.form:selected.sessions")}
                                    </h4>
                                </div>
                            </div>
                            <div className="select-box--content px-2">
                                <div className="row m-0 p-0">
                                    {selectedItems.length > 0 &&
                                        selectedItems.map((item: Session) => {
                                            return (
                                                <Badge
                                                    key={item.id}
                                                    id={item.id}
                                                    name={item.title}
                                                    handleRemoveId={removeItem}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="confirm-box p-3">
                        <Row>
                            <Col md={6}>
                                <AppButton
                                    className="btn-block"
                                    variant="secondary"
                                    onClick={() => {
                                        handleClose(false);
                                    }}
                                >
                                    <i className="fas  mr-2 fa-times"></i>
                                    <span>Close</span>
                                </AppButton>
                            </Col>
                            <Col md={6}>
                                <AppButton
                                    variant="secondary"
                                    className="btn-block"
                                    onClick={() => {
                                        handleClose(false);
                                    }}
                                >
                                    <i className="fak mr-2 fa-check-regular-bold"></i>
                                    <span>Confirm</span>
                                </AppButton>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};
