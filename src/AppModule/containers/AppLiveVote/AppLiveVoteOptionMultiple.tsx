import React, { FC } from "react";
import { LiveVoteOption } from "../../../AdminModule/models/entities/LiveVoteOption";

export const QUESTION_TYPE_RADIO = "RADIO";
export const QUESTION_TYPE_CHECKBOX = "CHECKBOX";

export type QuestionTypeType = "RADIO" | "CHECKBOX";

export interface AppLiveVoteOptionMultipleType {
    options: LiveVoteOption[];
    optionType?: QuestionTypeType;
}

export const AppLiveVoteOptionMultiple: FC<AppLiveVoteOptionMultipleType> = ({
    optionType = QUESTION_TYPE_RADIO,
}) => {
    return (
        <form>
            <div className="radio-item mb-3">
                <input
                    type={optionType}
                    id="die"
                    name="radiobx"
                    value="radiobx"
                    checked={true}
                />
                <label htmlFor="die">
                    <span>
                        Die hausfrauenpanzer schild­krö­te
                        <p className="mb-0">
                            Velit officia consequat duis enim velit mollit.
                            Exercitation veniam consequat sunt nostrud amet.
                        </p>
                    </span>
                </label>
            </div>
            <div className="radio-item mb-3">
                <input
                    type={optionType}
                    name="radiobx"
                    id="zwer"
                    value="radiobx"
                />
                <label htmlFor="zwer">
                    <span>Zwergenadapter faltenbügler</span>
                </label>
            </div>
            <div className="radio-item mb-3">
                <input
                    type={optionType}
                    id="der"
                    name="radiobx"
                    value="radiobx"
                />
                <label htmlFor="der">
                    <span>
                        Der Kummerspeck Drahtesel
                        <p className="mb-0">
                            Velit officia consequat duis enim velit mollit.
                            Exercitation veniam consequat sunt nostrud amet.
                        </p>
                    </span>
                </label>
            </div>
            <div className="radio-item mb-3">
                <input
                    type={optionType}
                    id="sie"
                    name="radiobx"
                    value="radiobx"
                />
                <label htmlFor="sie">
                    <span>Sie spielt die beleidigte Leberwurst</span>
                </label>
            </div>
            <button className="btn btn-primary submit-btn w-100 mt-3">
                <i className="fak fa-check-regular-bold"></i>
                Submit Vote
            </button>
        </form>
    );
};
