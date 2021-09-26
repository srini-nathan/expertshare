import { Role } from "../../AdminModule/models";
import { ROLES } from "../../config";

function getRoles() {
    const roles = localStorage.getItem("roles");

    if (roles) {
        const roleList = JSON.parse(roles);
        return roleList;
    }

    return [];
}

export function filterRoles(role: string) {
    const roles = getRoles();

    let FilterRoute: Role[];

    if (role === "ROLE_SUPER_ADMIN") {
        FilterRoute = roles.filter((e: any) => {
            return (
                e.role === "ROLE_ADMIN" ||
                e.role === "ROLE_SUPER_ADMIN" ||
                e.role === "ROLE_OPERATOR"
            );
        });
    } else {
        FilterRoute = roles.filter((e: any) => {
            return e.role !== "ROLE_SUPER_ADMIN";
        });
    }

    return FilterRoute;
}

export function getOptions(roles?: string[]) {
    const keys: string[] = Object.keys(ROLES);
    const iteration = roles ?? keys;
    return iteration.map((key) => {
        return {
            id: key,
            value: key,
            label: ROLES[key],
        };
    });
}

export function useRoles() {
    return { filterRoles, getRoles, getOptions };
}
