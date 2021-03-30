import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";

import { AppIcon } from "../AppIcon";

export const AppGridAction: FC<RouteComponentProps> = (props): JSX.Element => {
    // eslint-disable-next-line no-console
    console.log(props);

    return (
        <div>
            <a
                href="#"
                className={"mr-3"}
                onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log(props);
                }}
            >
                <AppIcon name={"delete"} />
            </a>

            <a href="#" className={"mr-3"}>
                <AppIcon name={"edit"} />
            </a>
            <a href="#" className={"mr-3"}>
                <AppIcon name={"add"} />
            </a>
            <a href="#">
                <svg
                    width="32"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M26 24C26 25.6569 27.3431 27 29 27C30.6569 27 32 25.6569 32 24C32 22.3431 30.6569 21 29 21C27.3431 21 26 22.3431 26 24Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M26 34C26 35.6569 27.3431 37 29 37C30.6569 37 32 35.6569 32 34C32 32.3431 30.6569 31 29 31C27.3431 31 26 32.3431 26 34Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M26 24L12 24"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M26 34L12 34"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M30 8H14C12.8954 8 12 8.89543 12 10V14C12 15.1046 12.8954 16 14 16H30C31.1046 16 32 15.1046 32 14V10C32 8.89543 31.1046 8 30 8Z"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M12 14V34"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
        </div>
    );
};
