<template>
  <div>
    <div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
    <a href="#" onclick="signOut();">Sign out</a>
  </div>
</template>

<script>
    
export default {
  data(){
      return {

      }
  },
  methods: {
      

  },
  mounted(){
      console.log("Mounted");
      console.log(window.guser);
      console.log(window.gauth);
      window.guserProfileReady=function(profile){
          console.log("GOT",profile);
      }
  }
};

</script>

<style>
</style>
