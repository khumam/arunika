import { check, group } from "k6";
import { globalEnvironmentParser, parseAssertion } from "./helpers/lexer.js";
import request from "./helpers/request.js";
import { save } from "./helpers/reporter.js";
const path = JSON.parse(open(__ENV.SCENARIO_PATH));
var globalVariable = {};

export default function () {
  path["scenarios"].forEach((param) => {
    const headers = globalEnvironmentParser(param["headers"], globalVariable);
    const body = JSON.stringify(globalEnvironmentParser(param["body"], globalVariable));
    const queries = globalEnvironmentParser(param["queries"], globalVariable);
    const response = request(param["method"], param["endpoint"], body, headers, queries);
    if (param["assertions"] && param["assertions"].length > 0) {
      param["assertions"].forEach((asserts) => {
        group(param["group"], function () {
          check(response, {
            [`${asserts["assert"]}`]: (r) => parseAssertion(r, asserts),
          });
        })
      })
    }
    globalVariable[param["id"]] = response.body ? JSON.parse(response.body) : {};
  });
}

export function handleSummary(data) {
  return save(path["filename"], data);
}