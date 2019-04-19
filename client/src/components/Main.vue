<template>
  <div class="main">
   <url-input @send-url="receiveUrl"></url-input>
   <div>
       {{info}}
   </div>
  </div>
</template>

<script>
import Service from '@/services/service'

import UrlInput from './UrlInput.vue';
export default {
  name: 'Main',
  data () {
    return {
        info:{}
    }
  },
  methods:{
      async receiveUrl(url){
          console.log("REceived",url)
          let result=await Service.getInfo(url.replace(/^.*watch?v=(.*)$/,'$1'));
          console.log(result);
          this.info=result.data;
      }
  },
  components :{
      'url-input':UrlInput,
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
