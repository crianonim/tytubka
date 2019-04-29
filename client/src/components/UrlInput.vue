<template>
  <div class="url-input">
    <div class="url-input-line">
      
      <input id="url" v-model="url">
      <span class="btn rubbish" @click="rubbish">&#x2716;</span>
    </div>
      <span id="get-button"  :class="{requesting:requesting}"  class="btn" @click="sendUrl"> Get Video Info </span>
  <div>
    <!-- {{debug}} -->
  </div>
  </div>
</template>

<script>

export default {
  name: "url-input",
   props:["requesting"],
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
      },
     
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
  flex-grow: 0;
  color: #dc3545;
  border-color: #dc3545;
  margin-left: 4px;
}
#get-button {
  transition: 1s background-color;  
  padding: 10px;
}
.requesting {
 
  background-color: #007bff87;
}
</style>
