/* eslint-disable @typescript-eslint/restrict-template-expressions */

function initializeFeed(fields) {
  fetch('/api/feeds/', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function updateFeed(fields) {
  fetch('/api/feeds/', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewFeed(fields) {
  fetch('/api/feeds')
    .then(showResponse)
    .catch(showResponse);
}

// function viewFeedPreferences(fields) {
//   fetch('/api/feeds')
//     .then(showResponse)
//     .catch(showResponse);
// }