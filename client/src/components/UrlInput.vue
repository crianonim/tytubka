<template>
  <div class="url-input">
    <div class="url-input-line">
      <input @input="urlChanged" v-model="url">
      <button @click="sendUrl" :disabled="disabled">Get</button>
    </div>
    <div class="message">
        {{message}}    
    </div>
  </div>
</template>

<script>
import Service from '@/services/service'
export default {
  name: "url-input",
  data() {
    return {
      url: "",
      message:"ZObaczny",
      disabled:true
    };
  },
  methods:{
      async urlChanged(e){
        this.message=this.url;
        try {
            this.message=(await Service.getHeadersStatus(this.url)).data;     
            this.disabled=false;    
        } 
        catch (err){
            this.message=err.message;
            this.disabled=true;
        }
      },
      sendUrl(){
          console.log("Will send",this.url)
          this.$emit('send-url',this.url)
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
