import React, { FC } from "react";
import { navigate } from "@reach/router";

export const AppHeaderTypeSwitch: FC<any> = (): JSX.Element => {
    return (
        <div className="attendees-list--header--action--view p-0 pl-2 col-sm-auto">
            <div className="radio-btn-dataview white-box">
                <div className="row m-auto">
                    <div className="form-check text-center">
                        <label className="form-check-label">
                            <i
                                className="fak fa-th-large-regular"
                                aria-hidden="true"
                                onClick={() => navigate("/admin/attendees")}
                            ></i>
                        </label>
                    </div>
                    <div className="form-check text-center">
                        <label className="form-check-label">
                            <i
                                className="fak fa-bars-regular"
                                aria-hidden="true"
                                onClick={() =>
                                    navigate("/admin/attendees/list")
                                }
                            ></i>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
