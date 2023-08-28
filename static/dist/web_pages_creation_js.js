"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkhubris_web"] = self["webpackChunkhubris_web"] || []).push([["web_pages_creation_js"],{

/***/ "./web/components/components/pages.js":
/*!********************************************!*\
  !*** ./web/components/components/pages.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NextPage: () => (/* binding */ NextPage),\n/* harmony export */   PageWithNext: () => (/* binding */ PageWithNext)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_tabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-tabs */ \"./node_modules/react-tabs/esm/index.js\");\n/* harmony import */ var _interactive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interactive.js */ \"./web/components/components/interactive.js\");\n/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.js */ \"./web/components/components/styles.js\");\n\n\n\n\nfunction NextPage({\n  current,\n  character\n}) {\n  var progression = ['class', 'backgrounds', 'stats', 'skills', 'bio', 'save'];\n  var next = progression[progression.indexOf(current) + 1];\n  console.log(next);\n  var display = (0,_styles_js__WEBPACK_IMPORTED_MODULE_3__.style)('bottom-btn', {\n    paddingTop: 20,\n    '& button': {\n      margin: 0,\n      border: 'unset',\n      borderTop: _styles_js__WEBPACK_IMPORTED_MODULE_3__.styles.border\n    }\n  });\n  async function proceed() {\n    if (ruleset.condition(current, character) == true) {\n      sessionStorage.setItem('character', JSON.stringify(character));\n      if (next == 'save') {\n        character.save();\n        var res = await character.write();\n        window.location.assign(res.url);\n      } else {\n        window.location.assign('/create?' + new URLSearchParams({\n          character: character.id,\n          stage: next\n        }));\n      }\n    } else {\n      alert('Please choose all required options before proceeding.');\n    }\n  }\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: display\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_interactive_js__WEBPACK_IMPORTED_MODULE_2__.Buttons, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_interactive_js__WEBPACK_IMPORTED_MODULE_2__.Button, {\n    onClick: proceed\n  }, \" next \")));\n}\nfunction PageWithNext({\n  url,\n  character,\n  children\n}) {\n  var sty = (0,_styles_js__WEBPACK_IMPORTED_MODULE_3__.style)('page', {\n    border: _styles_js__WEBPACK_IMPORTED_MODULE_3__.styles.border\n  });\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: sty\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageHeader, {\n    title: url\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PageContent, null, children), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NextPage, {\n    current: url,\n    character: character\n  }));\n}\nfunction PageContent({\n  children\n}) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", null, children);\n}\nfunction PageHeader({\n  title\n}) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h1\", {\n    style: {\n      textTransform: 'uppercase',\n      fontFamily: _styles_js__WEBPACK_IMPORTED_MODULE_3__.styles.mono,\n      width: 'fit-content',\n      margin: 'auto'\n    }\n  }, title);\n}\n\n//# sourceURL=webpack://hubris-web/./web/components/components/pages.js?");

/***/ }),

/***/ "./web/pages/creation.js":
/*!*******************************!*\
  !*** ./web/pages/creation.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ create)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_components_pages_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/components/pages.js */ \"./web/components/components/pages.js\");\n/* harmony import */ var _models_character_character__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/character/character */ \"./web/models/character/character.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ \"./node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var jsuri__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jsuri */ \"./node_modules/jsuri/Uri.js\");\n/* harmony import */ var jsuri__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jsuri__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nasync function create() {\n  const ch = await _models_character_character__WEBPACK_IMPORTED_MODULE_2__.Character.load();\n  const url = new (jsuri__WEBPACK_IMPORTED_MODULE_4___default())(window.location.href).getQueryParamValue('stage');\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CreationPage, {\n    ch: ch,\n    stage: url\n  });\n}\nfunction CreationPage({\n  ch,\n  stage\n}) {\n  const [char, dispatchChanges] = (0,_models_character_character__WEBPACK_IMPORTED_MODULE_2__.useCharacter)(ch);\n  const patch = (0,_models_character_character__WEBPACK_IMPORTED_MODULE_2__.generatePatch)(dispatchChanges);\n  var binner = patch('options', 'regroup');\n  var handler = patch('options', 'addDrop', true);\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_components_pages_js__WEBPACK_IMPORTED_MODULE_1__.PageWithNext, {\n    url: stage,\n    character: char\n  }, stage == 'class' && char.options.classes.display({\n    binner: binner,\n    handler: handler\n  }), stage == 'backgrounds' && char.options.backgrounds.display({\n    binner: binner,\n    handler: handler\n  }), stage == 'stats' && char.stats.displayAllocate([patch('stats', 'increment'), patch('stats', 'decrement')]), stage == 'skills' && char.skills.display({\n    handler: patch('skills', 'addDrop')\n  }), stage == 'bio' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(char.bio.FullBio, {\n    obj: char.bio,\n    handler: patch('bio', 'update')\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_models_character_character__WEBPACK_IMPORTED_MODULE_2__.SaveButton, {\n    ch: char\n  }));\n}\n\n//# sourceURL=webpack://hubris-web/./web/pages/creation.js?");

/***/ })

}]);