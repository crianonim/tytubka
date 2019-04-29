<template>
  <div class="main">
   
    <url-input :requesting="requesting"   @send-url="receiveUrl"></url-input>
    <div v-if="info">
      <video-info :requesting="requesting" @store-format="storeFormat" :info="info"></video-info>
    </div>
    <div class="messages">
      <div v-for="(msg,key) in messages" :key="key">{{msg}}</div>
    </div>
  </div>
</template>

<script>
import Service from '@/services/service'

import UrlInput from './UrlInput.vue';
import VideoInfo from './VideoInfo.vue';

export default {
  name: 'Main',
 
  data () {
    return {
        info:null,
        requesting:false,
        messages:[],
        messagesMaxCount:3,
    }
  },
  methods:{
      async receiveUrl(url){
          console.log("Received",url)
          // this.messages.unshift("RECEIVED url"+url);
          if (url==""){
            this.info=null;
            return;
          }
          // console.log("SO?")
          // let info=JSON.parse('{"title":"Why Ford And Other American Cars Don’t Sell In Japan","thumbnail_url":"https://i.ytimg.com/vi/L9FELWSDYPk/default.jpg","format":[{"Extension":"mp4","Resolution":"720p","VideoEncoding":"H.264","AudioEncoding":"aac","Itag":22,"AudioBitrate":192},{"Extension":"webm","Resolution":"360p","VideoEncoding":"VP8","AudioEncoding":"vorbis","Itag":43,"AudioBitrate":128},{"Extension":"mp4","Resolution":"360p","VideoEncoding":"H.264","AudioEncoding":"aac","Itag":18,"AudioBitrate":96}],"url":"https://youtube.com/watch?v=L9FELWSDYPk","length":"7m 12s","author":{"id":"UCvJJ_dzjViJCoLf5uKUTwoA","name":"CNBC","avatar":"https://yt3.ggpht.com/a-/AAuE7mBUf8yDGTP1Y9SbGqQxnpLUsrCZWhHbd0CkAQ=s48-c-k-c0xffffffff-no-rj-mo","verified":true,"user":"cnbc","channel_url":"https://www.youtube.com/channel/UCvJJ_dzjViJCoLf5uKUTwoA","user_url":"https://www.youtube.com/user/cnbc"}}');
          // console.log("JESTEM",info);
          // this.info=info;
          try {
            // this.messages.unshift("DATA"+result.data);
          
          // uncomment this
          this.requesting=true;
          let result=await Service.getInfo(url);
          this.requesting=false;
          console.log(result);
          this.info=result.data;
    
           
          }
          catch (e){
            this.messages.unshift(JSON.stringify(e));
            
          }
      },
      async storeFormat(itag){
          // this.messages.unshift("Store format "+itag+" of "+this.info.title);
          // console.log("storeFormat",itag,this.info.url);
          if (this.messages.length>this.messagesMaxCount) this.messages.pop();
          // poproś o downaloadowanie
          this.requesting=true;
          let response=await Service.storeVideo(this.info.url,itag);
          this.requesting=false;
          let id=response.data.metadata.id;
          
          console.log("Will store ad id:",id);
          // try{
          //     await Service.notify(id);
          //     this.messages.unshift("Stored "+this.info.title+" ");
          // }
          // catch (e){
          //     console.log("Couldn't notify",e);
          // }

      }
  },
  components :{
      'url-input':UrlInput,
      'video-info':VideoInfo,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
