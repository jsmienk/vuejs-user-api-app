export interface User {
    _id: string,
    readonly verified: boolean,
    readonly player: string,
    readonly email?: string,
    readonly name: string,
    readonly creation: Date,
    readonly use2FA: boolean,
    readonly passed2FA: boolean
}