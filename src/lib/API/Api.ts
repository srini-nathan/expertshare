import axios from "axios";
import { REACT_APP_LOGIN_END_POINT } from "../../Settings/Config/constants";

export interface UserProfile {
    username: string;
    roles: string[];
    permissions: string[];
    email: string;
}

export interface Token {
    token: string;
}
export class Api {
    static async fetchUserProfile(): Promise<UserProfile> {
        return new Promise((resolve) =>
            setTimeout(() => {
                return resolve({
                    username: "Mash",
                    roles: ["SUPER-ADMIN", "ADMIN"],
                    permissions: ["ALL", "NONE"],
                    email: "moshiour0027@gmail.com",
                });
            }, 1000)
        );
    }

    static async login(email: string, password: string): Promise<Token> {
        const res = await axios.post<Token>(REACT_APP_LOGIN_END_POINT, {
            email,
            password,
        });
        return res.data;
    }
}
