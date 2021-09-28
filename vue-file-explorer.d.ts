import { DefineComponent, Plugin } from "vue"

declare const ContextMenu: DefineComponent<{}, {}, any> & { install: Exclude<Plugin["install"], undefined> }
export default ContextMenu

export interface Folder {
  parentId?: string | null
  folders: Array<{ id: string }>
  files: Array<{ id: string }>
}
