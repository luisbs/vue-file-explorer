<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch, readonly } from "vue"
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
    const _tree = ref<Record<string, Folder>>({})
    const folderId = ref<string>("0")

    const appendToTree = (news: [string, Folder] | Array<[string, Folder]> | Record<string, Folder>) => {
      if (Array.isArray(news)) {
        if (typeof news[0] === "string") _tree.value[String(news[0])] = news[1] as Folder
        else (news as Array<[string, Folder]>).forEach(([k, v]) => (_tree.value[String(k)] = v))
      } else Object.entries(news).forEach(([k, v]) => (_tree.value[String(k)] = v))
    }

    emit("initialLoad", (news: [string, Folder] | Array<[string, Folder]> | Record<string, Folder>, id: string) => {
      appendToTree(news)
      folderId.value = String(id || "0")
    })

    watch([_layout, folderId], () => emit("preUpdate"))
    watch([_layout, folderId], () => emit("postUpdate"), { flush: "post" })
    onMounted(() => {
      emit("postUpdate")
      const wrapper = document.querySelector<HTMLElement>(".vfe")
      if (wrapper) {
        wrapper.onclick = ev => {
          try {
            // @ts-expect-error
            for (const el of ev.composedPath() ?? event?.path ?? [event?.target ?? event?.currentTarget]) {
              if (el === wrapper) break
              const set = (el as HTMLElement)?.dataset ?? {}
              // * data-open="folderId"
              if ("open" in set) {
                const id = set.open || "0"
                emit("folderLoad", id, appendToTree, id in _tree.value, () => (folderId.value = id))
              }
              // * data-layout="table|cards"
              else if ("layout" in set) _layout.value = set.layout || "table"
              // * data-action="<user-defained-action>" data-folder="folderId"

              const help = { tree: readonly(_tree.value), append: appendToTree, on: folderId.value, action: set.action || "unknown" }
              if ("action" in set && "folder" in set) emit("action", { ...help, folder: set.folder || "0" })
              // * data-action="<user-defained-action>" data-file="fileId"
              else if ("action" in set && "file" in set) emit("action", { ...help, file: set.file || "0" })
              // * data-action="<user-defained-action>"
              else if ("action" in set) emit("action", help)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    })

    return {
      layoutType: _layout,
      folderId,

      tree: computed(() => _tree.value),
      folders: computed(() => _tree.value[folderId.value]?.folders || []),
      files: computed(() => _tree.value[folderId.value]?.files || []),
      path: computed(() => {
        const path: Array<[string | number, string, ("root" | "current")?]> = []

        // * Current folder
        const dt = _tree.value[folderId.value]
        path.push([folderId.value, String(dt?.[props.title as keyof Folder]), "current"])

        // * Path
        if (dt?.parentId) {
          let id: string | null = String(dt.parentId) ?? null
          do {
            const dt = _tree.value[id] as Folder | undefined
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

    <slot name="help-bar"></slot>

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
                  <button type="button" :data-open="f.id">Abrir</button>
                  <button type="button" data-action="rename" :data-folder="f.id">Renombrar</button>
                  <button type="button" data-action="delete" :data-folder="f.id">Eliminar</button>
                </td>
              </slot>
            </tr>
          </slot>

          <slot name="table-files" :files="files">
            <tr v-for="f in files" :key="f.id" class="vfe-file">
              <slot name="table-file" :id="f.id" :data="f">
                <td>{{ f.id }}</td>
                <td class="vfe-actions">
                  <button type="button" data-action="open" :data-file="f.id">Abrir</button>
                  <button type="button" data-action="rename" :data-file="f.id">Renombrar</button>
                  <button type="button" data-action="delete" :data-file="f.id">Eliminar</button>
                </td>
              </slot>
            </tr>
          </slot>
        </tbody>
      </table>
    </div>
  </div>
</template>
