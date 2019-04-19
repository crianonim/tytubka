import config from './config'
import axios from 'axios';
const url="http://"+config.hostname+":"+config.port+config.baseUrl
export default {

  getDownloaded () {
      
      console.log(url)
     return axios.get(url)
    
  },
  getStatus(){
      return axios.get(config.baseUrl+"/status")
  },
  storeVideo(askedUrl,itag){
    return axios.post(config.baseUrl+"/",{url:askedUrl,itag});
  },
  notify(id){
    return axios.get(config.baseUrl+"/notify/"+id);
  },
  getInfo(askedUrl){
    return axios.get(config.baseUrl+'/info/'+askedUrl.replace(/^.*\/(watch\?v=)?/,'') );
  },
  getHeadersStatus(askedUrl){
      return axios.get(config.baseUrl+"/headersStatus?url="+encodeURI(askedUrl));
  }
}
