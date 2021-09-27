import { DefineComponent, Plugin } from "vue"

declare const ContextMenu: DefineComponent<{}, {}, any> & { install: Exclude<Plugin["install"], undefined> }
export default ContextMenu

export interface Folder {
  parentId?: string | null
  title: string
  folders: Array<{ id: string; title: string }>
  files: Array<{ id: string; title: string }>
}
