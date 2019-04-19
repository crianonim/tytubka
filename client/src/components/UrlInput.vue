<template>
  <div class="url-input">
    <div class="url-input-line">
      <input v-model="url">
      <span class="btn rubbish" @click="rubbish">&#x2716;</span>
    </div>
      <span id="get-button" class="btn" @click="sendUrl"> Get </span>
  <div>
    {{debug}}
  </div>
  </div>
</template>

<script>

export default {
  name: "url-input",
  data() {
    return {
      url: "",
      // debug:"DEB",
    };
  },
  methods:{
      sendUrl(){
        this.debug="URL:"+this.url;
          console.log("UrlInput send-url",this.url)
          this.$emit('send-url',this.url)
      },
      rubbish(){
        this.url="";
        this.sendUrl();
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
.url-input {
  display: flex;
  flex-direction: column;
}
.url-input > * {
  margin-top:5px;
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
.rubbish{
  padding-left: 10px;
  padding-right: 10px;

}
#get-button {
  padding: 10px;
}
</style>
