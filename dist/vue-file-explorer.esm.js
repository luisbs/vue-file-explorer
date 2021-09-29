import { defineComponent, ref, onMounted, computed, openBlock, createBlock, createVNode, renderSlot, Fragment, renderList, toDisplayString } from 'vue';

var script = /*#__PURE__*/defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "action", "preUpdate", "postUpdate"],
  props: {
    layout: {
      type: String,
      default: "table",
      validator: v => ["cards", "table"].includes(v)
    },

    /** Defines wich prop would be used to extract the title/name of a folder/file */
    title: {
      type: String,
      default: "title"
    },

    /** Classes to be added to cards wrapper */
    cards: String,

    /** Classes to be added to the table */
    table: String
  },

  setup(props, {
    emit
  }) {
    const _layout = ref(props.layout);

    const _tree = ref(new Map());

    const folderId = ref("0");

    const appendToTree = news => {
      console.log("appending", news);

      if (Array.isArray(news)) {
        if (typeof news[0] === "string") {
          console.log(`adding by simple Array '${news[0]}' - ${String(news[0])}`, news[1]);
          if (news[0] != "8") _tree.value.set(String(news[0]), news[1]); // _tree.value.set(String(news[0]), news[1] as Folder)
          // } else (news as Array<[string, Folder]>).forEach(([k, v]) => console.log(`adding by Array '${k}' - ${String(k)}`, v))
        } else news.forEach(([k, v]) => _tree.value.set(String(k), v)); // } else news.forEach((v, k) => console.log(`adding by simple Array '${k}' - ${String(k)}`, v))

      } else news.forEach((v, k) => _tree.value.set(String(k), v));
    };

    emit("initialLoad", news => {
      appendToTree(news);
      folderId.value = String(Array.from(_tree.value.keys()).shift() || "0");
    }); // watch([_layout, folderId], () => emit("preUpdate"))
    // watch([_layout, folderId], () => emit("postUpdate"), { flush: "post" })

    onMounted(() => {
      const wrapper = document.querySelector(".vfe");

      if (wrapper) {
        wrapper.onclick = ev => {
          try {
            // @ts-expect-error
            for (const el of (_ref = (_ev$composedPath = ev.composedPath()) !== null && _ev$composedPath !== void 0 ? _ev$composedPath : (_event = event) === null || _event === void 0 ? void 0 : _event.path) !== null && _ref !== void 0 ? _ref : [(_event$target = (_event2 = event) === null || _event2 === void 0 ? void 0 : _event2.target) !== null && _event$target !== void 0 ? _event$target : (_event3 = event) === null || _event3 === void 0 ? void 0 : _event3.currentTarget]) {
              var _ref, _ev$composedPath, _event, _event$target, _event2, _event3, _dataset;

              if (el === wrapper) break;
              const set = (_dataset = el === null || el === void 0 ? void 0 : el.dataset) !== null && _dataset !== void 0 ? _dataset : {}; // * data-open="folderId"

              if ("open" in set) {
                const id = set.open || "0";
                emit("folderLoad", id, appendToTree, _tree.value.has(id), () => folderId.value = id);
              } // * data-layout="table|cards"
              else if ("layout" in set) _layout.value = set.layout || "table"; // * data-action="<user-defained-action>" data-folder="folderId"
                else if ("action" in set && "folder" in set) emit("action", {
                    type: "folder",
                    action: set.action || "unknown",
                    elementId: set.folder || "0"
                  }); // * data-action="<user-defained-action>" data-file="fileId"
                  else if ("action" in set && "file" in set) emit("action", {
                      type: "file",
                      action: set.action || "unknown",
                      elementId: set.file || "0"
                    });
            }
          } catch (error) {}
        };
      }
    });
    return {
      tree: {},
      // tree: _tree,
      layoutType: _layout,
      folderId,
      // folders: computed(() => _tree.value.get(folderId.value)?.folders || []),
      folders: computed(() => {
        var _tree$value$get;

        const f = _tree.value.get(folderId.value);

        console.log(folderId.value, f, f === null || f === void 0 ? void 0 : f.folders);
        return ((_tree$value$get = _tree.value.get(folderId.value)) === null || _tree$value$get === void 0 ? void 0 : _tree$value$get.folders) || [];
      }),
      files: computed(() => {
        var _tree$value$get2;

        return ((_tree$value$get2 = _tree.value.get(folderId.value)) === null || _tree$value$get2 === void 0 ? void 0 : _tree$value$get2.files) || [];
      }),
      path: computed(() => {
        const path = []; // * Current folder

        const dt = _tree.value.get(folderId.value);

        path.push([folderId.value, String(dt === null || dt === void 0 ? void 0 : dt[props.title]), "current"]); // * Path

        if (dt !== null && dt !== void 0 && dt.parentId) {
          var _String;

          let id = (_String = String(dt.parentId)) !== null && _String !== void 0 ? _String : null;

          do {
            const dt = _tree.value.get(id);

            if (dt) {
              if (!dt.parentId) {
                path.unshift([id, String(dt === null || dt === void 0 ? void 0 : dt[props.title]), "root"]);
                id = null;
              } else {
                path.unshift([id, String(dt === null || dt === void 0 ? void 0 : dt[props.title])]);
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
  "data-layout": "table"
}, "Table Layout", -1);

const _hoisted_8 = {
  class: "vfe-content"
};
const _hoisted_9 = {
  class: "vfe-header"
};

const _hoisted_10 = /*#__PURE__*/createVNode("tr", null, [/*#__PURE__*/createVNode("th", null, "Id"), /*#__PURE__*/createVNode("th", null, "Actions")], -1);

const _hoisted_11 = {
  class: "vfe-content"
};
const _hoisted_12 = {
  class: "vfe-actions"
};
const _hoisted_13 = {
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
  }), 128))])]), createVNode("div", _hoisted_5, [renderSlot(_ctx.$slots, "layout-selector", {}, () => [_hoisted_6, _hoisted_7])])]), createVNode("div", _hoisted_8, [_ctx.layoutType === 'cards' ? (openBlock(), createBlock("div", {
    key: 0,
    class: ["vfe-cards", _ctx.cards]
  }, null, 2)) : (openBlock(), createBlock("table", {
    key: 1,
    class: ["vfe-table", _ctx.table]
  }, [createVNode("thead", _hoisted_9, [renderSlot(_ctx.$slots, "table-header", {}, () => [_hoisted_10])]), createVNode("tbody", _hoisted_11, [renderSlot(_ctx.$slots, "table-folders", {
    folders: _ctx.folders,
    tree: _ctx.tree
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.folders, f => {
    return openBlock(), createBlock("tr", {
      key: f.id,
      class: "vfe-folder"
    }, [renderSlot(_ctx.$slots, "table-folder", {
      id: f.id,
      data: f,
      tree: _ctx.tree
    }, () => [createVNode("td", null, toDisplayString(f.id), 1), createVNode("td", _hoisted_12, [createVNode("label", {
      for: `id-${f.id}`
    }, "Actions", 8, ["for"]), createVNode("input", {
      type: "checkbox",
      id: `id-${f.id}`
    }, null, 8, ["id"]), createVNode("div", _hoisted_13, [createVNode("button", {
      type: "button",
      "data-open": f.id
    }, "Abrir", 8, ["data-open"]), createVNode("button", {
      type: "button",
      "data-action": "rename",
      "data-folder": f.id
    }, "Renombrar", 8, ["data-folder"]), createVNode("button", {
      type: "button",
      "data-action": "delete",
      "data-folder": f.id
    }, "Eliminar", 8, ["data-folder"])])])])]);
  }), 128))])])], 2))])]);
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

var css_248z = "\n.vue-file-explorer {\n  display: flex;\n  flex-direction: column;\n}\n.vfe-bar {\n  display: flex;\n  justify-content: space-between;\n}\n/* .vfe-path */\n/* .vfe-layout */\n\n/* .vfe-content */\n/* .vfe-cards */\n.vfe-table {\n  width: 100%;\n}\n/* .vfe-table > * */\n\n/* .vfe-header */\n/* .vfe-folder */\n/* .vfe-file */\n.vfe-actions {\n  position: relative;\n}\n.vfe-actions > label {\n  user-select: none;\n}\n.vfe-actions > input[type=\"checkbox\"] {\n  display: none;\n}\n.vfe-actions .vfe-menu {\n  z-index: -1;\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  opacity: 0;\n  height: 0;\n  width: 0;\n}\n.vfe-actions > input:checked + .vfe-menu {\n  z-index: 1;\n  height: auto;\n  width: auto;\n  opacity: 1;\n}\n";
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
