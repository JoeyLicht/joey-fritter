/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addFullStory(fields) {
  fetch(`/api/fullStories/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function filterByContent(fields) {
  fetch(`/api/fullStories?contentId=${fields.contentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFullStories(fields) {
  fetch('/api/fullStories')
    .then(showResponse)
    .catch(showResponse);
}

function deleteFullStory(fields) {
  fetch(`/api/fullStories/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}