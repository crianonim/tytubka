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
  }
}
