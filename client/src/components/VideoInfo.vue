<template>
  <div class="video-info">
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
        :href=" 'api/direct/?itag='+format.Itag+'&extension='+format.Extension+'&url='+info.url+'&title='+encodeURI(info.title)"
      >
        <div class="format-details">
          {{format.Extension}}
          {{format.Resolution}}
          {{format.AudioBitrate}} kbs
        </div>
      </a>
      <!-- <span class="btn" @click="storeFormat">Store</span> -->
    </div>
    <!-- {{info}} -->
  </div>
</template>

<script>
export default {
  name: "url-input",
  data() {
    return {
      url: "",
      disabled: true
    };
  },
  props: ["info"],
  methods: {
    storeFormat(event) {
      let itag = event.currentTarget.dataset.itag;
      this.$emit("store-format", itag);
    }
  }
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


.format a {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 10px;
  margin:2px 0;
}


</style>
