import React, { FC } from "react";
import { Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { User } from "../../../AdminModule/models";
import { AppUserListItem } from "../AppUserListItem";

export interface AppShowUserListPopupProps {
    show: boolean;
    handleClose: (show: boolean) => void;
    users: User[];
    title?: string;
    icon?: string;
}

export const AppShowUserListPopup: FC<AppShowUserListPopupProps> = ({
    show,
    handleClose,
    users,
    title = "",
    icon = "speakers",
}): JSX.Element => {
    const { t } = useTranslation();

    const [search, setSearch] = React.useState<string>("");

    return (
        <React.Fragment>
            {show && (
                <div className="edit-users--popup show-users">
                    <div className="edit-users--popup--container w-100">
                        <div className="header p-3">
                            <div className="row m-0 p-0">
                                <div className="header--title col-auto pl-0">
                                    <h2 className="mb-0">
                                        <i
                                            className={`fak fa-${icon} mr-2`}
                                        ></i>
                                        {title
                                            ? t(title)
                                            : `
                                                ${t(
                                                    "session.form:label.speakers"
                                                )} & ${t(
                                                  "session.form:label.moderators"
                                              )}
                                            `}
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
                                            placeholder="Search ..."
                                            type={"name"}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                            }}
                                        ></Form.Control>
                                        <i
                                            className="fak fa-search-light"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            <Row className="m-0 content--inner">
                                {users
                                    .filter(
                                        (e) =>
                                            e.firstName
                                                .toLocaleLowerCase()
                                                .includes(
                                                    search.toLocaleLowerCase()
                                                ) ||
                                            e.lastName
                                                .toLocaleLowerCase()
                                                .includes(
                                                    search.toLocaleLowerCase()
                                                )
                                    )
                                    .map((user: User) => {
                                        return (
                                            <div className="content--inner--item">
                                                <Row className="m-0">
                                                    <div className="detail  col-auto">
                                                        <AppUserListItem
                                                            user={user}
                                                        />
                                                    </div>
                                                </Row>
                                            </div>
                                        );
                                    })}
                            </Row>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};
