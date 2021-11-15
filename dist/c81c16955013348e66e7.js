window.addEventListener("load", function () {
  var _document$querySelect, _document$querySelect2;

  console.log("Loaded."); // Service Worker registreren.

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(function (registration) {
      console.log("Registerd:", registration);
    })["catch"](function (error) {
      return console.log(error);
    });
  } else {
    console.log("No service worker support in this browser.");
  } // Click events opvangen.


  (_document$querySelect = document.querySelector("#btnGrantPermission")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.addEventListener("click", function () {
    console.log("clicked"); // Controleer of notifications mogelijk zijn met deze browser...

    if (!("Notification" in window)) {
      console.log("Notifications are not supported by your browser.");
    } else {
      if (Notification.permission == "granted") {
        console.log("Permission granted before.");
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
          if (permission == "granted") {
            console.log("Permission granted.");
          }
        });
      } else {
        console.log("Permission denied. No Notifications will be send.");
      }
    }
  });
  (_document$querySelect2 = document.querySelector("#btnShowNotification")) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.addEventListener("click", function () {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then(function (registration) {
        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
        registration.showNotification("MB Testrit!", {
          vibrate: [300, 100, 100, 50, 100, 50, 100, 100, 150, 250, 100, 700, 200, 150, 200],
          body: "Bericht is verstuurd naar één van onze werknemers!",
          icon: "/images/icons/brand.png",
          actions: [{
            action: "go",
            title: "Ga naar de officiële website.."
          }, {
            action: "noGo",
            title: "Scroll verder op huidige website"
          }]
        });
        console.log("New notification was send.");
        window.location.href = "/index.html";
      });
    }
  });
  document.querySelector("#btnSubscribeToPushNotification").addEventListener('click', function () {
    console.log("Clicked to subscribe.");
    navigator.serviceWorker.getRegistration().then(function (registration) {
      // https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe
      // Public key: BGR9dUZ-UlIFfVWIfSfkZ3lFP52RuXUPvXFE5fsL0CAXnawPKoQDLMKguQSTW6DCaCfEwMlVz9HPkXH8IztuMIM
      // Private key: cJdeLej_aarHqCZEApBMu7Ikj2h58vNMtXMGwxrKIn8
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array("BGR9dUZ-UlIFfVWIfSfkZ3lFP52RuXUPvXFE5fsL0CAXnawPKoQDLMKguQSTW6DCaCfEwMlVz9HPkXH8IztuMIM")
      }).then(function (subscription) {
        console.log("Subscripton: ", JSON.stringify(subscription));
        window.location.href = "/index.html"; // Verzend het 'subscription object' naar de centrale server om op te slaan.

        var options = {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(subscription)
        };
        fetch("/dist/api/save-subscription/", options).then(function (response) {
          console.log("Response:", response);
          return response.json();
        }).then(function (response) {
          console.log(response);
        })["catch"](function (error) {
          return console.log(error);
        });
      })["catch"](function (error) {
        return console.log(error);
      });
    })["catch"](function (error) {
      return console.log(error);
    });
  });
}); // Zie: https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js

function urlB64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}