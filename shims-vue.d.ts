declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}


declare module "click-outside-vue3" {
  import type { Plugin, Directive } from "vue"

  const clickOutside: Plugin
  const directive: Directive

  export default clickOutside
  export { directive }
}
