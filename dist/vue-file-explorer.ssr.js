'use strict';var vue=require('vue');function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
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
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}var script = /*#__PURE__*/vue.defineComponent({
  name: "FileExplorer",
  emits: ["initialLoad", "folderLoad", "action", "preUpdate", "postUpdate"],
  props: {
    layout: {
      type: String,
      default: "table",
      validator: function validator(v) {
        return ["cards", "table"].includes(v);
      }
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
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var _layout = vue.ref(props.layout);

    var _tree = vue.ref({});

    var folderId = vue.ref("0");

    var appendToTree = function appendToTree(news) {
      if (Array.isArray(news)) {
        if (typeof news[0] === "string") _tree.value[String(news[0])] = news[1];else news.forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              k = _ref3[0],
              v = _ref3[1];

          return _tree.value[String(k)] = v;
        });
      } else Object.entries(news).forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            k = _ref5[0],
            v = _ref5[1];

        return _tree.value[String(k)] = v;
      });
    };

    emit("initialLoad", function (news, id) {
      appendToTree(news);
      folderId.value = String(id || "0");
    });
    vue.watch([_layout, folderId], function () {
      return emit("preUpdate");
    });
    vue.watch([_layout, folderId], function () {
      return emit("postUpdate");
    }, {
      flush: "post"
    });
    vue.onMounted(function () {
      emit("postUpdate");
      var wrapper = document.querySelector(".vfe");

      if (wrapper) {
        wrapper.onclick = function (ev) {
          try {
            var _ref6, _ev$composedPath, _event, _event$target, _event2, _event3;

            // @ts-expect-error
            var _iterator = _createForOfIteratorHelper((_ref6 = (_ev$composedPath = ev.composedPath()) !== null && _ev$composedPath !== void 0 ? _ev$composedPath : (_event = event) === null || _event === void 0 ? void 0 : _event.path) !== null && _ref6 !== void 0 ? _ref6 : [(_event$target = (_event2 = event) === null || _event2 === void 0 ? void 0 : _event2.target) !== null && _event$target !== void 0 ? _event$target : (_event3 = event) === null || _event3 === void 0 ? void 0 : _event3.currentTarget]),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _dataset;

                var el = _step.value;
                if (el === wrapper) break;
                var set = (_dataset = el === null || el === void 0 ? void 0 : el.dataset) !== null && _dataset !== void 0 ? _dataset : {}; // * data-open="folderId"

                if ("open" in set) {
                  (function () {
                    var id = set.open || "0";
                    emit("folderLoad", id, appendToTree, id in _tree.value, function () {
                      return folderId.value = id;
                    });
                  })();
                } // * data-layout="table|cards"
                else if ("layout" in set) _layout.value = set.layout || "table"; // * data-action="<user-defained-action>" data-folder="folderId"


                var help = {
                  tree: vue.readonly(_tree.value),
                  append: appendToTree,
                  on: folderId.value,
                  action: set.action || "unknown"
                };
                if ("action" in set && "folder" in set) emit("action", _objectSpread2(_objectSpread2({}, help), {}, {
                  folder: set.folder || "0"
                })); // * data-action="<user-defained-action>" data-file="fileId"
                else if ("action" in set && "file" in set) emit("action", _objectSpread2(_objectSpread2({}, help), {}, {
                    file: set.file || "0"
                  })); // * data-action="<user-defained-action>"
                  else if ("action" in set) emit("action", help);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          } catch (error) {
            console.error(error);
          }
        };
      }
    });
    return {
      layoutType: _layout,
      folderId: folderId,
      tree: vue.computed(function () {
        return _tree.value;
      }),
      folders: vue.computed(function () {
        var _tree$value$folderId$;

        return ((_tree$value$folderId$ = _tree.value[folderId.value]) === null || _tree$value$folderId$ === void 0 ? void 0 : _tree$value$folderId$.folders) || [];
      }),
      files: vue.computed(function () {
        var _tree$value$folderId$2;

        return ((_tree$value$folderId$2 = _tree.value[folderId.value]) === null || _tree$value$folderId$2 === void 0 ? void 0 : _tree$value$folderId$2.files) || [];
      }),
      path: vue.computed(function () {
        var path = []; // * Current folder

        var dt = _tree.value[folderId.value];
        path.push([folderId.value, String(dt === null || dt === void 0 ? void 0 : dt[props.title]), "current"]); // * Path

        if (dt !== null && dt !== void 0 && dt.parentId) {
          var _String;

          var id = (_String = String(dt.parentId)) !== null && _String !== void 0 ? _String : null;

          do {
            var _dt = _tree.value[id];

            if (_dt) {
              if (!_dt.parentId) {
                path.unshift([id, String(_dt === null || _dt === void 0 ? void 0 : _dt[props.title]), "root"]);
                id = null;
              } else {
                path.unshift([id, String(_dt === null || _dt === void 0 ? void 0 : _dt[props.title])]);
                id = _dt.parentId;
              }
            }
          } while (id !== null);
        }

        console.log("path", path);
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
  "data-layout": "table"
}, "Table Layout", -1);

var _hoisted_8 = {
  class: "vfe-content"
};
var _hoisted_9 = {
  class: "vfe-header"
};

var _hoisted_10 = /*#__PURE__*/vue.createVNode("tr", null, [/*#__PURE__*/vue.createVNode("th", null, "Id"), /*#__PURE__*/vue.createVNode("th", null, "Actions")], -1);

var _hoisted_11 = {
  class: "vfe-content"
};
var _hoisted_12 = {
  class: "vfe-actions"
};
var _hoisted_13 = {
  class: "vfe-actions"
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
  })]), vue.createVNode("div", _hoisted_5, [vue.renderSlot(_ctx.$slots, "layout-selector", {}, function () {
    return [_hoisted_6, _hoisted_7];
  })])]), vue.renderSlot(_ctx.$slots, "help-bar"), vue.createVNode("div", _hoisted_8, [_ctx.layoutType === 'cards' ? (vue.openBlock(), vue.createBlock("div", {
    key: 0,
    class: ["vfe-cards", _ctx.cards]
  }, [vue.renderSlot(_ctx.$slots, "cards-folders", {
    folders: _ctx.folders,
    tree: _ctx.tree
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.folders, function (f, i) {
      return vue.openBlock(), vue.createBlock("div", {
        key: i,
        class: "vfe-folder"
      }, [vue.renderSlot(_ctx.$slots, "cards-folder", {
        id: f.id,
        data: f,
        tree: _ctx.tree
      }, function () {
        return [vue.createVNode("button", {
          type: "butten",
          "data-open": f.id
        }, vue.toDisplayString(f.id), 9, ["data-open"])];
      })]);
    }), 128))];
  }), vue.renderSlot(_ctx.$slots, "cards-files", {
    files: _ctx.files
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.files, function (f, i) {
      return vue.openBlock(), vue.createBlock("div", {
        key: i,
        class: "vfe-file"
      }, [vue.renderSlot(_ctx.$slots, "cards-file", {
        id: f.id,
        data: f
      }, function () {
        return [vue.createVNode("span", null, vue.toDisplayString(f.id), 1)];
      })]);
    }), 128))];
  })], 2)) : (vue.openBlock(), vue.createBlock("table", {
    key: 1,
    class: ["vfe-table", _ctx.table]
  }, [vue.createVNode("thead", _hoisted_9, [vue.renderSlot(_ctx.$slots, "table-header", {}, function () {
    return [_hoisted_10];
  })]), vue.createVNode("tbody", _hoisted_11, [vue.renderSlot(_ctx.$slots, "table-folders", {
    folders: _ctx.folders,
    tree: _ctx.tree
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.folders, function (f) {
      return vue.openBlock(), vue.createBlock("tr", {
        key: f.id,
        class: "vfe-folder"
      }, [vue.renderSlot(_ctx.$slots, "table-folder", {
        id: f.id,
        data: f,
        tree: _ctx.tree
      }, function () {
        return [vue.createVNode("td", null, vue.toDisplayString(f.id), 1), vue.createVNode("td", _hoisted_12, [vue.createVNode("button", {
          type: "button",
          "data-open": f.id
        }, "Abrir", 8, ["data-open"]), vue.createVNode("button", {
          type: "button",
          "data-action": "rename",
          "data-folder": f.id
        }, "Renombrar", 8, ["data-folder"]), vue.createVNode("button", {
          type: "button",
          "data-action": "delete",
          "data-folder": f.id
        }, "Eliminar", 8, ["data-folder"])])];
      })]);
    }), 128))];
  }), vue.renderSlot(_ctx.$slots, "table-files", {
    files: _ctx.files
  }, function () {
    return [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.files, function (f) {
      return vue.openBlock(), vue.createBlock("tr", {
        key: f.id,
        class: "vfe-file"
      }, [vue.renderSlot(_ctx.$slots, "table-file", {
        id: f.id,
        data: f
      }, function () {
        return [vue.createVNode("td", null, vue.toDisplayString(f.id), 1), vue.createVNode("td", _hoisted_13, [vue.createVNode("button", {
          type: "button",
          "data-action": "open",
          "data-file": f.id
        }, "Abrir", 8, ["data-file"]), vue.createVNode("button", {
          type: "button",
          "data-action": "rename",
          "data-file": f.id
        }, "Renombrar", 8, ["data-file"]), vue.createVNode("button", {
          type: "button",
          "data-action": "delete",
          "data-file": f.id
        }, "Eliminar", 8, ["data-file"])])];
      })]);
    }), 128))];
  })])], 2))])]);
}script.render = render;// Import vue component

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