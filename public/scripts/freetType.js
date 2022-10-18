/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createFreetType, fields has property 'freetType'
 */

function viewAllFreetTypes(fields) {
  fetch('/api/freetTypes')
    .then(showResponse)
    .catch(showResponse);
}

function filterByFreetType(fields) {
  fetch(`/api/freetTypes?freetType=${fields.freetType}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreetType(fields) {
  fetch(`/api/freetTypes/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function tagFreet(fields) {
  fetch(`/api/freetTypes/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
