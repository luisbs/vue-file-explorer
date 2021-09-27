'use strict';var vue=require('vue');function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var script = /*#__PURE__*/vue.defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "event"],
  props: {
    layout: {
      type: String,
      default: "cards",
      validator: function validator(v) {
        return ["details", "cards"].includes(v);
      }
    },
    render: Function
  },
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var _layout = vue.ref(props.layout);

    var Tree = vue.ref(new Map());
    var folderId = vue.ref(0);

    var appendToTree = function appendToTree(news) {
      return news.forEach(function (v, k) {
        return Tree.value.set(k, v);
      });
    };

    emit("initialLoad", appendToTree);
    folderId.value = Array.from(Tree.value.keys()).shift() || 0;

    var attach = function attach(selector, listener) {
      return document.querySelectorAll(".vfe ".concat(selector)).forEach(function (el) {
        return el.onclick = function (ev) {
          return listener(ev, el);
        };
      });
    };

    var attachListeners = function attachListeners() {
      attach("button[data-open]", function (_, el) {
        folderId.value = el.dataset.open || 0;
        emit("folderLoad", folderId.value, appendToTree, Tree.value.has(folderId.value));
      });
      attach(".vfe-folder button[data-action]", function (_, el) {
        return emit("event", {
          type: "folder",
          event: el.dataset.action || "unknown",
          elementId: el.dataset.element || 0
        });
      });
      attach(".vfe-file button[data-action]", function (_, el) {
        return emit("event", {
          type: "file",
          event: el.dataset.action || "unknown",
          elementId: el.dataset.element || 0
        });
      });
    };

    vue.watch(folderId, attachListeners, {
      flush: "post"
    });
    vue.onMounted(function () {
      attach("button[data-layout]", function (_, el) {
        return _layout.value = el.dataset.layout || "details";
      });
      attachListeners();
    });
    return {
      tree: Tree,
      layoutType: _layout,
      folderId: folderId,
      folders: vue.computed(function () {
        var _Tree$value$get;

        return ((_Tree$value$get = Tree.value.get(folderId.value)) === null || _Tree$value$get === void 0 ? void 0 : _Tree$value$get.folders) || [];
      }),
      files: vue.computed(function () {
        var _Tree$value$get2;

        return ((_Tree$value$get2 = Tree.value.get(folderId.value)) === null || _Tree$value$get2 === void 0 ? void 0 : _Tree$value$get2.files) || [];
      }),
      path: vue.computed(function () {
        var path = []; // * Current folder

        var dt = Tree.value.get(folderId.value) || {};
        path.push([folderId.value, dt.title, "current"]); // * Path

        if (dt.parentId) {
          var _dt$parentId;

          var id = (_dt$parentId = dt.parentId) !== null && _dt$parentId !== void 0 ? _dt$parentId : null;

          do {
            var _dt = Tree.value.get(id);

            if (_dt) {
              if (!_dt.parentId) {
                path.unshift([id, _dt.title, "root"]);
                id = null;
              } else {
                path.unshift([id, _dt.title]);
                id = _dt.parentId;
              }
            }
          } while (id !== null);
        }

        return path;
      })
    };
  }
});var _hoisted_1 = {
  class: "vfe vue-file-explorer"
};
var _hoisted_2 = {
  class: "vfe-bar"
};
var _hoisted_3 = {
  class: "vfe-path"
};
var _hoisted_4 = {
  key: 0
};
var _hoisted_5 = {
  class: "vfe-layout"
};

var _hoisted_6 = /*#__PURE__*/vue.createVNode("button", {
  type: "button",
  "data-layout": "cards"
}, "Cards Layout", -1);

var _hoisted_7 = /*#__PURE__*/vue.createVNode("button", {
  type: "button",
  "data-layout": "details"
}, "Details Layout", -1);

var _hoisted_8 = {
  class: "vfe-content"
};
var _hoisted_9 = {
  key: 0,
  class: "vfe-cards"
};
var _hoisted_10 = {
  key: 1,
  class: "vfe-details"
};

var _hoisted_11 = /*#__PURE__*/vue.createVNode("li", {
  class: "vfe-header"
}, [/*#__PURE__*/vue.createVNode("span", null, "Id"), /*#__PURE__*/vue.createVNode("span", null, "Name"), /*#__PURE__*/vue.createVNode("span", null, "Actions")], -1);

var _hoisted_12 = {
  class: "vfe-actions"
};
var _hoisted_13 = {
  class: "vfe-menu"
};
var _hoisted_14 = {
  class: "vfe-actions"
};
var _hoisted_15 = {
  class: "vfe-menu"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("div", _hoisted_1, [vue.createVNode("div", _hoisted_2, [vue.createVNode("div", _hoisted_3, [vue.renderSlot(_ctx.$slots, "folder-path", {
    path: _ctx.path
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.path, function (_ref, i) {
      var _ref2 = _slicedToArray(_ref, 3),
          id = _ref2[0],
          title = _ref2[1],
          condition = _ref2[2];

      return vue.openBlock(), vue.createBlock(vue.Fragment, {
        key: i
      }, [condition === 'current' ? (vue.openBlock(), vue.createBlock("span", _hoisted_4, vue.toDisplayString(title), 1)) : (vue.openBlock(), vue.createBlock("button", {
        key: 1,
        type: "button",
        "data-open": id
      }, vue.toDisplayString(title), 9, ["data-open"]))], 64);
    }), 128))];
  })]), vue.createVNode("div", null, vue.toDisplayString(_ctx.folderId), 1), vue.createVNode("div", _hoisted_5, [vue.renderSlot(_ctx.$slots, "layout-selector", {}, function () {
    return [_hoisted_6, _hoisted_7];
  })])]), vue.createVNode("div", _hoisted_8, [_ctx.layoutType === 'cards' ? (vue.openBlock(), vue.createBlock("div", _hoisted_9, [vue.renderSlot(_ctx.$slots, "cards-folders", {
    folders: _ctx.folders
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.folders, function (f, i) {
      return vue.openBlock(), vue.createBlock("div", {
        key: i,
        class: "vfe-folder"
      }, [vue.renderSlot(_ctx.$slots, "cards-folder", {
        id: f.id,
        title: f.title,
        data: f
      }, function () {
        return [vue.createVNode("button", {
          type: "butten",
          "data-open": f.id
        }, vue.toDisplayString(f.id) + " - " + vue.toDisplayString(f.title), 9, ["data-open"])];
      })]);
    }), 128))];
  }), vue.renderSlot(_ctx.$slots, "cards-files", {
    files: _ctx.files
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.files, function (f, i) {
      return vue.openBlock(), vue.createBlock("div", {
        key: i,
        class: "vfe-files"
      }, [vue.renderSlot(_ctx.$slots, "cards-file", {
        id: f.id,
        title: f.title,
        data: f
      }, function () {
        return [vue.createVNode("span", null, vue.toDisplayString(f.id) + " - " + vue.toDisplayString(f.title), 1)];
      })]);
    }), 128))];
  })])) : (vue.openBlock(), vue.createBlock("ul", _hoisted_10, [vue.renderSlot(_ctx.$slots, "details-header", {}, function () {
    return [_hoisted_11];
  }), vue.renderSlot(_ctx.$slots, "details-folders", {
    folders: _ctx.folders
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.folders, function (f, i) {
      return vue.openBlock(), vue.createBlock("li", {
        key: i,
        class: "vfe-folder"
      }, [vue.renderSlot(_ctx.$slots, "details-folder", {
        id: f.id,
        title: f.title,
        data: f
      }, function () {
        return [vue.createVNode("span", null, vue.toDisplayString(f.id), 1), vue.createVNode("span", null, vue.toDisplayString(f.title), 1)];
      }), vue.renderSlot(_ctx.$slots, "folder-actions", {
        id: f.id
      }, function () {
        return [vue.createVNode("div", _hoisted_12, [vue.createVNode("label", {
          for: "id-".concat(f.id)
        }, "Actions", 8, ["for"]), vue.createVNode("input", {
          type: "checkbox",
          id: "id-".concat(f.id)
        }, null, 8, ["id"]), vue.createVNode("div", _hoisted_13, [vue.renderSlot(_ctx.$slots, "folder-menu", {
          id: f.id
        }, function () {
          return [vue.createVNode("button", {
            type: "button",
            "data-open": f.id
          }, "Abrir", 8, ["data-open"]), vue.createVNode("button", {
            type: "button",
            "data-action": "rename",
            "data-element": f.id
          }, "Renombrar", 8, ["data-element"]), vue.createVNode("button", {
            type: "button",
            "data-action": "delete",
            "data-element": f.id
          }, "Eliminar", 8, ["data-element"])];
        })])])];
      })]);
    }), 128))];
  }), vue.renderSlot(_ctx.$slots, "details-files", {
    files: _ctx.files
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.files, function (f, i) {
      return vue.openBlock(), vue.createBlock("li", {
        key: i,
        class: "vfe-file"
      }, [vue.renderSlot(_ctx.$slots, "details-file", {
        id: f.id,
        title: f.title,
        data: f
      }, function () {
        return [vue.createVNode("span", null, vue.toDisplayString(f.id), 1), vue.createVNode("span", null, vue.toDisplayString(f.title), 1)];
      }), vue.renderSlot(_ctx.$slots, "file-actions", {
        id: f.id
      }, function () {
        return [vue.createVNode("div", _hoisted_14, [vue.createVNode("label", {
          for: "id-".concat(f.id)
        }, "Actions", 8, ["for"]), vue.createVNode("input", {
          type: "checkbox",
          id: "id-".concat(f.id)
        }, null, 8, ["id"]), vue.createVNode("div", _hoisted_15, [vue.renderSlot(_ctx.$slots, "file-menu", {
          id: f.id
        }, function () {
          return [vue.createVNode("button", {
            type: "button",
            "data-action": "open",
            "data-element": f.id
          }, "Abrir", 8, ["data-element"]), vue.createVNode("button", {
            type: "button",
            "data-action": "rename",
            "data-element": f.id
          }, "Renombrar", 8, ["data-element"]), vue.createVNode("button", {
            type: "button",
            "data-action": "delete",
            "data-element": f.id
          }, "Eliminar", 8, ["data-element"])];
        })])])];
      })]);
    }), 128))];
  })]))])]);
}function styleInject(css, ref) {
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
}var css_248z = "\n.vue-file-explorer {\n  display: flex;\n  flex-direction: column;\n}\n.vfe-bar {\n  display: flex;\n  justify-content: space-between;\n}\n/* .vfe-path */\n/* .vfe-layout */\n\n/* .vfe-content */\n/* .vfe-cards */\n.vfe-details {\n  display: flex;\n  flex-direction: column;\n}\n.vfe-details > * {\n  display: flex;\n  justify-content: space-between;\n}\n\n/* .vfe-header */\n/* .vfe-folder */\n/* .vfe-file */\n.vfe-actions {\n  position: relative;\n}\n.vfe-menu {\n  z-index: -1;\n  position: absolute;\n  right: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  opacity: 0;\n  height: 0;\n  width: 0;\n}\n.vfe-actions > label {\n  user-select: none;\n}\n.vfe-actions > input {\n  display: none;\n}\n.vfe-actions > input:checked + .vfe-menu {\n  z-index: 1;\n  height: auto;\n  width: auto;\n  opacity: 1;\n}\n";
styleInject(css_248z);script.render = render;// Import vue component

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
var component = /*#__PURE__*/(function () {
  // Assign InstallableComponent type
  var installable = script; // Attach install function executed by Vue.use()

  installable.install = function (app) {
    app.component("FileExplorer", installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default': component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;