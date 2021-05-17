import { NavigateFn, useNavigate } from "@reach/router";

export function useNavigator(navigate?: NavigateFn) {
    const hookNav = useNavigate();
    return navigate || hookNav;
}
