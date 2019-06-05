<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
     <nav>
      <router-link :class="{selected:route=='Main'}" class="btn" to="/">Get</router-link>
      <router-link :class="{selected:route=='Downloaded'}" class="btn" to="Downloaded">Stored</router-link>

      </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed:{
    route(){
      return this.$route.name
    }
  },
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 30px; */
  max-width: 800px;
  margin: auto;

}
a {
  color: inherit;
  text-decoration: none;
}
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
.btn {
  padding: 10px;
  border: 1px solid #007bff;
  color:#007bff;
  border-radius: 4px;
  display: inline-block;
  flex-grow: 1;
  margin-right: 12px;
  text-align: center;
}
.btn:last-of-type {
  margin-right: 0;
}
.selected {
  background-color: #007bff;
  color:white;
}
nav {
  width:100%;
  display:flex;
  }
</style>
