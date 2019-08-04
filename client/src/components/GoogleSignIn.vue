<template>
  <div>
    <div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
    <a href="#" onclick="signOut();">Sign out</a>
    <p>{{profile}}</p>
  </div>
</template>

<script>
    
export default {
  data(){
      return {
        profile:null
      }
  },
  methods: {
      

  },
  mounted(){
      console.log("Mounted");
      console.log(window.guser);
      console.log(window.gauth);
      
  },
  created() {
    console.log("GA created");
    if (window.guser) {
      this.profile = window.guser;
    } else {
      window.guserListeners.push(profile => {
        console.log("Ga", profile, this);
        this.profile = profile;
      });
    }
  }
};

</script>

<style>
</style>
