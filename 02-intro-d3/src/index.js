import * as d3 from 'd3';

d3.select("body")
    .append("svg")
    .attr("class", "mes-svg")
    .attr("width", 1200)
    .attr("height", 700)

const cercle1 = d3.select(".mes-svg")
    .append("svg")
    .append("circle")
    .attr("id", "cercles")
    .attr("class", "cercle1")
    .attr("cx", "50")
    .attr("cy", "50")
    .attr("r", "40")
    .attr("fill", "black");

const cercle2 = d3.select(".mes-svg")
    .append("svg")
    .append("circle")
    .attr("id", "cercles")
    .attr("class", "cercle2")
    .attr("cx", "150")
    .attr("cy", "150")
    .attr("r", "40")
    .attr("fill", "black");

const cercle3 = d3.select(".mes-svg")
    .append("svg")
    .append("circle")
    .attr("id", "cercles")
    .attr("class", "cercle3")
    .attr("cx", "250")
    .attr("cy", "250")
    .attr("r", "40")
    .attr("fill", "black")


cercle2.attr("fill", "blue");
cercle1.attr("cx", "100");
cercle2.attr("cx", "200");

//au click, aligner verticalement
let cx = 300;
const svg = d3.select(".mes-svg");
const cercle = svg.select(".cercle3")
    .attr("cx", cx)
cercle.on("click", () => {
    cx = cx;
    cercle.attr("cx", cx);
    cercle2.attr("cx", cx);
    cercle1.attr("cx", cx);
})

//dessiner rectangle avec données fournies
const data = [20, 5, 25, 8, 15]

d3.select("body")
    .append("div")
    .attr("class", "div-rect")

const svgRect = d3.select(".div-rect")
    .append("svg")
    .attr("class", "svg-rect")
    .attr("width", 200)
    .attr("height", 100)

svgRect.selectAll(".svg-rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "rects")
    .attr("x", (d, i) => i * 30)
    .attr("y", (d, i) => parseInt(svgRect.attr("height")) - d)
    .attr("width", 20)
    .attr("height", (d => d))

// console.log(svgRect.attr("height"));

    
//text sur cercle
d3.selectAll('circle')
    .each(function () {
        d3.select(this.parentNode).append("text")
            .text('Circle')
            .attr("class", "text-circle")
            .attr("x", d3.select(this.parentNode).node().getBBox().width - 60)
            .attr("y", d3.select(this.parentNode).node().getBBox().height)
    })