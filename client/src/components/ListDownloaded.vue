<template>
  <div @click="getDownloaded" class="list">
    <!-- {{status}} -->
    <ul>
      <li v-for="(row,ind) in list" :key="ind">
        <!-- {{JSON.stringify(row)}} -->
        <div class="video-item">
           <a :href="url+'/'+row.id">
          <img :src="row.thumbnail_url">
           </a>
          <div class="video-details">
            <a :href="url+'/'+row.id"><span class="title">{{row.title}}</span></a>
            <span class="grower"></span>
            <div class="details-bottom-row">
              <div>
                <div>
                  <a :href="row.video_url">YouTube</a>
                  <span class="length">{{row.length}}</span>
                </div>
                <div class="file-details">
                  <span>{{row.size}}</span>
                  <span>{{row.formatData.Extension}}</span>
                  <span>{{row.formatData.Resolution}}</span>
                </div>
              </div>
              <div class="grower"></div>
              <div @click="deleteVideo(row.id)" class="delete">X</div>
             </a>
            </div>
          </div>
        </div>
      </li>
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
      url:location.origin+location.pathname+'api',
      // status: this.getStatus(),
    };
  },
  methods: {
    getDownloaded() {
      Service.getDownloaded().then(response => {
        this.list = response.data;
      });
    },
    getStatus() {
      Service.getStatus().then(response => {
        this.status = response.data;
        this.getStatus();
      });
    },
    async deleteVideo(id){
      console.log("DELETE VIDEO",id)
      await Service.deleteVideo(id);
      this.list=this.getDownloaded();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.video-item {
  display: flex;
}
.video-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  margin-left: 3px;
  font-size: 0.8em;
}
.title {
  font-size: 0.9rem;
  font-weight: bold;
}
.details-bottom-row {
  display: flex;
  width:100%;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}
li {
  display: inline-block;
  margin: 10px 0px;
  text-align: left;
  background-color: beige;
}
a {
  color: #007bff;
}
.grower {
  flex-grow: 1;
}
.delete {
  background-color:#dc3545;
  color:white;
  border-radius: 1em;
  display:flex; 
  height:2em;
  width: 2em;
  align-items: center;
  justify-content: center;
}
</style>
