<template>
  <coral-drawer debug-drawer>
    <p>{{ title }}</p>
    <textarea style="width:100%;height:500px">
      {{ JSON.stringify(data, null, 4) }}
    </textarea>
  </coral-drawer>
</template>

<script>
  import Vue from "vue";
  export default Vue.extend({
    name: "DebugDrawer",
    props: ["data", "title"]
  });
</script>

<style scoped>
  coral-drawer {
    padding: 0;
  }
</style>
<style>
  [debug-drawer] [handle="toggleButton"] {
    margin-left: -23px;
  }
</style>
