<template>
  <div class="video-info">
    <h1>INFO BOX</h1>
    <h2>{{info.title}}</h2>
    <img :src="info.thumbnail_url">
    <a :href="info.url">Go to Youtube page</a>
    <span class="length">{{info.length}}</span>
    <div class="user">
        <img :src="info.author.avatar">
        <span class="author-name">{{info.author.name}}</span>
    </div>
    <div class="format" v-for="(format,key) in info.format" @click="storeFormat" :data-itag="format.Itag" :key="key">
           {{format.Extension}}
           {{format.Resolution}}
           {{format.AudioBitrate}} kbs
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
      disabled:true
    };
  },
  props:["info"],
  methods:{
     storeFormat(event){
         let itag=event.currentTarget.dataset.itag;
         this.$emit('store-format',itag)
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
h1,
h2 {
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
