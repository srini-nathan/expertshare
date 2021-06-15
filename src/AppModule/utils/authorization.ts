export interface ROLE {
    [key: string]: string[];
}

export const ROLES: ROLE = {
    ROLE_USER: ["ROLE_READER"],
    ROLE_STAFF: ["ROLE_USER", "ROLE_READER"],
    ROLE_RELATION_MANAGER: ["ROLE_USER", "ROLE_READER"],
    ROLE_SPEAKER: ["ROLE_USER", "ROLE_READER"],
    ROLE_MODERATOR: ["ROLE_USER", "ROLE_READER"],
    ROLE_EXHIBITOR: ["ROLE_USER", "ROLE_READER"],
    ROLE_OPERATOR: [
        "ROLE_EXHIBITOR",
        "ROLE_MODERATOR",
        "ROLE_SPEAKER",
        "ROLE_RELATION_MANAGER",
        "ROLE_STAFF",
        "ROLE_USER",
        "ROLE_READER",
    ],
    ROLE_ADMIN: [
        "ROLE_OPERATOR",
        "ROLE_EXHIBITOR",
        "ROLE_MODERATOR",
        "ROLE_SPEAKER",
        "ROLE_RELATION_MANAGER",
        "ROLE_STAFF",
        "ROLE_USER",
        "ROLE_READER",
    ],
    ROLE_SUPER_ADMIN: [
        "ROLE_ADMIN",
        "ROLE_OPERATOR",
        "ROLE_EXHIBITOR",
        "ROLE_MODERATOR",
        "ROLE_SPEAKER",
        "ROLE_RELATION_MANAGER",
        "ROLE_STAFF",
        "ROLE_USER",
        "ROLE_READER",
    ],
};

export const isGranted = (userRole: string, role: string): boolean => {
    return (
        userRole === role ||
        (ROLES[userRole] && ROLES[userRole].indexOf(role) > -1)
    );
};
