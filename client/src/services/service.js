import Config from './config'
import axios from 'axios';
const url=location.protocol+"//"+location.hostname+(location.hostname=="localhost"?":"+Config.port:'')+location.pathname+"api"
// const url="http://"+config.hostname+":"+config.port+config.baseUrl
export default {

  getDownloaded () {
      
      console.log(url)
     return axios.get(url)
    
  },u(){
      return axios.get(url+"/status")
  },
  getStatus(){
    return axios.get(url+'/status');
  },
  deleteVideo(id){
    return axios.delete(url+"/"+id)
  },
  storeVideo(askedUrl,itag){
    let videoid=askedUrl.replace(/^.*\/(watch\?v=)?/,'');
    console.log("Video Code:",videoid);
    console.log("Url:"+url);
    return axios.get(url+"/store?itag="+itag+"&videoid="+videoid)
    //return axios.post(config.baseUrl+"/",{url:askedUrl,itag});
  },
  notify(id){
    return axios.get(config.baseUrl+"/notify/"+id);
  },
  getInfo(askedUrl){
    let videoid=askedUrl.replace(/^.*\/(watch\?v=)?/,'');
    console.log("Video Code:",videoid);
    console.log("Url:"+url);
    return axios.get(url+'/info/'+videoid);
  },
  getHeadersStatus(askedUrl){
      return axios.get(url+"/headersStatus?url="+encodeURI(askedUrl));
  }
}
