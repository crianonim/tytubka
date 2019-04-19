<template>
  <div class="main">
   <url-input @send-url="receiveUrl"></url-input>
   <div v-if="info">
   <video-info @store-format="storeFormat" :info="info"></video-info>
   </div>
   <div class="messages">
     <div v-for="(msg,key) in messages" :key="key">
         {{msg}}
     </div>
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
          try {
            let result=await Service.getInfo(url);
          // this.messages.unshift("DATA"+result.data);
          console.log(result);
          this.info=result.data;

          }
          catch (e){
            this.messages.unshift(JSON.stringify(e));
            
          }
      },
      async storeFormat(itag){
          this.messages.unshift("Store format "+itag+" of "+this.info.title);
          // console.log("storeFormat",itag,this.info.url);
          if (this.messages.length>this.messagesMaxCount) this.messages.pop();
          // poproś o downaloadowanie
          let response=await Service.storeVideo(this.info.url,itag);
          let id=response.data.metadata.id
          console.log("Will store ad id:",id);
          try{
              await Service.notify(id);
              this.messages.unshift("Stored "+this.info.title+" ");
          }
          catch (e){
              console.log("Couldn't notify",e);
          }

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
