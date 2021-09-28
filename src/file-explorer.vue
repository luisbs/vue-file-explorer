<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from "vue"
import { Folder } from "vue-file-explorer"

export default /*#__PURE__*/ defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "action", "preUpdate", "postUpdate"],
  props: {
    layout: {
      type: String,
      default: "table",
      validator: (v: string) => ["cards", "table"].includes(v),
    },
    /** Defines wich prop would be used to extract the title/name of a folder/file */
    title: { type: String, default: "title" },
    /** Classes to be added to cards wrapper */
    cards: String,
    /** Classes to be added to the table */
    table: String,
  },
  setup(props, { emit }) {
    const _layout = ref<string>(props.layout as "table")
    const Tree = ref(new Map<number | string, Folder>())
    const folderId = ref<string | number>(0)

    const appendToTree = (news: Map<number | string, Folder>) => news.forEach((v, k) => Tree.value.set(String(k), v))

    emit("initialLoad", appendToTree)
    folderId.value = Array.from(Tree.value.keys()).shift() || 0

    const attach = <T extends HTMLElement = HTMLElement>(selector: string, listener: (event: Event, element: T) => void) =>
      document.querySelectorAll<T>(`.vfe ${selector}`).forEach(el => (el.onclick = ev => listener(ev, el)))

    const attachListeners = (layout: string = "table") => {
      emit("postUpdate", layout)

      attach("button[data-open]", (_, el) => {
        const id = el.dataset.open || 0
        emit("folderLoad", id, appendToTree, Tree.value.has(id), () => (folderId.value = id))
      })

      attach(".vfe-folder button[data-action]", (_, el) =>
        emit("action", { type: "folder", action: el.dataset.action || "unknown", elementId: el.dataset.element || 0 })
      )
      attach(".vfe-file button[data-action]", (_, el) =>
        emit("action", { type: "file", action: el.dataset.action || "unknown", elementId: el.dataset.element || 0 })
      )
    }

    watch([_layout, folderId], ([l]) => emit("preUpdate", l), { flush: "pre" })
    watch([_layout, folderId], ([l]) => attachListeners((l as unknown) as string), { flush: "post" })

    onMounted(() => {
      attach("button[data-layout]", (_, el) => (_layout.value = el.dataset.layout || "table"))
      attachListeners()
    })

    return {
      tree: Tree,
      layoutType: _layout,
      folderId,

      folders: computed(() => Tree.value.get(folderId.value)?.folders || []),
      files: computed(() => Tree.value.get(folderId.value)?.files || []),
      path: computed(() => {
        const path: Array<[string | number, string, ("root" | "current")?]> = []

        // * Current folder
        const dt = Tree.value.get(folderId.value)
        path.push([folderId.value, String(dt?.[props.title as keyof Folder]), "current"])

        // * Path
        if (dt?.parentId) {
          let id: string | null = String(dt.parentId) ?? null
          do {
            const dt = Tree.value.get(id)
            if (dt) {
              if (!dt.parentId) {
                path.unshift([id, String(dt?.[props.title as keyof Folder]), "root"])
                id = null
              } else {
                path.unshift([id, String(dt?.[props.title as keyof Folder])])
                id = dt.parentId
              }
            }
          } while (id !== null)
        }
        return path
      }),
    }
  },
})
</script>

<template>
  <div class="vfe vue-file-explorer">
    <div class="vfe-bar">
      <div class="vfe-path">
        <slot name="folder-path" :path="path">
          <template v-for="([id, title, condition], i) in path" :key="i">
            <span v-if="condition === 'current'">{{ title }}</span>
            <button v-else type="button" :data-open="id">{{ title }}</button>
          </template>
        </slot>
      </div>
      <div class="vfe-layout">
        <slot name="layout-selector">
          <button type="button" data-layout="cards">Cards Layout</button>
          <button type="button" data-layout="table">Table Layout</button>
        </slot>
      </div>
    </div>

    <div class="vfe-content">
      <div v-if="layoutType === 'cards'" class="vfe-cards" :class="cards">
        <slot name="cards-folders" :folders="folders" :tree="tree">
          <div v-for="(f, i) in folders" :key="i" class="vfe-folder">
            <slot name="cards-folder" :id="f.id" :data="f" :tree="tree">
              <button type="butten" :data-open="f.id">{{ f.id }}</button>
            </slot>
          </div>
        </slot>
        <slot name="cards-files" :files="files">
          <div v-for="(f, i) in files" :key="i" class="vfe-file">
            <slot name="cards-file" :id="f.id" :data="f">
              <span>{{ f.id }}</span>
            </slot>
          </div>
        </slot>
      </div>

      <table v-else class="vfe-table" :class="table">
        <thead class="vfe-header">
          <slot name="table-header">
            <tr>
              <th>Id</th>
              <th>Actions</th>
            </tr>
          </slot>
        </thead>

        <tbody class="vfe-content">
          <slot name="table-folders" :folders="folders" :tree="tree">
            <tr v-for="f in folders" :key="f.id" class="vfe-folder">
              <slot name="table-folder" :id="f.id" :data="f" :tree="tree">
                <td>{{ f.id }}</td>
                <td class="vfe-actions">
                  <label :for="`id-${f.id}`">Actions</label>
                  <input type="checkbox" :id="`id-${f.id}`" />
                  <div class="vfe-menu">
                    <button type="button" :data-open="f.id">Abrir</button>
                    <button type="button" data-action="rename" :data-element="f.id">Renombrar</button>
                    <button type="button" data-action="delete" :data-element="f.id">Eliminar</button>
                  </div>
                </td>
              </slot>
            </tr>
          </slot>

          <slot name="table-files" :files="files">
            <tr v-for="f in files" :key="f.id" class="vfe-file">
              <slot name="table-file" :id="f.id" :data="f">
                <td>{{ f.id }}</td>
                <td class="vfe-actions">
                  <label :for="`id-${f.id}`">Actions</label>
                  <input type="checkbox" :id="`id-${f.id}`" />
                  <div class="vfe-menu">
                    <button type="button" data-action="open" :data-element="f.id">Abrir</button>
                    <button type="button" data-action="rename" :data-element="f.id">Renombrar</button>
                    <button type="button" data-action="delete" :data-element="f.id">Eliminar</button>
                  </div>
                </td>
              </slot>
            </tr>
          </slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.vue-file-explorer {
  display: flex;
  flex-direction: column;
}

.vfe-bar {
  display: flex;
  justify-content: space-between;
}
/* .vfe-path */
/* .vfe-layout */

/* .vfe-content */
/* .vfe-cards */

.vfe-table {
  width: 100%;
}
/* .vfe-table > * */

/* .vfe-header */
/* .vfe-folder */
/* .vfe-file */

.vfe-actions {
  position: relative;
}
.vfe-actions > label {
  user-select: none;
}
.vfe-actions > input[type="checkbox"] {
  display: none;
}

.vfe-actions .vfe-menu {
  z-index: -1;
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  height: 0;
  width: 0;
}

.vfe-actions > input:checked + .vfe-menu {
  z-index: 1;
  height: auto;
  width: auto;
  opacity: 1;
}
</style>
