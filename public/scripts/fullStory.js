/* eslint-disable @typescript-eslint/restrict-template-expressions */

function addFullStory(fields) {
  fetch(`/api/fullStories/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
