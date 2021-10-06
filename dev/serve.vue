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
      onAction: (...args: any[]) => console.log(...args),
      folderLoad: async (id: string, append: (news: Map<number | string, Folder>) => void, isCached: boolean, update: () => void) => {
        if (!isCached) {
          await fetch(`#${id}`)
          append(new Map())
        }
        update()
      },
      initialLoad: (append: (n: Record<string, Folder<Record<"title", string>>>, id: string) => void) =>
        append(
          {
            "0": {
              title: "root",
              folders: [{ id: "1", title: "Primero" }],
              files: [
                { id: "a", title: "A" },
                { id: "b", title: "B" },
              ],
            },
            "1": {
              title: "Sub Carpeta",
              parentId: "0",
              folders: [{ id: "2", title: "Tercero" }],
              files: [],
            },
            "2": {
              title: "Sub Sub Carpeta",
              parentId: "1",
              folders: [],
              files: [],
            },
          },
          "0"
        ),
    }
  },
})
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

  <div id="app">
    <file-explorer @initialLoad="initialLoad" @folderLoad="folderLoad" @action="onAction"></file-explorer>
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
