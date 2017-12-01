import { API_URL } from '../constains/config';

export default (url, options) => new Promise((res, rej) => {
  fetch(`${API_URL}${url}`, options)
    .then(response => response.json())
    .then(res)
    .catch(rej);
});
