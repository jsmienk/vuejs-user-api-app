const https: boolean = true
const local: string = '192.168.178.12'

export default {
    API_URL: `http${https?'s':''}://${local}:3000/api/v0`,
    API_TIMEOUT: 15000,
    SOCKET_URL: `http${https?'s':''}://${local}:3000/`,
    URL_PASSWORD_RESET: `http://127.0.0.1:8080/reset?t=`,
    URL_EMAIL_VERIFICATION: `http://127.0.0.1:8080/verify?t=`
}