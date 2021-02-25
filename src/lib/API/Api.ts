import axios from "axios";
import { apiLinks } from "./apiLinks";

export class Api {
    static async fetchUserProfile() {
        const res = await axios.get(apiLinks.profile());
        return res.data;
    }

    static async login(username, password) {
        const res = axios.post("/login", { username, password });
        return res.data;
    }
}
