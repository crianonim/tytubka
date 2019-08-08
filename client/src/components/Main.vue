<template>
  <div class="main">
    <url-input :requesting="requesting" @send-url="receiveUrl"></url-input>
    <div v-if="info">
      <video-info
        :profile="profile"
        :requesting="requesting"
        @store-format="storeFormat"
        :info="info"
      ></video-info>
    </div>
    <div class="messages">
      <div v-for="(msg,key) in messages" :key="key">{{msg}}</div>
    </div>
  </div>
</template>

<script>
import Service from "@/services/service";

import UrlInput from "./UrlInput.vue";
import VideoInfo from "./VideoInfo.vue";

export default {
  name: "Main",

  data() {
    return {
      profile: null,
      info: null,
      requesting: false,
      messages: [],
      messagesMaxCount: 3
    };
  },
  created() {
    console.log("Main created");
    if (window.guser) {
      this.profile = window.guser;
    } else {
      window.guserListeners.push(profile => {
        console.log("Vi", profile, this);
        this.profile = profile;
      });
    }
  },
  methods: {
    async receiveUrl(url) {
      console.log("Received", url);
      // this.messages.unshift("RECEIVED url"+url);
      if (url == "") {
        this.info = null;
        return;
      }
      try {
        // uncomment this
        this.requesting = true;
        let result = await Service.getInfo(url);
        this.requesting = false;
        console.log(result);
        this.info = result.data;
      } catch (e) {
        this.messages.unshift(JSON.stringify(e));
      }
    },
    async storeFormat(itag) {
      // this.messages.unshift("Store format "+itag+" of "+this.info.title);
      // console.log("storeFormat",itag,this.info.url);
      if (this.messages.length > this.messagesMaxCount) this.messages.pop();
      // poproś o downaloadowanie
      this.requesting = true;
      let response = await Service.storeVideo(this.info.url, itag);
      this.requesting = false;
      let id = response.data.metadata.id;
      console.log("Will store ad id:", id);
    }
  },
  components: {
    "url-input": UrlInput,
    "video-info": VideoInfo
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
