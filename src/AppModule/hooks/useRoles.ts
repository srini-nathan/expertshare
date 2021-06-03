import { Role } from "../../AdminModule/models";

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
            return e.role === "ROLE_ADMIN" || e.role === "ROLE_SUPER_ADMIN";
        });
    } else {
        FilterRoute = roles.filter((e: any) => {
            return e.role !== "ROLE_SUPER_ADMIN" || e.role === "ROLE_ADMIN";
        });
    }

    return FilterRoute;
}

export function useRoles() {
    return { filterRoles, getRoles };
}
