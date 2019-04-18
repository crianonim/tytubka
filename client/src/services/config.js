import config from '../../../tytubka.config'
export default {
    hostname: "localhost",
    port: config.port,
    baseUrl: "/"+config.mountpath+"/api"
}