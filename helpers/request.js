import http from "k6/http";

/**
 * 
 * @param {string} method The method name
 * @param {string} endpoint The endpoint path
 * @param {object} body The body payload
 * @param {object} headers The headers request
 * @returns {object}
 */
function send(method, endpoint, body, headers) {
  switch (method) {
    case "POST":
    case "post":
      return http.post(endpoint, body, { headers });
    case "PATCH":
    case "patch":
      return http.patch(endpoint, body, { headers });
    case "PUT":
    case "put":
      return http.put(endpoint, body, { headers });
    case "DELETE":
    case "delete":
      return http.del(endpoint, body, { headers });
    case "GET":
    case "get":
      return http.get(endpoint, { headers })
  }
}

export default function (method = "", endpoint = "", body = {}, headers = {}, queries = {}) {
  if (endpoint.includes("{") && endpoint.includes("}")) {
    for (const query in queries) {
      endpoint = endpoint.replace(`{${query}}`, queries[query]);
    }
  }

  return send(method, endpoint, body, headers);
}