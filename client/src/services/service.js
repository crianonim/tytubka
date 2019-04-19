import config from './config'
import axios from 'axios';
const url="http://"+config.hostname+":"+config.port+config.baseUrl
export default {

  getDownloaded () {
      
      console.log(url)
     return axios.get(url)
    
  },
  getStatus(){
      return axios.get(url+"/status")
  },
  storeVideo(askedUrl,itag){
    return axios.post(url+"/",{url:askedUrl,itag});
  },
  notify(id){
    return axios.get(url+"/notify/"+id);
  },
  getInfo(askedUrl){
    return axios.get(url+'/info/'+askedUrl.replace(/^.*\/(watch\?v=)?/,'') );
  },
  getHeadersStatus(askedUrl){
      return axios.get(url+"/headersStatus?url="+encodeURI(askedUrl));
  }
}
