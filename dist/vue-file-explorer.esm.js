import { defineComponent, ref, watch, onMounted, computed, openBlock, createBlock, createVNode, renderSlot, Fragment, renderList, toDisplayString } from 'vue';

var script = /*#__PURE__*/defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "event"],
  props: {
    layout: {
      type: String,
      default: "cards",
      validator: v => ["details", "cards"].includes(v)
    },
    render: Function
  },

  setup(props, {
    emit
  }) {
    const _layout = ref(props.layout);

    const Tree = ref(new Map());
    const folderId = ref(0);

    const appendToTree = news => news.forEach((v, k) => Tree.value.set(k, v));

    emit("initialLoad", appendToTree);
    folderId.value = Array.from(Tree.value.keys()).shift() || 0;

    const attach = (selector, listener) => document.querySelectorAll(`.vfe ${selector}`).forEach(el => el.onclick = ev => listener(ev, el));

    const attachListeners = () => {
      attach("button[data-open]", (_, el) => {
        folderId.value = el.dataset.open || 0;
        emit("folderLoad", folderId.value, appendToTree, Tree.value.has(folderId.value));
      });
      attach(".vfe-folder button[data-action]", (_, el) => emit("event", {
        type: "folder",
        event: el.dataset.action || "unknown",
        elementId: el.dataset.element || 0
      }));
      attach(".vfe-file button[data-action]", (_, el) => emit("event", {
        type: "file",
        event: el.dataset.action || "unknown",
        elementId: el.dataset.element || 0
      }));
    };

    watch(folderId, attachListeners, {
      flush: "post"
    });
    onMounted(() => {
      attach("button[data-layout]", (_, el) => _layout.value = el.dataset.layout || "details");
      attachListeners();
    });
    return {
      tree: Tree,
      layoutType: _layout,
      folderId,
      folders: computed(() => {
        var _Tree$value$get;

        return ((_Tree$value$get = Tree.value.get(folderId.value)) === null || _Tree$value$get === void 0 ? void 0 : _Tree$value$get.folders) || [];
      }),
      files: computed(() => {
        var _Tree$value$get2;

        return ((_Tree$value$get2 = Tree.value.get(folderId.value)) === null || _Tree$value$get2 === void 0 ? void 0 : _Tree$value$get2.files) || [];
      }),
      path: computed(() => {
        const path = []; // * Current folder

        const dt = Tree.value.get(folderId.value) || {};
        path.push([folderId.value, dt.title, "current"]); // * Path

        if (dt.parentId) {
          var _dt$parentId;

          let id = (_dt$parentId = dt.parentId) !== null && _dt$parentId !== void 0 ? _dt$parentId : null;

          do {
            const dt = Tree.value.get(id);

            if (dt) {
              if (!dt.parentId) {
                path.unshift([id, dt.title, "root"]);
                id = null;
              } else {
                path.unshift([id, dt.title]);
                id = dt.parentId;
              }
            }
          } while (id !== null);
        }

        return path;
      })
    };
  }

});

const _hoisted_1 = {
  class: "vfe vue-file-explorer"
};
const _hoisted_2 = {
  class: "vfe-bar"
};
const _hoisted_3 = {
  class: "vfe-path"
};
const _hoisted_4 = {
  key: 0
};
const _hoisted_5 = {
  class: "vfe-layout"
};

const _hoisted_6 = /*#__PURE__*/createVNode("button", {
  type: "button",
  "data-layout": "cards"
}, "Cards Layout", -1);

const _hoisted_7 = /*#__PURE__*/createVNode("button", {
  type: "button",
  "data-layout": "details"
}, "Details Layout", -1);

const _hoisted_8 = {
  class: "vfe-content"
};
const _hoisted_9 = {
  key: 0,
  class: "vfe-cards"
};
const _hoisted_10 = {
  key: 1,
  class: "vfe-details"
};

const _hoisted_11 = /*#__PURE__*/createVNode("li", {
  class: "vfe-header"
}, [/*#__PURE__*/createVNode("span", null, "Id"), /*#__PURE__*/createVNode("span", null, "Name"), /*#__PURE__*/createVNode("span", null, "Actions")], -1);

const _hoisted_12 = {
  class: "vfe-actions"
};
const _hoisted_13 = {
  class: "vfe-menu"
};
const _hoisted_14 = {
  class: "vfe-actions"
};
const _hoisted_15 = {
  class: "vfe-menu"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1, [createVNode("div", _hoisted_2, [createVNode("div", _hoisted_3, [renderSlot(_ctx.$slots, "folder-path", {
    path: _ctx.path
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.path, ([id, title, condition], i) => {
    return openBlock(), createBlock(Fragment, {
      key: i
    }, [condition === 'current' ? (openBlock(), createBlock("span", _hoisted_4, toDisplayString(title), 1)) : (openBlock(), createBlock("button", {
      key: 1,
      type: "button",
      "data-open": id
    }, toDisplayString(title), 9, ["data-open"]))], 64);
  }), 128))])]), createVNode("div", null, toDisplayString(_ctx.folderId), 1), createVNode("div", _hoisted_5, [renderSlot(_ctx.$slots, "layout-selector", {}, () => [_hoisted_6, _hoisted_7])])]), createVNode("div", _hoisted_8, [_ctx.layoutType === 'cards' ? (openBlock(), createBlock("div", _hoisted_9, [renderSlot(_ctx.$slots, "cards-folders", {
    folders: _ctx.folders
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.folders, (f, i) => {
    return openBlock(), createBlock("div", {
      key: i,
      class: "vfe-folder"
    }, [renderSlot(_ctx.$slots, "cards-folder", {
      id: f.id,
      title: f.title,
      data: f
    }, () => [createVNode("button", {
      type: "butten",
      "data-open": f.id
    }, toDisplayString(f.id) + " - " + toDisplayString(f.title), 9, ["data-open"])])]);
  }), 128))]), renderSlot(_ctx.$slots, "cards-files", {
    files: _ctx.files
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.files, (f, i) => {
    return openBlock(), createBlock("div", {
      key: i,
      class: "vfe-files"
    }, [renderSlot(_ctx.$slots, "cards-file", {
      id: f.id,
      title: f.title,
      data: f
    }, () => [createVNode("span", null, toDisplayString(f.id) + " - " + toDisplayString(f.title), 1)])]);
  }), 128))])])) : (openBlock(), createBlock("ul", _hoisted_10, [renderSlot(_ctx.$slots, "details-header", {}, () => [_hoisted_11]), renderSlot(_ctx.$slots, "details-folders", {
    folders: _ctx.folders
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.folders, (f, i) => {
    return openBlock(), createBlock("li", {
      key: i,
      class: "vfe-folder"
    }, [renderSlot(_ctx.$slots, "details-folder", {
      id: f.id,
      title: f.title,
      data: f
    }, () => [createVNode("span", null, toDisplayString(f.id), 1), createVNode("span", null, toDisplayString(f.title), 1)]), renderSlot(_ctx.$slots, "folder-actions", {
      id: f.id
    }, () => [createVNode("div", _hoisted_12, [createVNode("label", {
      for: `id-${f.id}`
    }, "Actions", 8, ["for"]), createVNode("input", {
      type: "checkbox",
      id: `id-${f.id}`
    }, null, 8, ["id"]), createVNode("div", _hoisted_13, [renderSlot(_ctx.$slots, "folder-menu", {
      id: f.id
    }, () => [createVNode("button", {
      type: "button",
      "data-open": f.id
    }, "Abrir", 8, ["data-open"]), createVNode("button", {
      type: "button",
      "data-action": "rename",
      "data-element": f.id
    }, "Renombrar", 8, ["data-element"]), createVNode("button", {
      type: "button",
      "data-action": "delete",
      "data-element": f.id
    }, "Eliminar", 8, ["data-element"])])])])])]);
  }), 128))]), renderSlot(_ctx.$slots, "details-files", {
    files: _ctx.files
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.files, (f, i) => {
    return openBlock(), createBlock("li", {
      key: i,
      class: "vfe-file"
    }, [renderSlot(_ctx.$slots, "details-file", {
      id: f.id,
      title: f.title,
      data: f
    }, () => [createVNode("span", null, toDisplayString(f.id), 1), createVNode("span", null, toDisplayString(f.title), 1)]), renderSlot(_ctx.$slots, "file-actions", {
      id: f.id
    }, () => [createVNode("div", _hoisted_14, [createVNode("label", {
      for: `id-${f.id}`
    }, "Actions", 8, ["for"]), createVNode("input", {
      type: "checkbox",
      id: `id-${f.id}`
    }, null, 8, ["id"]), createVNode("div", _hoisted_15, [renderSlot(_ctx.$slots, "file-menu", {
      id: f.id
    }, () => [createVNode("button", {
      type: "button",
      "data-action": "open",
      "data-element": f.id
    }, "Abrir", 8, ["data-element"]), createVNode("button", {
      type: "button",
      "data-action": "rename",
      "data-element": f.id
    }, "Renombrar", 8, ["data-element"]), createVNode("button", {
      type: "button",
      "data-action": "delete",
      "data-element": f.id
    }, "Eliminar", 8, ["data-element"])])])])])]);
  }), 128))])]))])]);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.vue-file-explorer {\n  display: flex;\n  flex-direction: column;\n}\n.vfe-bar {\n  display: flex;\n  justify-content: space-between;\n}\n/* .vfe-path */\n/* .vfe-layout */\n\n/* .vfe-content */\n/* .vfe-cards */\n.vfe-details {\n  display: flex;\n  flex-direction: column;\n}\n.vfe-details > * {\n  display: flex;\n  justify-content: space-between;\n}\n\n/* .vfe-header */\n/* .vfe-folder */\n/* .vfe-file */\n.vfe-actions {\n  position: relative;\n}\n.vfe-menu {\n  z-index: -1;\n  position: absolute;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  opacity: 0;\n  height: 0;\n  width: 0;\n}\n.vfe-actions > label {\n  user-select: none;\n}\n.vfe-actions > input {\n  display: none;\n}\n.vfe-actions > input:checked + .vfe-menu {\n  z-index: 1;\n  height: auto;\n  width: auto;\n  opacity: 1;\n}\n";
styleInject(css_248z);

script.render = render;

// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var entry_esm = /*#__PURE__*/(() => {
  // Assign InstallableComponent type
  const installable = script; // Attach install function executed by Vue.use()

  installable.install = app => {
    app.component("FileExplorer", installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export default entry_esm;
