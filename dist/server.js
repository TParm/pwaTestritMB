/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/server.js":
/*!******************************!*\
  !*** ./src/server/server.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var path = __webpack_require__(/*! path */ \"path\");\n\nvar express = __webpack_require__(/*! express */ \"express\");\n\nvar app = express();\nDIST_DIR = __dirname, HTML_FILE = path.join(DIST_DIR, 'index.html');\n\nvar datastore = __webpack_require__(/*! nedb */ \"nedb\");\n\nvar db = new datastore();\n\nvar webpush = __webpack_require__(/*! web-push */ \"web-push\");\n\napp.use(express[\"static\"](DIST_DIR));\napp.get('*', function (req, res) {\n  res.sendFile(HTML_FILE);\n});\nvar vapidKeys = {\n  publicKey: \"BGR9dUZ-UlIFfVWIfSfkZ3lFP52RuXUPvXFE5fsL0CAXnawPKoQDLMKguQSTW6DCaCfEwMlVz9HPkXH8IztuMIM\",\n  privateKey: \"cJdeLej_aarHqCZEApBMu7Ikj2h58vNMtXMGwxrKIn8\"\n};\nwebpush.setVapidDetails(\"mailto:ruben.buysschaert@vives.be\", vapidKeys.publicKey, vapidKeys.privateKey); // // Static files beschikbaar maken.\n// app.use(express.static('src'));\n// // Ontvangen data omzetten van JSON naar JS-objecten.\n// app.use(express.json());\n// Maak een route voor het opslaan van de subscriptions.\n\napp.post(\"/dist/api/save-subscription/\", function (request, response) {\n  console.log(\"POST info arrived: \", request.body); // Als de data niet ok is, keer terug met foutmelding.\n\n  if (!request.body || !request.body.endpoint) {\n    response.status(400);\n    response.setHeader(\"Content-type\", \"application/json\");\n    response.send(JSON.stringify({\n      error: {\n        id: \"no endpoint\",\n        message: \"Subscription must have an endpoint.\"\n      }\n    }));\n  } else {\n    // Als data wel ok is, sla op in lokale database (in memory)...\n    saveSubscriptionToDatabase(request.body).then(function (subscriptionId) {\n      console.log(\"Saved _id: \", subscriptionId);\n      response.setHeader(\"Content-Type\", \"application/json\");\n      response.send(JSON.stringify({\n        data: {\n          success: true\n        }\n      }));\n    })[\"catch\"](function (err) {\n      console.log(err);\n      response.status(500);\n      response.setHeader(\"Content-Type\", \"application/json\");\n      response.send(JSON.stringify({\n        error: {\n          id: \"unable-to-save-subscription\",\n          message: \"The subscription was received but we were unable to save it to our database.\"\n        }\n      }));\n    });\n  }\n});\n\nfunction saveSubscriptionToDatabase(subscription) {\n  return new Promise(function (resolve, reject) {\n    // Item toevoegen aan de NeDB, zie: https://github.com/louischatriot/nedb/wiki/Inserting-documents\n    db.insert(subscription, function (err, newDoc) {\n      if (err) reject(err); // Ter info het automatisch aangemaakte _id terug meegeven.\n      else resolve(newDoc._id);\n    });\n  });\n} // Maak een route voor het pushen van notifications.\n\n\napp.post(\"/dist/api/trigger-push-message/\", function (request, response) {\n  console.log(\"Trigger push at backend received: \", request.body); // Antwoorden aan aanvrager.\n\n  response.setHeader(\"Content-Type\", \"application/json\");\n  response.send(JSON.stringify({\n    data: {\n      success: true\n    }\n  })); // Alle abonnementen opvragen in de database en daarnaar een berichtje pushen.\n  // Info over opvragen gegevens in een NeDB, zie: https://github.com/louischatriot/nedb/wiki/Finding-documents.\n\n  db.find({}, function (err, subscriptions) {\n    console.log(subscriptions);\n    if (err) console.log(\"Error during searching in NeDB: \", err);else {\n      // Er is reeds een pagina die push berichtjes kan aanvragen/versturen... Maar het kan ook via Postman.\n      // Moet onderstaande meer asynchroon? Met Promises?\n      for (var i = 0; i < subscriptions.length; i++) {\n        triggerPushMessage(subscriptions[i], request.body.message);\n      }\n    }\n  });\n}); // Functie die effectief de berichten pusht.\n\nfunction triggerPushMessage(subscription, dataToSend) {\n  // Zie: https://www.npmjs.com/package/web-push#sendnotificationpushsubscription-payload-options.\n  // Deze functie return't een Promise die resulteert in een object of error.\n  return webpush.sendNotification(subscription, dataToSend)[\"catch\"](function (err) {\n    if (err.statusCode === 404 || err.statusCode === 410) {\n      console.log(\"Subscription has expired or is no longer valid: \", err); // Het bewuste abonnement verwijderen. Nog verder testen.\n\n      db.remove({\n        _id: subscription._id\n      }, {}, function () {\n        console.log(\"Subscription removed with _id: \", subscription._id);\n      });\n    } else {\n      throw err;\n    }\n  });\n}\n\nvar PORT = process.env.PORT || 8080;\napp.listen(PORT, function () {\n  console.log(\"App listening to \".concat(PORT, \"....\"));\n  console.log('Press Ctrl+C to quit.');\n});\n\n//# sourceURL=webpack://Express_Webpack_PWA/./src/server/server.js?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "nedb":
/*!***********************!*\
  !*** external "nedb" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("nedb");

/***/ }),

/***/ "web-push":
/*!***************************!*\
  !*** external "web-push" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("web-push");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/server.js");
/******/ 	
/******/ })()
;