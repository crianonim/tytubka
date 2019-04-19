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
        messages:["Wiadomość <a href=''>aaa</a>"],
        messagesMaxCount:3,
    }
  },
  methods:{
      async receiveUrl(url){
          console.log("REceived",url)
          let result=await Service.getInfo(url.replace(/^.*watch?v=(.*)$/,'$1'));
          console.log(result);
          this.info=result.data;
      },
      async storeFormat(itag){
          this.messages.unshift("Store format "+itag+" of "+this.info.title);
          console.log("storeFormat",itag,this.info.url);
          if (this.messages.length>this.messagesMaxCount) this.messages.pop();
          // poproś o downaloadowanie
          let response=await Service.storeVideo(this.info.url,itag);
          console.log("SERvis zwrócił id",response);
              //notify
          try{
              await Service.notify(response.data.metadata.id);
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
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
