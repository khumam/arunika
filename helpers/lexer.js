/**
 * Global environment parser will get data form global variable
 * @param {object} data The data that we need to parse
 * @param {object} globalVariable The global variable
 * @returns {object}
 */
export function globalEnvironmentParser(data, globalVariable) {
  var results = {};
  for (const key in data) {
    results[key] = data[key];
    if (typeof (data[key]) === "object") {
      results[key] = globalEnvironmentParser(data[key], globalVariable);
    } else {
      results[key] = data[key];
      if (typeof (data[key]) === "string" && data[key].includes("$")) {
        var result = [];
        data[key].split(" ").forEach((item) => {
          if (item.includes("$")) {
            const variables = item.replace("$", "").split(".");
            var tempResult = globalVariable;
            variables.forEach((variable) => {
              tempResult = tempResult[variable];
            });
            result.push(tempResult);
          } else {
            result.push(item);
          }
        })
        results[key] = result.join(" ");
      }
    }
  }

  return results;
}

/**
 * Parse the assertion to check the result of test
 * @param {object} response The response from request
 * @param {object} assertionData The assertion data
 * @returns {bool}
 */
export function parseAssertion(response, assertionData) {
  if (assertionData["check"] != "$response.status") {
    const asserts = assertionData["check"].replace("$response.body.", "").split(".");
    response = JSON.parse(response.body);
    var dataThatWeNeedToCheck = response;
    asserts.forEach((assert) => {
      dataThatWeNeedToCheck = dataThatWeNeedToCheck[assert];
    });
    return parseLogic(dataThatWeNeedToCheck, assertionData["logic"], assertionData["validation"]);
  }
  return parseLogic(response.status, assertionData["logic"], assertionData["validation"]);
}

/**
 * To parse the logic. We avoid eval() because it is harmful
 * @param {any} variableThatWeNeedToCheck The variable that we need to check
 * @param {string} logic The logic. We avoid eval() because it is harmful
 * @param {any} validation The validation that we need to pass the variable
 * @returns {bool}
 */
function parseLogic(variableThatWeNeedToCheck, logic, validation) {
  switch (logic) {
    case "==": return variableThatWeNeedToCheck == validation;
    case "!=": return variableThatWeNeedToCheck != validation;
    case ">": return variableThatWeNeedToCheck > validation;
    case "<": return variableThatWeNeedToCheck < validation;
    case ">=": return variableThatWeNeedToCheck >= validation;
    case "<=": return variableThatWeNeedToCheck <= validation;
    case "===": return variableThatWeNeedToCheck === validation;
    case "!==": return variableThatWeNeedToCheck !== validation;
  }
}