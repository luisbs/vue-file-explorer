import { DefineComponent, Plugin } from "vue"

declare const ContextMenu: DefineComponent<{}, {}, any> & { install: Exclude<Plugin["install"], undefined> }
export default ContextMenu

export type Folder<T = {}> = Partial<T> & {
  parentId?: string | null
  folders: Array<{ id: string } & T>
  files: Array<{ id: string } & T>
}
