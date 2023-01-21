import { htmlReport } from "https://raw.githubusercontent.com/khumam/k6-reporter-bootstrap/master/dist/bundle.js";

/**
 * To save the file inside the results folder. The result will be saved as html file
 * @param {string} filename Filename of saved file
 * @param {object} data The result data
 * @returns {object}
 */
export function save(filename, data) {
  const results = {};
  results["./results/" + filename + ".html"] = htmlReport(data);
  return results;
}
