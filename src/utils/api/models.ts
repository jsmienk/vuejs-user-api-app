export interface User {
    _id: string,
    readonly verified: boolean,
    readonly email?: string,
    readonly name: string,
    readonly creation: Date,
    readonly use2FA: boolean,
    readonly passed2FA: boolean
}

export interface DeviceSession {
    readonly hash: string,
    readonly ip: string,
    readonly since: Date,
    readonly expires: number,
    readonly platform: string,
    readonly application: string,
    readonly location?: string
}