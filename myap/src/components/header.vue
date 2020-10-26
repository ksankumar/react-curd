<template>
  <v-app-bar
    absolute
    color="primary"
    dark
  >
    <v-app-bar-nav-icon>
        <v-img
          alt="Vuetify Logo"
          class="shrink white--text"
          color="white"
          contain
          src="@/assets/img.png"
          transition="scale-transition"
          width="50"
        />
    </v-app-bar-nav-icon>
    <v-toolbar-title>Formater</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
export default {
  name: 'key-header',
  data: () => ({})
}
</script>
