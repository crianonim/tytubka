<template>
  <div class="flex-container">
    <div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
    <p v-if="profile">{{profile.ig}}</p>
    <img v-if="profile" class="avatar" :src="profile.Paa" />
    <a v-if="profile" class="abcRioButtonBlue signout" href="#" onclick="signOut();">Sign out</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: null
    };
  },
  methods: {},
  mounted() {
    // console.log("GA Mounted");
    // console.log(window.guser);
    // console.log(window.gauth);
  },
  created() {
    // console.log("GA created");
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
.g-signin2 {
  margin: 0 1rem;
}
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}
.signout {
  font-size: 13px;
  flex-grow: 0;
  margin: 0 1rem;
  padding: 10px;
}
img.avatar {
  width: 2rem;
  border-radius: 1rem;
  margin: 0 1rem;
}
</style>
