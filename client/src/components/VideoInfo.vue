<template>
  <div class="video-info">
  
    <!-- <textarea v-model="jsonified"></textarea> -->
    <h3>
      <a :href="info.url">{{info.title}}</a>
    </h3>
    <img class="img-full" :src="info.thumbnail_url">
    <br>
    <span class="length">Video length: {{info.length}}</span>
    <br>
    <br>

    <!-- <div class="user">
        <img :src="info.author.avatar">
        <span class="author-name">{{info.author.name}}</span>
    </div>-->
    <!-- <h4>Download directly selected format</h4> -->
    <div class="format" v-for="(format,key) in info.format" :data-itag="format.Itag" :key="key">
      <a
        class="btn"
        :href=" 'api/direct/?itag='+format.Itag+'&videoid='+info.url.replace(/^.*\/(watch\?v=)?/,'')"
      >Download</a>
        <div class="format-details">
          {{format.Extension}}
          {{format.Resolution}}
          {{format.AudioBitrate}} kbs
        </div>
       
      <span v-if="profile" class="btn" :class="{requesting: requesting}"  :data-itag="format.Itag" @click="storeFormat">Store</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "url-input",
  data() {
    return {
     
      url: "",
      disabled: true,
      beingStored:null,
      // jsonified:JSON.stringify(this.info)
    };
  },
  props: ["info","requesting","profile"],
  methods: {
    storeFormat(event) {
      let itag = event.currentTarget.dataset.itag;
      this.beingStored=itag;
      console.log("BEING STORED",itag)
      this.$emit("store-format", itag);
    }
  },
 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.url-input-line {
  width: 100%;
  display: flex;
}
.url-input-line input {
  flex-grow: 1;
}
.img-full {
  display: block;
  width: 100%;
}


.format {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px;
  margin:2px 0;
}
.format-details {
  flex-grow:1;
  margin:0 10px;
  text-align: center;
}
.format .btn {
  padding: 10px;
  flex-grow: 0;
  margin:0;
  transition: 1s background-color;
  }
.requesting {
  background-color: #007bff87;
}
</style>
