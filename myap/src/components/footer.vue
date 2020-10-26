<template>
  <v-footer color="primary padless" app>
    <v-row class="align-center justify-center" cols="12" tile>
      <div class="white--text">
        {{ new Date().getFullYear() }} —
        <strong>Beautify</strong>
      </div>
    </v-row>
  </v-footer>
</template>
<script>
export default {
  name: 'key-footer',
  data: () => ({})
}
</script>
