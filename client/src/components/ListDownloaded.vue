<template>
  <!-- <div @click="getDownloaded" class="list">
    <div v-if="status && status.length" id="downloading">
      <h3>Downloading</h3>
      <ul>
        <li v-for="(row,ind) in status" :key="ind">
          <div>
            <span>{{row.downloadedPercent}} % of {{row.size}} {{row.title}}</span>
          </div>
        </li>
      </ul>
  </div>-->
  <div>
    <ul v-if="profile">
      <li v-for="(row,ind) in getStatus().concat(list)" :key="ind">
        <div class="video-item">
          <a class="image-link" v-if="!row.downloading" :href="url+'/'+row.user+'/'+row.id+'?id_token='+token ">
            <img :src="row.thumbnail_url" />
          </a>
          <div class="video-details">
            <a :href="url+'/'+row.user+'/'+row.id+'?id_token='+token ">
              <span class="title">{{row.title}}</span>
            </a>
            <span class="grower"></span>
            <div class="details-bottom-row">
              <div>
                <div>
                  <a :href="row.video_url">YouTube</a>
                  <span v-if="!row.downloading" class="length">{{row.length}}</span>
                </div>
                <div class="file-details">
                  <span v-if="row.downloading">{{row.downloadedPercent}} % of </span>
                  <span>{{row.size}}</span>
                  <span v-if="!row.downloading">{{row.formatData.Extension}}</span>
                  <span v-if="!row.downloading">{{row.formatData.Resolution}}</span>

                </div>
              </div>
              <div class="grower"></div>
              <div @click="deleteVideo(row.id)" class="delete">X</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="!profile">
      You need to be logged in.
    </div>
  </div>
</template>

<script>
import Service from "@/services/service";

export default {
  name: "ListDownloaded",
  props:[],
  data() {
    return {
      msg: "Welcome to Your List",
      profile: null,
      token: window.id_token,
      list: [],
      status: this.getStatus(),
      url: location.origin + location.pathname + "api"

      // status: this.getStatus(),
    };
  },computed:{
   
  },
  methods: {
    getDownloaded() {
      Service.getDownloaded().then(response => {
        this.list = response.data;
        console.log("getDownloaded");
      });
    },
    getStatus() {
      return [
        {
          downloading:true,
          title: "7 NAWYKÓW SKUTECZNEGO DZIAŁANIA Stephen Covey",
          id: "1556865227713",
          downloadedPercent: (Math.random() * 100) >> 0,
          size: "72 MB",
          thumbnail_url: "https://i.ytimg.com/vi/QwC3g6GnPvE/default.jpg"
        },
        {
          downloading:true,
          title: "7 NAWYKÓW SKUTECZNEGO DZIAŁANIA Stephen Covey",
          id: "1556865227713",
          downloadedPercent: 30,
          size: "23.3 MB",
          thumbnail_url: "https://i.ytimg.com/vi/QwC3g6GnPvE/default.jpg"
        }
      ];
    },
    async deleteVideo(id) {
      console.log("DELETE VIDEO", id);
      await Service.deleteVideo(id);
      this.list = this.getDownloaded();
    }
  },
  
  mounted() {
    console.log("ListDownloaded mounted");
  },
  created() {
    console.log("ListDownloaded created");
    if (window.guser) {
      console.log("ListDownloaded has user")
      this.profile = window.guser;
      this.token=window.id_token;
      this.list = this.getDownloaded();
    } else {
      window.guserListeners.push(profile => {
        console.log("ListDownloaded gets profile", profile, this);
        this.profile = profile;
      this.token=window.id_token;

        this.list = this.getDownloaded();
      });
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
  width: 100%;
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
  background-color: #dc3545;
  color: white;
  border-radius: 1em;
  display: flex;
  height: 2em;
  width: 2em;
  align-items: center;
  justify-content: center;
}
.image-link {
  height: 94px;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 120px;
  flex-shrink: 0;
}
.image-link img {
  width: 100%;
}
</style>
