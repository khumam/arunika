/**
 * To parse the logic. We avoid eval() because it is harmful
 * @param {any} variableThatWeNeedToCheck The variable that we need to check
 * @param {string} logic The logic. We avoid eval() because it is harmful
 * @param {any} validation The validation that we need to pass the variable
 * @returns {bool}
 */
export function parseLogic(variableThatWeNeedToCheck, logic, validation) {
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

/**
 * To parse the scenario file in JSON into object
 * @param {string} path The path to the scenario files
 * @returns {object}
 */
export function parseScenario(path) {
  return JSON.parse(open(path));
}