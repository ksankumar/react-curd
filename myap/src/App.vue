<template>
  <v-app>
    <Header />
    <v-content>
      <v-container class="fill-height full-width">
        <v-row
          no-gutters
          style="padding:64px 0 0 0;"
          transition="slide-x-transition"
        >
          <v-col
            key="left"
            cols="5"
          >
            <v-textarea
              outlined
              clearable
              color="red"
              clear-icon="close-circle"
              name="json-string"
              :height="$vuetify.breakpoint.height - 160"
              label="{Paster your JSON}"
              v-model.trim="jsonString"
              :rules="[() => !!jsonString || 'JSON string is required']"
            ></v-textarea>
          </v-col>
          <v-col
            cols="2"
            class="pa-3 full-height"
          >
            <v-row class="align-center justify-center fill-height">
              <v-col>
                <v-row
                  justify="space-around"
                  class="align-center justify-center"
                >
                  <v-radio-group
                    v-model="formatTo"
                    mandatory
                    row
                  >
                    <template v-for="(item, index) of formatBy">
                      <v-radio
                        :key="index"
                        :label="item"
                        :value="index"
                      ></v-radio>
                    </template>
                  </v-radio-group>
                </v-row>
                <v-fade-transition
                  group
                  class="absolute"
                >
                  <v-btn
                    key="one"
                    color="primary"
                    block
                    :disabled="jsonString === ''"
                    @click="onFormat"
                  >
                    Format<v-icon right>{{ jsonIcon }}</v-icon>
                  </v-btn>
                  <v-btn
                    key="two"
                    v-if="formatTo === 'json'"
                    class="mt-5"
                    block
                    :disabled="jsonString === ''"
                    @click="onMinify"
                  >
                    Minify<v-icon right>{{ minifyIcon }}</v-icon>
                  </v-btn>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            key="right"
            cols="5"
            class="full-height"
          >
            <v-card
              outlined
              height="100%"
              class="jsonview"
              ref="formatedOutput"
            >
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Footer from './components/footer'
import Header from './components/header'
import { mdiCodeJson, mdiArrowCollapseAll } from '@mdi/js'
import formate from './plugins/format'

export default {
  name: 'App',

  components: {
    Header,
    Footer
  },

  data: () => ({
    // jsonString: '{"name":"Sandy"}',
    jsonString:
      '{"glossary":{"title":true,"GlossDiv":{"title":123,"GlossList":{"GlossEntry":{"ID":null,"SortAs":"undefined","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}',
    jsonString1:
      '<tag>tag content</tag><tag2>another content</tag2><tag3><insideTag>inside content</insideTag><emptyTag /></tag3>',
    jsonIcon: mdiCodeJson,
    minifyIcon: mdiArrowCollapseAll,
    outputJSON: '',
    formatBy: { json: 'JSON', xml: 'XML', yaml: 'YAML' },
    formatTo: 'json',
    states: ['JSON', 'XML'],
    e1: 'JSON'
  }),
  created () { },
  methods: {
    onFormat () {
      const jsonStr = this.jsonString
      const element = this.$refs.formatedOutput.$el
      switch (this.formatTo) {
        case 'json':
          formate.StringToJson(element, jsonStr)
          break
        case 'xml':
          formate.JSONtoXML(element, jsonStr)
          break
        case 'yaml':
          formate.JSONtoXML(element, jsonStr)
          break
      }
    },
    onMinify () {
      const jsonStr = this.jsonString
      const element = this.$refs.formatedOutput.$el
      const formatted = formate.XMLtoJSON(element, jsonStr)
      console.log(formatted)
    }
  }
}
</script>

<style>
.full-width {
  min-width: 100%;
}
.jsonview {
  font-family: monospace;
  font-size: 1em;
  white-space: pre-wrap;
}
.jsonview .prop {
  font-weight: bold;
  text-decoration: none;
  color: #204a87;
}
.jsonview .null {
  color: #e00b00;
}
.jsonview .undefined {
  color: purple;
}
.jsonview .bool {
  color: #eb8a01;
}
.jsonview .num {
  color: #0022d5;
}
.jsonview .string {
  color: #00a000;
  white-space: pre-wrap;
}
.jsonview .string.multiline {
  display: inline-block;
  vertical-align: text-top;
}
.jsonview .collapser {
  position: absolute;
  left: -1em;
  top: 5px;
  font-size: 18px;
  cursor: pointer;
}
.jsonview .collapsible {
  transition: height 1.2s;
  transition: width 1.2s;
}
.jsonview .collapsible.collapsed {
  height: 0.8em;
  width: 1em;
  display: inline-block;
  overflow: hidden;
  margin: 0;
}
.jsonview .collapsible.collapsed:before {
  content: "…";
  width: 1em;
  margin-left: 0.2em;
}
.jsonview .collapser.collapsed {
  transform: rotate(0deg);
}
.jsonview .q {
  display: inline-block;
  width: 0px;
  color: transparent;
}
.jsonview li {
  position: relative;
}
.jsonview ul {
  list-style: none;
  margin: 0 0 0 2em;
  padding: 0 !important;
}
.jsonview h1 {
  font-size: 1.2em;
}
.highlight {
  background-color: red;
}
pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
/* ae81ff */
</style>
