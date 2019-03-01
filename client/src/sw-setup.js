const API_KEY = 'AAAAUy3C_7Q:APA91bELzf6KDvLm8mGfRIukredHGjr4gl7Pc97wecAGcsUikn4SsCUYIevSek-t-PgD5hLGm5TkpZshCC2JIvh76mHKalTDM_eHqaKSRj-hqlimwuKcwvTbFSIY4Qil8-0v9y4WFcxr';
const GCM_ENDPOINT = 'https://172.23.24.5';
const curlCommandDiv = document.querySelector('.js-curl-command');
let isPushEnabled = false;
let bridge;

// This method handles the removal of subscriptionId
// in Chrome 44 by concatenating the subscription Id
// to the subscription endpoint
function endpointWorkaround(pushSubscription) {
  // Make sure we only mess with GCM
  if (pushSubscription.endpoint.indexOf('https://172.23.24.5') !== 0) {
    return pushSubscription.endpoint;
  }

  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = pushSubscription.endpoint + '/' +
      pushSubscription.subscriptionId;
  }
  return mergedEndpoint;
}

function sendSubscriptionToServer(subscription) {
  // TODO: Send the subscription.endpoint
  // to your server and save it to send a
  // push message at a later date
  //
  // For compatibly of Chrome 43, get the endpoint via
  // endpointWorkaround(subscription)
  console.log('TODO: Implement sendSubscriptionToServer()');

  var mergedEndpoint = endpointWorkaround(subscription);

  // This is just for demo purposes / an easy to test by
  // generating the appropriate cURL command
  showCurlCommand(mergedEndpoint);
}

// NOTE: This code is only suitable for GCM endpoints,
// When another browser has a working version, alter
// this to send a PUSH request directly to the endpoint
function showCurlCommand(mergedEndpoint) {
  // The curl command to trigger a push message straight from GCM
  if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0) {
    window.Demo.debug.log('This browser isn\'t currently ' +
      'supported for this demo');
    return;
  }

  var endpointSections = mergedEndpoint.split('/');
  var subscriptionId = endpointSections[endpointSections.length - 1];

  var curlCommand = 'curl --header "Authorization: key=' + API_KEY +
    '" --header Content-Type:"application/json" ' + GCM_ENDPOINT +
    ' -d "{\\"registration_ids\\":[\\"' + subscriptionId + '\\"]}"';

  curlCommandDiv.textContent = curlCommand;
}

function unsubscribe() {
  curlCommandDiv.textContent = '';

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // To unsubscribe from push messaging, you need get the
    // subcription object, which you can call unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (!pushSubscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          isPushEnabled = false;
          return;
        }

        // TODO: Make a request to your server to remove
        // the users data from your data store so you
        // don't attempt to send them push messages anymore

        // We have a subcription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function() {
          isPushEnabled = false;
        }).catch(function(e) {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove
          // the subscription id from your data store and
          // inform the user that you disabled push

          window.Demo.debug.log('Unsubscription error: ', e);
        });
      }).catch(function(e) {
      window.Demo.debug.log('Error thrown while unsubscribing from ' +
        'push messaging.', e);
    });
  });
}

function subscribe() {
  // Disable the button so it can't be changed while
  // we process the permission request
  console.log(0);
  console.log(navigator.serviceWorker);
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    console.log(1);
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        // The subscription was successful
        isPushEnabled = true;

        // TODO: Send the subscription subscription.endpoint
        // to your server and save it to send a push message
        // at a later date
        return sendSubscriptionToServer(subscription);
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
        } else {
          // A problem occurred with the subscription, this can
          // often be down to an issue or lack of the gcm_sender_id
          // and / or gcm_user_visible_only
          window.Demo.debug.log('Unable to subscribe to push.', e);
        }
      });
  });
}

// Once the service worker is registered set the initial state
function initialiseState(register) {
  console.log(-1);
  console.log(register);
  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    window.Demo.debug.log('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    window.Demo.debug.log('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    window.Demo.debug.log('Push messaging isn\'t supported.');
    return;
  }

  // We need the service worker registration to check for a subscription
  console.log(-0.95);
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    console.log(-0.9);
    bridge = serviceWorkerRegistration;
    showDelayed();
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      // Enable any UI which subscribes / unsubscribes from
      // push messages.

      if (!subscription) {
        // We aren’t subscribed to push, so set UI
        // to allow the user to enable push
        return;
      }

      // Keep your server in sync with the latest subscription
      sendSubscriptionToServer(subscription);

      // Set your UI to show they have subscribed for
      // push messages
      isPushEnabled = true;
    })
    .catch(function(err) {
      console.log('Error during getSubscription()', err);
    });
  });
}

window.addEventListener('load', function() {
  // Check that service workers are supported, if so, progressively
  // enhance and add push messaging support, otherwise continue without it.
  if ('serviceWorker' in navigator) {
    console.log(-2);
    navigator.serviceWorker.register('/service-worker.js')
             .then(initialiseState);
  } else {
    window.Demo.debug.log('Service workers aren\'t supported in this browser.');
  }
});

const delayed = [];

function showNotification(title, options) {
  if (bridge) {
    console.log(options);
    bridge.showNotification(title, options);
  } else {
    delayed.push([title, options]);
  }
}

function showDelayed() {
  delayed.forEach((message) => showNotification(...message));
}

export default function push(...args) {
  showNotification(...args);
}
