import { check, group, sleep } from "k6";
import http from "k6/http";
import { parseLogic } from "./helpers/parser.js";

export class ApigwTest {
  constructor(data, environment = {}, globalVariable = {}) {
    this.globalVariable = globalVariable;
    this.data = data;
    this.scenarios = data.scenarios;
    this.environment = environment;
  }

  addGlobalVariable(key, value) {
    this.globalVariable[key] = value;
  }

  parseObject(object) {
    const variablePattern = /\$\w*(\.\w+)*/;
    let results = {};
    for (const key in object) {
      if (typeof object[key] === "object") {
        results[key] = this.parseObject(object[key]);
      } else if (typeof object[key] === "string" && object[key].match(variablePattern)) {
        const parsedVariable = this.parseVariable(object[key].match(variablePattern)[0]);
        results[key] = object[key].replace(variablePattern, parsedVariable);
      } else {
        results[key] = object[key];
      }
    }

    return results;
  }

  parseVariable(variable) {
    const variables = variable.replace("$", "").split(".");
    if (variables[0] === "now") {
      return Math.ceil(Date.now() / 1000);
    } else {
      let parsedVariable = variables[0] in this.globalVariable ? this.globalVariable : this.environment;
      variables.forEach((key) => {
        parsedVariable = parsedVariable[key];
      });
      return parsedVariable;
    }
  }

  parseEndpoint(scenario) {
    let endpoint = !scenario.endpoint.includes("http") ? this.environment[scenario.endpoint] : scenario.endpoint;
    const urlParams = this.parseObject(scenario.urlParam ? scenario.urlParam : {});
    for (const placeholder in urlParams) {
      endpoint = endpoint.replace(`{${placeholder}}`, urlParams[placeholder]);
    }
    return endpoint;
  }

  parseAssertion(response, assertion) {
    assertion.validation = typeof assertion.validation === "string" && assertion.validation.includes("$") ? this.parseObject({ validation: assertion.validation }).validation : assertion.validation;
    if (assertion.check !== "$response.status" && assertion.check.includes("$response.body.")) {
      const variables = assertion.check.replace("$response.body.", "").split(".");
      console.log(response.body)
      response = JSON.parse(response.body);
      variables.forEach((key) => {
        response = response[key];
      });
      return parseLogic(response, assertion.logic, assertion.validation);
    } else if (assertion.check !== "$response.status" && assertion.check.includes("$response.")) {
      const variables = assertion.check.replace("$response.", "").split(".");
      variables.forEach((key) => {
        response = response[key];
      });
      return parseLogic(response, assertion.logic, assertion.validation);
    }
    return parseLogic(response.status, assertion.logic, assertion.validation);
  }

  request(method, endpoint, body, headers) {
    http.setResponseCallback(http.expectedStatuses({ min: 200, max: 499 }));
    headers = Object.assign({ "Content-Type": "application/json" }, headers);
    switch (method) {
      case "GET":
        return http.get(endpoint, { headers });
      case "POST":
        return http.post(endpoint, body, { headers });
      case "PATCH":
        return http.patch(endpoint, body, { headers });
      case "PUT":
        return http.put(endpoint, body, { headers });
      case "DELETE":
        return http.del(endpoint, body, { headers });
      default:
        return {};
    }
  }

  runTest(scenario) {
    const headers = this.parseObject(scenario.headers);
    const body = JSON.stringify(this.parseObject(scenario.body));
    const endpoint = this.parseEndpoint(scenario);
    const response = this.request(scenario.method, endpoint, body, headers);
    this.addGlobalVariable(
      scenario.id,
      response.body ? JSON.parse(response.body) : {}
    );
    return response;
  }

  checkAssertions(scenario, response) {
    if (scenario.assertions && scenario.assertions.length > 0) {
      scenario.assertions.forEach((assertion) => {
        group(scenario.group ? scenario.group : "Other scenario", () => {
          check(response, {
            [`${assertion.assert}`]: (res) =>
              this.parseAssertion(res, assertion),
          });
        });
      });
    }
  }

  addSleep(time) {
    return time ? sleep(time) : true;
  }

  log(scenarioId) {
    console.log("LOG FOR " + scenarioId);
    return true;
  }

  run() {
    this.scenarios.forEach((scenario) => {
      this.log(scenario.id);
      var response = {};
      response = this.runTest(scenario);
      this.checkAssertions(scenario, response);
      this.addSleep(scenario.sleep);
    });
  }
}
