// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
import {keys, nest} from 'd3-collection';
import {csv} from 'd3-fetch';
import {select} from 'd3-selection';
import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
import {getWrappedText, getColors} from './utils';

const height = 2300;
const width = 36 / 24 * height;
const margin = {top: 100, right: 40, bottom: 10, left: 40};
const domReady = require('domready');

domReady(() => {
  Promise.all([
    csv('/data/failed_by_metro.csv'),
    csv('/data/focus_by_poverty.csv'),
    csv('/data/poverty_by_success.csv')
  ])
  .then(([metro, poverty, success]) => {
    myVis(metro, poverty, success);
  });

  addtitle();
  addDescription();

});

function addtitle() {
  const upperMargin = 35;
  const svg = select('.vis-container');
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', (width / 2) + 20)
    .attr('y', 20)
    .attr('font-size', '50px')
    .text('School Fundraising Campaign')
    .attr('transform', `translate(0, ${upperMargin })`);

  svg.append('text')
    .text('Zach Kamran, Min Su Kim, Varshant Dhar')
    .attr('text-anchor', 'middle')
    .attr('x', (width / 2) + 20)
    .attr('y', 20)
    .attr('font-size', '50px')
    .attr('dy', '1em')
    .attr('transform', `translate(0, ${upperMargin})`);

}

function addDescription() {
  const svg = select('.vis-container');
  const textSize = 30;
  const textData = getWrappedText(width / 2 - 250, textSize);
  svg.selectAll('.text').data(textData).enter()
    .append('text')
      .attr('font-size', `${textSize}px`)
      .attr('font', 'Arial')
      .attr('class', 'description-text')
      .attr('x', width / 2 + margin.left * 4)
      .attr('y', d => height - 500)
      .attr('dy', d => `${textData.indexOf(d)}em`)
      .text(d => d);
}

function myVis(data, data2, data3) {
  // The posters will all be 24 inches by 36 inches
  // Your graphic can either be portrait or landscape, up to you
  // the important thing is to make sure the aspect ratio is correct.

  delete data.columns;
  delete data3.columns;

  const svg = select('.vis-container')
    .attr('width', width)
    .attr('height', height);

  sankeyGraph(data, 0);
  sankeyGraph(data3, 1);
  sankeyGraph(data2, 2);

  function sankeyGraph(d1, index) {
    // append the svg canvas to the page

    const sankeySvg = svg.append('g')
      .attr('class', 'sankeyVis')
      .attr('width', width / 3)
      .attr('height', height / 3)
      .attr('transform', `translate(${ index === 2 ? width - margin.right * 4 :
        margin.left * 6},
       ${index === 2 ? margin.top + 100 :
        index === 0 ? ((height / 2) * index) + margin.top * 2 :
        ((height / 2) * index)})
         rotate(${index === 2 ? 90 : 0})`);

    // Set the sankey diagram properties
    const sankeyExtent = index === 2 ? [height / 1.5, (width / 3)] :
      [height / 1.5, (width / 3.5)];

    const sankeyVis = sankey()
      .nodeWidth(275)
      .nodePadding(20)
      .extent([[1, 1], sankeyExtent]);

    // set up graph in same style as original example but empty
    const graph = {nodes: [], links: []};

    d1.forEach(d => {
      graph.nodes.push({name: d.source});
      graph.nodes.push({name: d.target});
      graph.links.push({
        source: d.source,
        target: d.target,
        value: Number(d.value)
      });
    });

    // return only the distinct / unique nodes
    graph.nodes = keys(nest()
        .key(function moveNames(d) {
          return d.name;
        })
        .map(graph.nodes));

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function cleanNodes(d, i) {
      graph.links[i].source = graph.nodes.indexOf(`$${graph.links[i].source}`);
      graph.links[i].target = graph.nodes.indexOf(`$${graph.links[i].target}`);
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function makeObj(d, i) {
      graph.nodes[i] = {name: d};
    });

    // Modify the 'graph' to svg, as given by d3-sankey
    sankeyVis(graph);

    // Get rid of empty nodes
    graph.nodes = graph.nodes.reduce((acc, row) => {
      if (!acc) {
        acc = [];
      } if (row.value !== 0) {
        acc.push(row);
      }
      return acc;
    }, []);

    // add in the links
    sankeySvg.append('g')
      .attr('class', 'links')
      .selectAll('.link')
      .data(graph.links)
      .enter().append('path')
        .attr('class', 'link')
        .attr('stroke', d => getColors(d))
        .attr('d', sankeyLinkHorizontal())
        .attr('opacity', 0.8)
        .attr('fill', 'none')
        .style('stroke-width', d => Math.max(1, d.width));

    // add in the nodes
    const node = sankeySvg.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(graph.nodes)
      .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${ d.x0 },${ d.y0 })`);

    // shadow-box
    // credit where it is due: http://bl.ocks.org/cpbotha/5200394
    const defs = sankeySvg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 5)
      .attr('result', 'blur');

    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 5)
      .attr('dy', 5)
      .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // add the rectangles for the nodes
    node.append('rect')
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', '#cccccc')
      .style('filter', 'url(#drop-shadow)');

    node.append('text')
      .attr('x', d => (d.x1 - d.x0) / 2)
      .attr('y', d => (d.y1 - d.y0) / 2)
      .attr('font-size', '30px')
      .attr('text-anchor', 'middle')
      .text(d => d.name.replace(/\$/g, ''));
  }
}
