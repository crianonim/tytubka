import axios from 'axios';
const url = location.origin + location.pathname + "api"
export default {

  getDownloaded() {
    console.log("TOKEN IN getDownloaded", window.id_token);
    return axios.get(url + "/?id_token=" + window.id_token);
  },
  getStatus() {
    return axios.get(url + '/status?id_token=' + window.id_token);
  },
  deleteVideo(id) {
    return axios.delete(url + "/" + id + "?id_token=" + window.id_token)
  },
  storeVideo(askedUrl, itag) {
    let videoid = askedUrl.replace(/^.*\/(watch\?v=)?/, '');
    console.log("Video Code:", videoid);
    console.log("Url:" + url);
    return axios.get(url + "/store?itag=" + itag + "&videoid=" + videoid + "&id_token=" + window.id_token)
  },
  notify(id) {
    return axios.get(config.baseUrl + "/notify/" + id);
  },
  getInfo(askedUrl) {
    let videoid = askedUrl.replace(/^.*\/(watch\?v=)?/, '');
    console.log("Video Code:", videoid);
    console.log("Url:" + url);
    return axios.get(url + '/info/' + videoid);
  },
  getHeadersStatus(askedUrl) {
    return axios.get(url + "/headersStatus?url=" + encodeURI(askedUrl));
  }
}
