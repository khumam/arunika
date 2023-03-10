import { ApigwTest } from "./main.js";
import { save } from "./helpers/reporter.js";
import { parseScenario } from "./helpers/parser.js";
const data = parseScenario(__ENV.SCENARIO_PATH);

export default function () {
  const apigw = new ApigwTest(data);
  apigw.run();
}

export function handleSummary(results) {
  return save(data.filename, results);
}