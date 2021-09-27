<script lang="ts">
import { defineComponent, ref } from "vue"
import { Folder } from "vue-file-explorer"

function unique() {
  return Math.random()
    .toString()
    .slice(2, 5)
}

type ElementsArray = Record<"key" | "value", string>[]

export default defineComponent({
  name: "ServeDev",
  setup() {
    const elements = ref<ElementsArray>([])
    return {
      elements,
      append: () => {
        const key = unique()
        elements.value.push({ key, value: key })
      },
      initialLoad: (append: (n: Map<string, Folder>) => void) =>
        append(
          new Map([
            [
              "0",
              {
                title: "root",
                folders: [{ id: "1", title: "Primero" }],
                files: [
                  { id: "a", title: "A" },
                  { id: "b", title: "B" },
                ],
              },
            ],
            [
              "1",
              {
                title: "Sub Carpeta",
                parentId: "0",
                folders: [{ id: "2", title: "Tercero" }],
                files: [],
              },
            ],
            [
              "2",
              {
                title: "Sub Sub Carpeta",
                parentId: "1",
                folders: [],
                files: [],
              },
            ],
          ])
        ),
    }
  },
})
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

  <div id="app">
    <file-explorer @initialLoad="initialLoad"></file-explorer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
ul {
  list-style: none;
}

#app {
  width: 100vw;
  height: 100vh;
}
.vue-file-explorer {
  gap: 1rem;
  padding: 10rem clamp(1rem, 10%, 10rem);
}
.vfe-bar {
  gap: 1rem;
}
</style>
