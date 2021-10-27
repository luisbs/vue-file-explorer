import { defineComponent, ref, watch, onMounted, readonly, computed, openBlock, createBlock, createVNode, renderSlot, Fragment, renderList, toDisplayString } from 'vue';

var script = /*#__PURE__*/defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "action", "preUpdate", "postUpdate"],
  props: {
    layout: {
      type: String,
      default: "list",
      validator: v => ["cards", "list", "table"].includes(v)
    },

    /** Defines wich prop would be used to extract the title/name of a folder/file */
    title: {
      type: String,
      default: "title"
    },

    /** Classes to be added to cards wrapper */
    cards: String,

    /** Classes to be added to list */
    list: String,

    /** Classes to be added to the table */
    table: String
  },

  setup(props, {
    emit
  }) {
    const _layout = ref(props.layout);

    const _tree = ref({});

    const folderId = ref("0");

    const appendToTree = news => {
      if (Array.isArray(news)) {
        if (typeof news[0] === "string") _tree.value[String(news[0])] = news[1];else news.forEach(([k, v]) => _tree.value[String(k)] = v);
      } else Object.entries(news).forEach(([k, v]) => _tree.value[String(k)] = v);
    };

    emit("initialLoad", (news, id) => {
      appendToTree(news);
      folderId.value = String(id || "0");
    });
    watch([_layout, folderId], () => emit("preUpdate"));
    watch([_layout, folderId], () => emit("postUpdate"), {
      flush: "post"
    });
    onMounted(() => {
      emit("postUpdate");
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
                emit("folderLoad", id, appendToTree, id in _tree.value, () => folderId.value = id);
              } // * data-layout="cards|list|table"
              else if ("layout" in set) _layout.value = set.layout || "cards"; // * data-action="<user-defained-action>" data-folder="folderId"


              const help = {
                tree: readonly(_tree.value),
                append: appendToTree,
                on: folderId.value,
                action: set.action || "unknown"
              };
              if ("action" in set && "folder" in set) emit("action", { ...help,
                folder: set.folder || "0"
              }); // * data-action="<user-defained-action>" data-file="fileId"
              else if ("action" in set && "file" in set) emit("action", { ...help,
                  file: set.file || "0"
                }); // * data-action="<user-defained-action>"
                else if ("action" in set) emit("action", help);
            }
          } catch (error) {
            console.error(error);
          }
        };
      }
    });
    return {
      layoutType: _layout,
      folderId,
      tree: computed(() => _tree.value),
      folders: computed(() => {
        var _tree$value$folderId$;

        return ((_tree$value$folderId$ = _tree.value[folderId.value]) === null || _tree$value$folderId$ === void 0 ? void 0 : _tree$value$folderId$.folders) || [];
      }),
      files: computed(() => {
        var _tree$value$folderId$2;

        return ((_tree$value$folderId$2 = _tree.value[folderId.value]) === null || _tree$value$folderId$2 === void 0 ? void 0 : _tree$value$folderId$2.files) || [];
      }),
      path: computed(() => {
        const path = []; // * Current folder

        const dt = _tree.value[folderId.value];
        path.push([folderId.value, String(dt === null || dt === void 0 ? void 0 : dt[props.title]), "current"]); // * Path

        if (dt !== null && dt !== void 0 && dt.parentId) {
          var _String;

          let id = (_String = String(dt.parentId)) !== null && _String !== void 0 ? _String : null;

          do {
            const dt = _tree.value[id];

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
  "data-layout": "list"
}, "List Layout", -1);

const _hoisted_8 = /*#__PURE__*/createVNode("button", {
  type: "button",
  "data-layout": "table"
}, "Table Layout", -1);

const _hoisted_9 = {
  class: "vfe-content"
};
const _hoisted_10 = {
  class: "vfe-header"
};

const _hoisted_11 = /*#__PURE__*/createVNode("tr", null, [/*#__PURE__*/createVNode("th", null, "Id"), /*#__PURE__*/createVNode("th", null, "Actions")], -1);

const _hoisted_12 = {
  class: "vfe-content"
};
const _hoisted_13 = {
  class: "vfe-actions"
};
const _hoisted_14 = {
  class: "vfe-actions"
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
  }), 128))])]), createVNode("div", _hoisted_5, [renderSlot(_ctx.$slots, "layout-selector", {}, () => [_hoisted_6, _hoisted_7, _hoisted_8])])]), renderSlot(_ctx.$slots, "help-bar"), createVNode("div", _hoisted_9, [_ctx.layoutType === 'cards' ? (openBlock(), createBlock("div", {
    key: 0,
    class: ["vfe-cards", _ctx.cards]
  }, [renderSlot(_ctx.$slots, "cards-folders", {
    folders: _ctx.folders,
    tree: _ctx.tree
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.folders, (f, i) => {
    return openBlock(), createBlock("div", {
      key: i,
      class: "vfe-folder"
    }, [renderSlot(_ctx.$slots, "cards-folder", {
      id: f.id,
      data: f,
      tree: _ctx.tree
    }, () => [createVNode("button", {
      type: "button",
      "data-open": f.id
    }, toDisplayString(f.id), 9, ["data-open"])])]);
  }), 128))]), renderSlot(_ctx.$slots, "cards-files", {
    files: _ctx.files
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.files, (f, i) => {
    return openBlock(), createBlock("div", {
      key: i,
      class: "vfe-file"
    }, [renderSlot(_ctx.$slots, "cards-file", {
      id: f.id,
      data: f
    }, () => [createVNode("span", null, toDisplayString(f.id), 1)])]);
  }), 128))])], 2)) : _ctx.layoutType === 'list' ? (openBlock(), createBlock("ul", {
    key: 1,
    class: ["vfe-list", _ctx.list]
  }, [renderSlot(_ctx.$slots, "list-folders", {
    folders: _ctx.folders,
    tree: _ctx.tree
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.folders, f => {
    return openBlock(), createBlock("li", {
      key: f.id,
      class: "vfe-folder"
    }, [renderSlot(_ctx.$slots, "list-folder", {
      id: f.id,
      data: f,
      tree: _ctx.tree
    }, () => [createVNode("button", {
      type: "button",
      "data-open": f.id
    }, toDisplayString(f.id), 9, ["data-open"])])]);
  }), 128))]), renderSlot(_ctx.$slots, "list-files", {
    files: _ctx.files
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.files, f => {
    return openBlock(), createBlock("li", {
      key: f.id,
      class: "vfe-file"
    }, [renderSlot(_ctx.$slots, "list-file", {
      id: f.id,
      data: f
    }, () => [createVNode("span", null, toDisplayString(f.id), 1)])]);
  }), 128))])], 2)) : (openBlock(), createBlock("table", {
    key: 2,
    class: ["vfe-table", _ctx.table]
  }, [createVNode("thead", _hoisted_10, [renderSlot(_ctx.$slots, "table-header", {}, () => [_hoisted_11])]), createVNode("tbody", _hoisted_12, [renderSlot(_ctx.$slots, "table-folders", {
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
    }, () => [createVNode("td", null, toDisplayString(f.id), 1), createVNode("td", _hoisted_13, [createVNode("button", {
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
    }, "Eliminar", 8, ["data-folder"])])])]);
  }), 128))]), renderSlot(_ctx.$slots, "table-files", {
    files: _ctx.files
  }, () => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.files, f => {
    return openBlock(), createBlock("tr", {
      key: f.id,
      class: "vfe-file"
    }, [renderSlot(_ctx.$slots, "table-file", {
      id: f.id,
      data: f
    }, () => [createVNode("td", null, toDisplayString(f.id), 1), createVNode("td", _hoisted_14, [createVNode("button", {
      type: "button",
      "data-action": "open",
      "data-file": f.id
    }, "Abrir", 8, ["data-file"]), createVNode("button", {
      type: "button",
      "data-action": "rename",
      "data-file": f.id
    }, "Renombrar", 8, ["data-file"]), createVNode("button", {
      type: "button",
      "data-action": "delete",
      "data-file": f.id
    }, "Eliminar", 8, ["data-file"])])])]);
  }), 128))])])], 2))])]);
}

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
