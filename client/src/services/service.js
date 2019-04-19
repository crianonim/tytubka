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
  getInfo(askedUrl){
    return axios.get(url+'/info/'+askedUrl.replace(/^.*watch[?]v=(.*)$/,'$1'));
  },
  getHeadersStatus(askedUrl){
      return axios.get(url+"/headersStatus?url="+encodeURI(askedUrl));
  }
}
