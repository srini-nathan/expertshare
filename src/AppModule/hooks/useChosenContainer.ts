import { AUTH_CHOSEN_CONTAINER } from "../config/app-env";

export function useChosenContainer() {
    const setChosen = (isSet = false) => {
        localStorage.setItem(AUTH_CHOSEN_CONTAINER, `${isSet}`);
    };

    const isChosen = () => {
        return !!localStorage.getItem(AUTH_CHOSEN_CONTAINER);
    };

    return { setChosen, isChosen };
}
