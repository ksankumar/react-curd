<template>
    <v-col key="right" cols="5" class="full-height">
        <v-card outlined height="100%" v-html="output">
            Column
        </v-card>
    </v-col>
</template>
<script>
export default {
  name: 'right-pane',
  data: () => ({}),
  props: {
    output: String
  }
}
</script>
