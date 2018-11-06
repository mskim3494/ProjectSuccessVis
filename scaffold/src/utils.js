// example of how to export functions
// this particular util only doubles a value so it shouldn't be too useful

import {interpolateRainbow, interpolateBlues, interpolateGreens} from 'd3-scale-chromatic';
import {scaleLinear} from 'd3-scale';

export function myExampleUtil(x) {
  return x * 2;
}

const subjects = ['$Literacy & Language', '$Math & Science',
  '$Music & The Arts', '$Applied Learning',
  '$History & Civics', '$Health & Sports',
  '$Special Needs'];
const area = ['$Rural', '$Suburban', '$Urban'];
const subjectScale = scaleLinear().domain([0, subjects.length - 1]).range([0.2, 1]);
const areaScale = scaleLinear().domain([0, area.length - 1]).range([0.3, 0.7]);
const povertyLevel = ['$Highest Poverty', '$High Poverty',
  '$Moderate Poverty', '$Low Poverty'];
const povertyScale = scaleLinear().domain([povertyLevel.length - 1, 0]).range([0.3, 0.7]);

export function getColors(sub) {
  let ret = null;
  if (subjects.includes(sub.source.name)) {
    // ret = interpolateGreys(subjectScale(subjects.indexOf(sub.source.name)));
    ret = interpolateRainbow(subjectScale(subjects.indexOf(sub.source.name)));
  } else if (area.includes(sub.target.name)) {
    if (sub.source.name === '$Successful Campaigns') {
      ret = interpolateBlues(areaScale(area.indexOf(sub.target.name)));
    } else {
      ret = interpolateGreens(areaScale(area.indexOf(sub.target.name)));
    }
  } else if (sub.source.name === '$Successful Campaigns') {
    ret = interpolateBlues(povertyScale(povertyLevel.indexOf(sub.target.name)));
  } else {
    ret = interpolateGreens(povertyScale(povertyLevel.indexOf(sub.target.name)));
  }
  return ret;
}

const description = 'Description: All data is tracked by DonorsChoose.org, an online ' +
'charity that makes it easy to help students in need through school donations.' +
'The dataset visualized contains over 60,000 entries.' +
'This visualization helps illustrate the relationship between some of the variables and campaign success.' +
' (top-left) Diagram showing the flows of funding campaign outcomes mapped to the metropolitan area in ' +
'which the schools are situated.  (bottom-left) Diagram showing the flows of funding campaign ' +
'outcomes mapped to the poverty level of the school. (right) Diagram showing the flows of ' +
'subject area emphasis in schools mapped to the different poverty levels of the school.';

export function getWrappedText(width, textSize) {
  const words = description.split(/\s+/);
  const lines = [];
  let line = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${textSize}px Arial`;
  let currWidth = 0;
  let currLine = '';
  words.forEach((word) => {
    line.push(word);
    currLine = line.join(' ');
    currWidth = ctx.measureText(currLine).width;
    if (currWidth > width) {
      lines.push(currLine);
      line.pop();
      line = [];
    }
  });
  lines.push(currLine);
  return lines;
}
