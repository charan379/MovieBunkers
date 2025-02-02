import { FilterQuery } from "mongoose";
import { Address } from "nodemailer/lib/mailer";
import { type } from "os";

type NonNullableObject<T> = {
    [K in keyof T as T[K] extends null ? never : K]: T[K];
};

type AgeCertification = {
    certification: string,
    age: number[]
}

type AuthenticatedUser = {
    userId: string,
    userName: string,
    email: string,
    status: UserStatus,
    role: UserRoles,
    createdAt: Date,
    updatedAt: Date,
    token: string,
    tokenExpiresAt: Date,
    loggedInAt: Date,
}

type AgeRatting = {
    country: string,
    ratting: string,
}

type Cast = {
    profile_path?: string,
    name: string,
    character?: string,
}

type Language = {
    ISO_639_1_code: string,
    english_name: string,
    native_name?: string,
}

type Page<T> = {
    /** The current page number */
    page: number,
    /** The total number of pages */
    total_pages: number,
    /** The total number of items in the list */
    total_results: number,
    /** An optional object specifying the sort order of the list */
    sort_order?: Object,
    /** The list T of items on the current page */
    list: T[],
}

type FindAllQuery<T> = {
    query: FilterQuery<T>,
    sort: any,
    limit: number,
    page: number,

}

type Video = {
    name: string,
    site: string,
    key: string,
    size: number,
    type: string,
    official: boolean,
    published_at: Date,
}

type Image = {
    aspect_ratio: number,
    height: number,
    width: number,
    type: string,
    file_path: string,
}

type NodeMailSettings = {
    service?: string,
    host?: string,
    port?: any,
    secure?: boolean,
    requireTLS?: boolean,
    auth: {
        user: string,
        pass: string,
    },
    tls?: {
        ciphers: string
    }
}

type EMail = {
    from: Address;
    to: Address[] | Address;
    cc?: Address[] | Address;
    bcc?: Address[] | Address;
    subject: string;
    html?: string;
    text?: string;
}

type OTP = {
    code: string,
    expiryDate: Date
}

type UserPasswordResetRequestBody = {
    userName: string,
    newPassword: string,
    otp: string,
}

type VerifyUserRequestBody = {
    userName: string,
    otp: string,
}