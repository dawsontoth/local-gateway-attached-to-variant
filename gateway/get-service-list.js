import { exec } from 'child_process';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = yaml.load(
  fs.readFileSync(path.resolve(__dirname, '../settings.yaml'), {
    encoding: 'utf-8',
  })
);

function breakUpOutput(output) {
  // breaks the output from a long string into a string per line
  // then removes the lines that are just horizontal lines
  const rowsWithOutHorzLines = output
    .split('\n')
    .filter((line) => line.indexOf('─') < 0);

  const indexOfFirstBlankRow = rowsWithOutHorzLines.indexOf('');

  // removes the other lines that do not contain
  // information on a subgraph
  const rowsWithSubGraphs = rowsWithOutHorzLines.splice(
    1,
    indexOfFirstBlankRow - 1
  );

  const parsedStrings = rowsWithSubGraphs.map((line) => {
    const processed = line
      .split('│')
      .filter((split) => split)
      .map((p) => p.trim());
    return { name: processed[0], url: processed[1] };
  });
  return parsedStrings;
}

function replaceRoverDataWithConfig(roverData, configData) {
  return Object.values({ ...roverData, ...configData });
}

export async function GetServiceList() {
  return new Promise((res, rej) => {
    exec(
      `rover subgraph list ${config.graphName}@${config.variant}`,
      (err, stdout, stderr) => {
        if (err) {
          rej(err);
          return;
        }
        if (stderr) {
          rej(stderr);
          return;
        }

        const roverData = breakUpOutput(stdout);
        res(replaceRoverDataWithConfig(roverData, config.replacedServices));
      }
    );
  });
}
