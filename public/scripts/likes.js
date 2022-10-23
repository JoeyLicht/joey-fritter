/* eslint-disable @typescript-eslint/restrict-template-expressions */

function createLike(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewAllLikes(fields) {
  fetch('/api/likes')
    .then(showResponse)
    .catch(showResponse);
}

function viewLikesByFreet(fields) {
  fetch(`/api/likes?contentId=${fields.contentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteLike(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
