<template>
  <v-col
    key="left"
    cols="5"
  >
    <v-textarea
      outlined
      name="input-7-4"
      :height="$vuetify.breakpoint.height-160"
      label="Outlined textarea"
      value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
    ></v-textarea>
  </v-col>
</template>
<script>
export default {
  name: 'left-pane',
  mounted () {
    console.log(this.$vuetify.breakpoint)
  },
  data: () => ({})
}
</script>
