<template>
  <div @click="getDownloaded" class="list">
    To jest lista
    {{status}}
    <ul>
      <li v-for="(row,ind) in list" :key="ind">{{row.title}}</li>
    </ul>
  </div>
</template>

<script>
import Service from "@/services/service";

export default {
  name: "ListDownloaded",
  data() {
    return {
      msg: "Welcome to Your List",
      list: this.getDownloaded(),
      status: this.getStatus(),
    };
  },
  methods: {
    getDownloaded() {
      Service.getDownloaded().then(response => {
        this.list = response.data;
      });
    },
    getStatus(){
        Service.getStatus().then(response=>{
            this.status=response.data;
            this.getStatus();
        })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
