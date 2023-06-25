export type Role = "administrator" | "moderator" | "guest" | "developer";

// API response all users not including last login date
export interface User {
    id: number,
    email_address: string,
    affiliate_by: string,
    first_name: string,
    last_name: string,
    role_name: Role,
}

export interface AllUsersResponse {
    status_code: number,
    status_message: string,
    error: unknown,
    data: {
        user_informations: User[] | null,
        pagination: {
            CurrentPage: number,
            NextPage: number,
            PreviousPage: number,
            LimitSize: number,
            TotalPage: number,
        },
    },
}

export interface Invite {
    email_address: string,
    invite_code: string,
    expires: string,
}

export interface AllInvitesResponse {
    status_code: number,
    status_message: string,
    error: unknown,
    data: {
        invites: Invite[] | null,
    }
}

export interface CreateInviteResponse {
    status_code: number,
    status_message: string,
    error: unknown,
    data: Invite | ErrorCode,
}