import React, { FC, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "@reach/router";
import "./assets/scss/style.scss";
import { AppBreadcrumb, AppPageHeader } from "../../components";
import { MeetingAddEditTabs } from "./MeetingAddEditTabs";

export const MeetingAddEditPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const [active, setActive] = useState<number>();
    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("meetings.list:header.title")}
                linkUrl={"/meetings"}
            />
            <AppPageHeader
                title={t("meeting.form:header.title")}
            ></AppPageHeader>
            <div className="schedule-meeting--container mb-3">
                <div className="inner-content card">
                    <MeetingAddEditTabs
                        defaultActiveTab={1}
                        onChangeTab={(tab) => {
                            setActive(tab);
                        }}
                    />
                    <div
                        className="inner-content--steps tab-content"
                        id="myTabContent"
                    >
                        <div
                            className={`inner-content--steps--container overview tab-pane fade ${
                                active === 1 ? "show active" : ""
                            }`}
                            id="overview"
                            role="tabpanel"
                            aria-labelledby="overview-tab"
                        >
                            <div className="inner-box p-4">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="schedule-meeting--text-box mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>
                                                                Meeting Link
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx meeting-link col-12 px-0">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled
                                                        className="input-text w-100 px-2 mr-2"
                                                        placeholder="https://app.expertshare.live/meetings/mahesh.manseta/"
                                                    />
                                                    <button className="btn btn-secondary clipboard-btn">
                                                        <i className="fak fa-clone-light"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--text-box mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>
                                                                Meeting Name
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </h3>
                                                        </div>
                                                        <div className="schedule-meeting--text-box--det--count col-auto px-0 mr-0 ml-auto">
                                                            <span> 0/80 </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="text"
                                                        className="input-text w-100 px-2"
                                                        placeholder="Type here meeting name"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--text-box mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>
                                                                Internal Name
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </h3>
                                                        </div>
                                                        <div className="schedule-meeting--text-box--det--count col-auto px-0 mr-0 ml-auto">
                                                            <span> 0/80 </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="text"
                                                        className="input-text w-100 px-2"
                                                        placeholder="Type here internal name for your meeting"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--text-box mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>
                                                                Meeting Title
                                                                (for Calendar)
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </h3>
                                                        </div>
                                                        <div className="schedule-meeting--text-box--det--count col-auto px-0 mr-0 ml-auto">
                                                            <span> 0/80 </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="text"
                                                        className="input-text w-100 px-2"
                                                        placeholder="Type title which will be shown as meeting title in calendar"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--drop-down mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--drop-down--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                                            <h3>
                                                                Location
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                                <a
                                                                    tabIndex={0}
                                                                    className="guide-icon"
                                                                    role="button"
                                                                    data-toggle="popover"
                                                                    data-trigger="focus"
                                                                    title=""
                                                                    data-content="Choose One"
                                                                    data-original-title="Choose One"
                                                                >
                                                                    <span>
                                                                        𝒾
                                                                    </span>
                                                                </a>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                    <div className="dropdown dropdown-field">
                                                        <a
                                                            className="dropdown-toggle"
                                                            href="#"
                                                            role="button"
                                                            id="dropdownMenuLink"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            Expertshare
                                                        </a>

                                                        <div
                                                            className="dropdown-menu"
                                                            aria-labelledby="dropdownMenuLink"
                                                            x-placement="bottom-start"
                                                        >
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                SR Media
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                Trendyol
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="schedule-meeting--description mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--description--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--description--det--name col-auto px-0">
                                                            <h3>
                                                                Description
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                                <a
                                                                    tabIndex={0}
                                                                    className="guide-icon"
                                                                    role="button"
                                                                    data-toggle="popover"
                                                                    data-trigger="focus"
                                                                    title=""
                                                                    data-content="Choose Description"
                                                                    data-original-title="Description"
                                                                >
                                                                    <span>
                                                                        𝒾
                                                                    </span>
                                                                </a>
                                                            </h3>
                                                        </div>
                                                        <div className="schedule-meeting--description--det--count col-auto px-0 mr-0 ml-auto">
                                                            <span> 0/120 </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--description--tx col-12 px-0">
                                                    <textarea
                                                        className="input-txarea w-100 px-2 pt-2"
                                                        placeholder="Please Enter..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`inner-content--steps--container scheduling tab-pane fade ${
                                active === 2 ? "show active" : ""
                            }`}
                            id="scheduling"
                            role="tabpanel"
                            aria-labelledby="scheduling-tab"
                        >
                            <div className="inner-box p-4">
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <div className="schedule-meeting--duration-time-box card p-3 mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--duration-time-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--duration-time-box--det--name col-auto px-0">
                                                            <h3>
                                                                Duration
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                                <a
                                                                    tabIndex={0}
                                                                    className="guide-icon"
                                                                    role="button"
                                                                    data-toggle="popover"
                                                                    data-trigger="focus"
                                                                    title=""
                                                                    data-content="Choose Duration"
                                                                    data-original-title="Choose Duration"
                                                                >
                                                                    <span>
                                                                        𝒾
                                                                    </span>
                                                                </a>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--duration-time-box--content col-12 px-0">
                                                    <div className="duration-item mb-3 p-3">
                                                        <div className="schedule-meeting--text-box mr-2">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                                    <div className="row m-0 p-0">
                                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                                            <h3>
                                                                                Hrs
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                                    <input
                                                                        type="number"
                                                                        className="input-text w-100 px-2"
                                                                        value="1"
                                                                        placeholder="Choose hour"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="schedule-meeting--text-box mr-2">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                                    <div className="row m-0 p-0">
                                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                                            <h3>
                                                                                Min
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                                    <input
                                                                        type="number"
                                                                        className="input-text w-100 px-2"
                                                                        value="45"
                                                                        placeholder="Choose Minute"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-secondary delete-btn">
                                                            <i className="fak fa-trash-light"></i>
                                                        </button>
                                                    </div>
                                                    <div className="duration-item mb-3 p-3">
                                                        <div className="schedule-meeting--text-box mr-2">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                                    <div className="row m-0 p-0">
                                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                                            <h3>
                                                                                Hrs
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                                    <input
                                                                        type="number"
                                                                        className="input-text w-100 px-2"
                                                                        value="1"
                                                                        placeholder="Choose hour"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="schedule-meeting--text-box mr-2">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                                    <div className="row m-0 p-0">
                                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                                            <h3>
                                                                                Min
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                                    <input
                                                                        type="number"
                                                                        className="input-text w-100 px-2"
                                                                        value="45"
                                                                        placeholder="Choose Minute"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-secondary delete-btn">
                                                            <i className="fak fa-trash-light"></i>
                                                        </button>
                                                    </div>
                                                    <a className="btn btn-secondary add-duration-btn pl-4 pr-3">
                                                        <i className="fak fa-plus-light"></i>
                                                        Another Duration
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="schedule-meeting--title mb-3">
                                            <h2 className="mb-0">
                                                Availability Window
                                            </h2>
                                        </div>
                                        <div className="schedule-meeting--available-times-box card p-3 mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--available-times-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--available-times-box--det--name col-auto px-0">
                                                            <h3>
                                                                Available times
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--available-times-box--content col-12 px-0">
                                                    <div className="available-time-item mb-1 px-3 py-2">
                                                        <div className="schedule-meeting--drop-down day mr-3 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            Monday
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Thuseday
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Wednesday
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="schedule-meeting--drop-down py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            09:00
                                                                            AM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                10:00
                                                                                AM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                12:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="to-divider px-2 my-1">
                                                            {" "}
                                                            to{" "}
                                                        </span>
                                                        <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            14:00
                                                                            PM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                16:00
                                                                                PM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                18:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-secondary delete-btn my-1">
                                                            <i className="fak fa-trash-light"></i>
                                                        </button>
                                                    </div>
                                                    <div className="available-time-item mb-1 px-3 py-2">
                                                        <div className="schedule-meeting--drop-down day mr-3 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            Friday
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Thuseday
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Wednesday
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="schedule-meeting--drop-down py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            09:00
                                                                            AM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                10:00
                                                                                AM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                12:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="to-divider px-2 my-1">
                                                            {" "}
                                                            to{" "}
                                                        </span>
                                                        <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            14:00
                                                                            PM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                16:00
                                                                                PM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                18:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-secondary delete-btn my-1">
                                                            <i className="fak fa-trash-light"></i>
                                                        </button>
                                                    </div>
                                                    <div className="available-time-item mb-1 px-3 py-2">
                                                        <div className="schedule-meeting--drop-down day mr-3 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            Friday
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Thuseday
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Wednesday
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="schedule-meeting--drop-down py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            09:00
                                                                            AM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                10:00
                                                                                AM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                12:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="to-divider px-2 my-1">
                                                            {" "}
                                                            to{" "}
                                                        </span>
                                                        <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            14:00
                                                                            PM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                16:00
                                                                                PM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                18:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-secondary delete-btn my-1">
                                                            <i className="fak fa-trash-light"></i>
                                                        </button>
                                                    </div>
                                                    <div className="available-time-item mb-1 px-3 py-2">
                                                        <div className="schedule-meeting--drop-down day mr-3 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            Wednesday
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Thuseday
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                Wednesday
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="schedule-meeting--drop-down py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            09:00
                                                                            AM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                10:00
                                                                                AM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                12:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="to-divider px-2 my-1">
                                                            {" "}
                                                            to{" "}
                                                        </span>
                                                        <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                                            <div className="row m-0 p-0">
                                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                                    <div className="dropdown dropdown-field">
                                                                        <a
                                                                            className="dropdown-toggle"
                                                                            href="#"
                                                                            role="button"
                                                                            id="dropdownMenuLink"
                                                                            data-toggle="dropdown"
                                                                            aria-haspopup="true"
                                                                            aria-expanded="false"
                                                                        >
                                                                            14:00
                                                                            PM
                                                                        </a>

                                                                        <div
                                                                            className="dropdown-menu"
                                                                            aria-labelledby="dropdownMenuLink"
                                                                            x-placement="bottom-start"
                                                                        >
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                16:00
                                                                                PM
                                                                            </a>
                                                                            <a
                                                                                className="dropdown-item"
                                                                                href="#"
                                                                            >
                                                                                18:00
                                                                                PM
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-secondary delete-btn my-1">
                                                            <i className="fak fa-trash-light"></i>
                                                        </button>
                                                    </div>
                                                    <a className="btn btn-secondary add-duration-btn pl-4 pr-3 mt-3">
                                                        <i className="fak fa-plus-light"></i>
                                                        Another Day
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="schedule-meeting--title mb-3">
                                            <h2 className="mb-0">Preview</h2>
                                        </div>
                                        <div className="card p-3 mb-3">
                                            <div className="row">
                                                <div className="col-12 col-xl-6 schedule-meeting--calendar mb-3"></div>
                                                <div className="col-12 col-xl-6 schedule-meeting--duration-selector mb-3">
                                                    <div className="schedule-meeting--duration-selector--duration mb-3">
                                                        <div className="title">
                                                            <h2 className="text-center">
                                                                Duration
                                                            </h2>
                                                        </div>
                                                        <div className="radio-btn-txt-seperated">
                                                            <div className="radio-btn-txt-seperated--container py-2 px-1">
                                                                <div className="form-check text-center mr-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="duration"
                                                                        id="duration1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="duration1"
                                                                    >
                                                                        1:45
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center mr-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="duration"
                                                                        id="duration2"
                                                                        defaultChecked={
                                                                            true
                                                                        }
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="duration2"
                                                                    >
                                                                        00:30
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="duration"
                                                                        id="duration3"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="duration3"
                                                                    >
                                                                        00:45
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="schedule-meeting--duration-selector--time">
                                                        <div className="title">
                                                            <h2 className="text-center">
                                                                Time
                                                            </h2>
                                                        </div>
                                                        <div className="radio-btn-txt-seperated">
                                                            <div className="radio-btn-txt-seperated--container px-2 py-1">
                                                                <div className="form-check text-center mb-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="timedu"
                                                                        id="timedu1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="timedu1"
                                                                    >
                                                                        09:00 -
                                                                        09:30 AM
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center mb-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="timedu"
                                                                        id="timedu2"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="timedu2"
                                                                    >
                                                                        11:00 -
                                                                        11:30 AM
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center mb-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="timedu"
                                                                        id="timedu3"
                                                                        defaultChecked={
                                                                            true
                                                                        }
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="timedu3"
                                                                    >
                                                                        01:15 -
                                                                        01:45 PM
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center mb-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="timedu"
                                                                        id="timedu4"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="timedu4"
                                                                    >
                                                                        09:00 -
                                                                        09:30 AM
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center mb-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="timedu"
                                                                        id="timedu5"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="timedu5"
                                                                    >
                                                                        11:00 -
                                                                        11:30 AM
                                                                    </label>
                                                                </div>
                                                                <div className="form-check text-center mb-2">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="timedu"
                                                                        id="timedu6"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="timedu6"
                                                                    >
                                                                        01:15 -
                                                                        01:45 PM
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <a className="btn btn-secondary additional-setting-btn pl-4 pr-3 my-3">
                                            <i className="fak fa-plus-light"></i>
                                            Additional Settings
                                        </a>
                                        <div className="schedule-meeting--radio-box mb-3">
                                            <div className="radio-item">
                                                <input
                                                    type="radio"
                                                    id="customr1"
                                                    name="customr"
                                                    value="customr1"
                                                />
                                                <label htmlFor="customr1">
                                                    <span>Single Meeting</span>
                                                </label>
                                            </div>
                                            <div className="radio-item">
                                                <input
                                                    type="radio"
                                                    id="customr2"
                                                    name="customr"
                                                    value="customr2"
                                                />
                                                <label htmlFor="customr2">
                                                    <span>
                                                        Over a period of rolling
                                                        weeks
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="radio-item">
                                                <input
                                                    type="radio"
                                                    id="customr3"
                                                    name="customr"
                                                    value="customr3"
                                                    checked
                                                />
                                                <label htmlFor="customr3">
                                                    <span>Custom Range</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="schedule-meeting--text-box mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>
                                                                Start Date
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                                <a
                                                                    tabIndex={0}
                                                                    className="guide-icon"
                                                                    role="button"
                                                                    data-toggle="popover"
                                                                    data-trigger="focus"
                                                                    title=""
                                                                    data-content="Choose One"
                                                                    data-original-title="Choose One"
                                                                >
                                                                    <span>
                                                                        𝒾
                                                                    </span>
                                                                </a>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="text"
                                                        className="input-text w-100 px-2"
                                                        placeholder="Choose Start Date "
                                                    />
                                                    <a
                                                        className="date-toggle"
                                                        href="#"
                                                    >
                                                        <i
                                                            className="fak fa-calendar-light"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--drop-down mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--drop-down--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                                            <h3>
                                                                Minimum Notice
                                                                Period (Before
                                                                which a meeting
                                                                can be booked)
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                    <div className="dropdown dropdown-field">
                                                        <a
                                                            className="dropdown-toggle"
                                                            href="#"
                                                            role="button"
                                                            id="dropdownMenuLink"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            15 Minutes
                                                        </a>

                                                        <div
                                                            className="dropdown-menu"
                                                            aria-labelledby="dropdownMenuLink"
                                                            x-placement="bottom-start"
                                                        >
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                30 Minutes
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                45 Minutes
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--drop-down mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--drop-down--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                                            <h3>
                                                                Start Time
                                                                Frequency
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                    <div className="dropdown dropdown-field">
                                                        <a
                                                            className="dropdown-toggle"
                                                            href="#"
                                                            role="button"
                                                            id="dropdownMenuLink"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            15 Minutes
                                                        </a>

                                                        <div
                                                            className="dropdown-menu"
                                                            aria-labelledby="dropdownMenuLink"
                                                            x-placement="bottom-start"
                                                        >
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                30 Minutes
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                45 Minutes
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="schedule-meeting--text-box mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>
                                                                End Date
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                                <a
                                                                    tabIndex={0}
                                                                    className="guide-icon"
                                                                    role="button"
                                                                    data-toggle="popover"
                                                                    data-trigger="focus"
                                                                    title=""
                                                                    data-content="Choose One"
                                                                    data-original-title="Choose One"
                                                                >
                                                                    <span>
                                                                        𝒾
                                                                    </span>
                                                                </a>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="text"
                                                        className="input-text w-100 px-2"
                                                        placeholder="Choose End Date "
                                                    />
                                                    <a
                                                        className="date-toggle"
                                                        href="#"
                                                    >
                                                        <i
                                                            className="fak fa-calendar-light"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--drop-down mb-3">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--drop-down--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                                            <h3>
                                                                Buffer Time
                                                                Period (Around
                                                                which a meeting
                                                                can't be booked)
                                                                <span className="required">
                                                                    *
                                                                </span>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                                    <div className="dropdown dropdown-field">
                                                        <a
                                                            className="dropdown-toggle"
                                                            href="#"
                                                            role="button"
                                                            id="dropdownMenuLink"
                                                            data-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            15 Minutes
                                                        </a>

                                                        <div
                                                            className="dropdown-menu"
                                                            aria-labelledby="dropdownMenuLink"
                                                            x-placement="bottom-start"
                                                        >
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                30 Minutes
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                            >
                                                                45 Minutes
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`inner-content--steps--container confirmation tab-pane fade ${
                                active === 3 ? "show active" : ""
                            }`}
                            id="confirmation"
                            role="tabpanel"
                            aria-labelledby="confirmation-tab"
                        >
                            <div className="inner-box p-4">
                                <div className="schedule-meeting--check-box d-flex mb-3">
                                    <div className="custom-checkbox">
                                        <input
                                            className="d-none"
                                            type="checkbox"
                                            id="sendmeetingreminder"
                                            name="sendmeetingreminder"
                                            defaultChecked={true}
                                        />
                                        <label
                                            className="position-relative mb-0"
                                            htmlFor="sendmeetingreminder"
                                        ></label>
                                    </div>
                                    <label className="wrap-label">
                                        Send Meeting Reminder
                                        <a
                                            tabIndex={0}
                                            className="guide-icon"
                                            role="button"
                                            data-toggle="popover"
                                            data-trigger="focus"
                                            title=""
                                            data-content="Choose Duration"
                                            data-original-title="Choose Duration"
                                        >
                                            <span>𝒾</span>
                                        </a>
                                    </label>
                                </div>
                                <div className="schedule-meeting--drop-down mb-3">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--drop-down--det col-12 px-0">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                                    <h3>
                                                        Choose Meeting Reminder
                                                        Email Template
                                                        <a
                                                            tabIndex={0}
                                                            className="guide-icon"
                                                            role="button"
                                                            data-toggle="popover"
                                                            data-trigger="focus"
                                                            title=""
                                                            data-content="Choose Duration"
                                                            data-original-title="Choose Duration"
                                                        >
                                                            <span>𝒾</span>
                                                        </a>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                            <div className="dropdown dropdown-field">
                                                <a
                                                    className="dropdown-toggle"
                                                    href="#"
                                                    role="button"
                                                    id="dropdownMenuLink"
                                                    data-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                >
                                                    Template 1
                                                </a>

                                                <div
                                                    className="dropdown-menu"
                                                    aria-labelledby="dropdownMenuLink"
                                                    x-placement="bottom-start"
                                                >
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        Template 2
                                                    </a>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    >
                                                        Template 3
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
