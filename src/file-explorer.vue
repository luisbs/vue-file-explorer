<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from "vue"
import { Folder } from "vue-file-explorer"

export default /*#__PURE__*/ defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "event"],
  props: {
    layout: {
      type: String,
      default: "cards",
      validator: (v: string) => ["details", "cards"].includes(v),
    },
    render: Function,
  },
  setup(props, { emit }) {
    const _layout = ref<string>(props.layout as "cards")
    const Tree = ref(new Map<number | string, Folder>())
    const folderId = ref<string | number>(0)

    const appendToTree = (news: Map<number | string, Folder>) => news.forEach((v, k) => Tree.value.set(k, v))

    emit("initialLoad", appendToTree)
    folderId.value = Array.from(Tree.value.keys()).shift() || 0

    const attach = <T extends HTMLElement = HTMLElement>(selector: string, listener: (event: Event, element: T) => void) =>
      document.querySelectorAll<T>(`.vfe ${selector}`).forEach(el => (el.onclick = ev => listener(ev, el)))

    const attachListeners = () => {
      attach("button[data-open]", (_, el) => {
        folderId.value = el.dataset.open || 0
        emit("folderLoad", folderId.value, appendToTree, Tree.value.has(folderId.value))
      })

      attach(".vfe-folder button[data-action]", (_, el) =>
        emit("event", { type: "folder", event: el.dataset.action || "unknown", elementId: el.dataset.element || 0 })
      )
      attach(".vfe-file button[data-action]", (_, el) =>
        emit("event", { type: "file", event: el.dataset.action || "unknown", elementId: el.dataset.element || 0 })
      )
    }

    watch(folderId, attachListeners, { flush: "post" })
    onMounted(() => {
      attach("button[data-layout]", (_, el) => (_layout.value = el.dataset.layout || "details"))
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
        const dt = Tree.value.get(folderId.value) || ({} as Folder)
        path.push([folderId.value, dt.title, "current"])

        // * Path
        if (dt.parentId) {
          let id: string | null = dt.parentId ?? null
          do {
            const dt = Tree.value.get(id)
            if (dt) {
              if (!dt.parentId) {
                path.unshift([id, dt.title, "root"])
                id = null
              } else {
                path.unshift([id, dt.title])
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
      <div>{{ folderId }}</div>
      <div class="vfe-layout">
        <slot name="layout-selector">
          <button type="button" data-layout="cards">Cards Layout</button>
          <button type="button" data-layout="details">Details Layout</button>
        </slot>
      </div>
    </div>

    <div class="vfe-content">
      <div v-if="layoutType === 'cards'" class="vfe-cards">
        <slot name="cards-folders" :folders="folders">
          <div v-for="(f, i) in folders" :key="i" class="vfe-folder">
            <slot name="cards-folder" :id="f.id" :title="f.title" :data="f">
              <button type="butten" :data-open="f.id">{{ f.id }} - {{ f.title }}</button>
            </slot>
          </div>
        </slot>
        <slot name="cards-files" :files="files">
          <div v-for="(f, i) in files" :key="i" class="vfe-files">
            <slot name="cards-file" :id="f.id" :title="f.title" :data="f">
              <span>{{ f.id }} - {{ f.title }}</span>
            </slot>
          </div>
        </slot>
      </div>

      <ul v-else class="vfe-details">
        <slot name="details-header">
          <li class="vfe-header">
            <span>Id</span>
            <span>Name</span>
            <span>Actions</span>
          </li>
        </slot>

        <slot name="details-folders" :folders="folders">
          <li v-for="(f, i) in folders" :key="i" class="vfe-folder">
            <slot name="details-folder" :id="f.id" :title="f.title" :data="f">
              <span>{{ f.id }}</span>
              <span>{{ f.title }}</span>
            </slot>
            <slot name="folder-actions" :id="f.id">
              <div class="vfe-actions">
                <label :for="`id-${f.id}`">Actions</label>
                <input type="checkbox" :id="`id-${f.id}`" />
                <div class="vfe-menu">
                  <slot name="folder-menu" :id="f.id">
                    <button type="button" :data-open="f.id">Abrir</button>
                    <button type="button" data-action="rename" :data-element="f.id">Renombrar</button>
                    <button type="button" data-action="delete" :data-element="f.id">Eliminar</button>
                  </slot>
                </div>
              </div>
            </slot>
          </li>
        </slot>

        <slot name="details-files" :files="files">
          <li v-for="(f, i) in files" :key="i" class="vfe-file">
            <slot name="details-file" :id="f.id" :title="f.title" :data="f">
              <span>{{ f.id }}</span>
              <span>{{ f.title }}</span>
            </slot>
            <slot name="file-actions" :id="f.id">
              <div class="vfe-actions">
                <label :for="`id-${f.id}`">Actions</label>
                <input type="checkbox" :id="`id-${f.id}`" />
                <div class="vfe-menu">
                  <slot name="file-menu" :id="f.id">
                    <button type="button" data-action="open" :data-element="f.id">Abrir</button>
                    <button type="button" data-action="rename" :data-element="f.id">Renombrar</button>
                    <button type="button" data-action="delete" :data-element="f.id">Eliminar</button>
                  </slot>
                </div>
              </div>
            </slot>
          </li>
        </slot>
      </ul>
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

.vfe-details {
  display: flex;
  flex-direction: column;
}
.vfe-details > * {
  display: flex;
  justify-content: space-between;
}

/* .vfe-header */
/* .vfe-folder */
/* .vfe-file */

.vfe-actions {
  position: relative;
}

.vfe-menu {
  z-index: -1;
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  height: 0;
  width: 0;
}

.vfe-actions > label {
  user-select: none;
}
.vfe-actions > input {
  display: none;
}

.vfe-actions > input:checked + .vfe-menu {
  z-index: 1;
  height: auto;
  width: auto;
  opacity: 1;
}
</style>
