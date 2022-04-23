import * as d3 from 'd3'
import { interval } from 'd3'

// Pour importer les données
import gdp from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import lifeExpectancy from '../data/life_expectancy_years.csv'
import population from '../data/population_total.csv'
/* import dataCoord from '../data/dataCoord.geojson' */

d3.select('body').append('h1').text('Exercice 4')
/////////////////////////////////////////////////////////////// EXERCICE 1
//TITRE
d3.select('body').append('h3').text('Graphique Statique')

d3.select("body")
    .append("div")
    .attr('id', 'graph')

let margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Générer une taille d'axe X cohérente
let theBiggestGDP = 0;
gdp.forEach(pays => {
    let gdpAnneeCourante = pays['2021'];
    if (typeof gdpAnneeCourante === 'string') {
        gdpAnneeCourante = strToInt(pays['2021']);
    }
    pays['2021'] = gdpAnneeCourante;

    if (pays['2021'] >= theBiggestGDP) {
        theBiggestGDP = pays['2021'];
    }
});

// Add X axis
let x = d3.scaleLinear()
    .domain([0, theBiggestGDP * 1.05])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Générer une taille d'axe Y cohérente
let theBiggestLifeExp = 0;
let theSmallestLifeExp = 0;
lifeExpectancy.forEach(pays => {
    if (pays['2021'] >= theBiggestLifeExp) {
        theBiggestLifeExp = pays['2021'];
    }
    theSmallestLifeExp = theBiggestLifeExp;
    if (pays['2021'] <= theSmallestLifeExp) {
        theSmallestLifeExp = pays['2021'];
    }
    if (pays['2021'] === null && pays['2020'] !== null) {
        pays['2021'] = pays['2020'];
    } else if (pays['2021'] === null && pays['2020'] === null) {
        pays['2021'] = pays['2019'];
    }
})

// Add Y axis
let y = d3.scalePow()
    .exponent(1.5)
    .domain([0, theBiggestLifeExp * 1.1])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

population.forEach(pays => {
    let popAnneeCourante = pays['2021'];
    if (typeof popAnneeCourante === 'string') {
        popAnneeCourante = strToInt(pays['2021']);
    }
    pays['2021'] = popAnneeCourante;
});

// Add a scale for bubble size
let z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([5, 60]);

// Add dots
svg.append('g')
    .selectAll("dot")
    .data(gdp)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d["2021"]); })
    .attr("r", 10)
    .style("fill", `#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .style("opacity", "0.7")
    .attr("stroke", "black")

svg.selectAll("circle").data(lifeExpectancy).join()
    .attr("cy", function (d) { return y(d["2021"]); })

svg.selectAll("circle").data(population).join()
    .attr("r", function (d) { return z(d["2021"]); })

function strToInt(nb) {
    let multi;
    let number
    if (nb.slice(-1) === 'k') {
        multi = 1000;
        // console.log(gdpAnneeCourante + " ; c'est un k");
        number = nb.split('k')[0];
    } else if (nb.slice(-1) === 'M') {
        multi = 1000000;
        // console.log("c'est un M");
        number = nb.split('M')[0];
    } else if (nb.slice(-1) === 'B') {
        multi = 1000000000;
        // console.log("c'est un M");
        number = nb.split('B')[0];
    } else {
        // console.log('ça beug');
    }
    number = parseInt(number * multi);
    return number;
};

//////////////////////////////////////////////EXERCICE 2
//Carte choroplète
d3.select('body').append('h3').text('Carte Choroplète')

let svgChoro = d3.select('body').append('svg').attr('width', '1000').attr('height', '600'),
    widthChoro = +svgChoro.attr("width"),
    heightChoro = +svgChoro.attr("height");

let projectionChoro = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([widthChoro / 2, heightChoro / 2]);

// Data and color scale
let colorScaleChoro = d3.scaleThreshold()
    .domain([50, 60, 70, 80, 90, 100])
    .range(randomScheme()[7]);

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (d) {
    // Draw the map
    svgChoro.append("g")
        .selectAll("path")
        .data(d.features)
        .join("path")
        .attr("fill", function (d) {
            let color = ''
            lifeExpectancy.forEach(pays => {
                if (pays['country'] == d.properties.name) {
                    color = colorScaleChoro(pays['2021'])
                }
            })
            return color
        })
        .attr("d", d3.geoPath()
            .projection(projectionChoro)
        )
})

function randomScheme() {
    switch (Math.floor(Math.random() * 5)) {
        case 0:
            return d3.schemeOranges
        case 1:
            return d3.schemeBlues
        case 2:
            return d3.schemeYlOrRd
        case 3:
            return d3.schemeRdPu
        case 4:
            return d3.schemeReds
    }
}

/////////////////////////////////////////EXERCICE 3

// CODE DONNÉ POUR L'EXERCICE :

// Récupère toutes les années
const annees = Object.keys(population[0])

let pop = [],
    income = [],
    life = [],
    dataCombined = [];

// Merge data
const mergeByCountry = (a1, a2, a3) => {
    let data = [];
    a1.map(itm => {
        let newObject = {
            ...a2.find((item) => (item.country === itm.country) && item),
            ...a3.find((item) => (item.country === itm.country) && item),
            ...itm
        }
        data.push(newObject);
    })
    return data;
}

annees.forEach(annee => {
    pop.push({ "annee": annee, "data": converterSI(population, annee, "pop") })
    income.push({ "annee": annee, "data": converterSI(gdp, annee, "income") })
    life.push({ "annee": annee, "data": converterSI(lifeExpectancy, annee, "life") })
    const popAnnee = pop.filter(d => d.annee == annee).map(d => d.data)[0];
    const incomeAnnee = income.filter(d => d.annee == annee).map(d => d.data)[0];
    const lifeAnnee = life.filter(d => d.annee == annee).map(d => d.data)[0];
    dataCombined.push({ "annee": annee, "data": mergeByCountry(popAnnee, incomeAnnee, lifeAnnee) })
});

function converterSI(array, variable, variableName) {
    let convertedVariable = array.map(d => {
        // Trouver le format SI (M, B, k)
        let SI = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? d[variable.toString()].slice(-1) : d[variable.toString()];
        // Extraire la partie numérique
        let number = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? parseFloat(d[variable.toString()].slice(0, -1)) : d[variable.toString()];
        // Selon la valeur SI, multiplier par la puissance
        switch (SI) {
            case 'M': {
                return { "country": d.country, [variableName]: Math.pow(10, 6) * number };
            }
            case 'B': {
                return { "country": d.country, [variableName]: Math.pow(10, 9) * number };
            }
            case 'k': {
                return { "country": d.country, [variableName]: Math.pow(10, 3) * number };
            }
            default: {
                return { "country": d.country, [variableName]: number };
            }
        }
    })
    return convertedVariable;
};

//TRAVAIL PERSONNEL

d3.select('body').append('h3').text('Graphique Animé')

d3.select("body")
    .append("div")
    .attr('id', 'graphA')

let marginA = { top: 10, right: 20, bottom: 30, left: 50 },
    widthA = 1000 - marginA.left - marginA.right,
    heightA = 600 - marginA.top - marginA.bottom;

let svgA = d3.select("#graphA")
    .append("svg")
    .attr("width", widthA + marginA.left + marginA.right)
    .attr("height", heightA + marginA.top + marginA.bottom)
    .append("g")
    .attr("transform", "translate(" + marginA.left + "," + marginA.top + ")")

// Générer une taille d'axe X cohérente
let theBiggestGDPA = 0;
dataCombined.forEach(annee => {
    if (annee.annee <= '2022') {
        annee.data.forEach(pays => {
            if (pays.income >= theBiggestGDPA) theBiggestGDPA = pays.income
        })
    }
})

//Ajouter X
let xA = d3.scaleSqrt()
    .domain([0, theBiggestGDPA])
    .range([0, widthA]);
svgA.append("g")
    .attr("transform", "translate(0," + heightA + ")")
    .call(d3.axisBottom(xA));

// Générer une taille pour Y
let theBiggestLifeExpA = 0;
dataCombined.forEach(annee => {
    annee.data.forEach(pays => {
        if (pays.life >= theBiggestLifeExpA) {
            theBiggestLifeExpA = pays.life
        }
    })
})

//Ajouter Y
let yA = d3.scalePow()
    .exponent(1.25)
    .domain([0, theBiggestLifeExpA * 1.1])
    .range([heightA, 0]);
svgA.append('g')
    .call(d3.axisLeft(yA))

// Add a scale for bubble size
let zA = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([5, 60]);

//Créer le bouton de lancement d'animation
let buttonA = d3.select('#graphA')
    .append('svg')
    .attr("width", widthA + marginA.left + marginA.right)
    .attr("height", 100)
    .attr('class', 'button')
    .append('g')
    .append('circle')
    .attr('cx', '50')
    .attr('cy', '50')
    .attr('r', '40')
    .attr('fill', 'grey')

d3.select('.button').append('text').attr('class', 'afficheAnnee').text('1800').attr('transform', 'translate(100,62.5)')
    .attr('font-size', 40).attr('font-family', 'helvetica')

let clicked = false
buttonA.on('click', () => {
    if (clicked) {
        stop()
        clicked = false
    } else {
        animate()
        clicked = true
    }
})

//Gestion de l'affichage du texte
let indexAnnee = -1
function play() {
    if (indexAnnee >= 222) {
        indexAnnee = 0
    } else {
        indexAnnee++
    }

    let anneePause = dataCombined[indexAnnee].annee
    d3.select('.afficheAnnee').text(anneePause)
    updateData(dataCombined[indexAnnee])
}

function stop() {
    clearInterval(intervalId)
    intervalId = null
}

//Gestion intervalle d'animation
let intervalId
function animate() {
    if (!intervalId) intervalId = setInterval(play, 50)
}

// Mise à jour des infos
function updateData(annee) {
    svgA.selectAll('circle')
        .data(annee.data)
        .join(enter => enter.append('circle')
            .style('fill', `#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .attr('stroke', 'black')
            .style("opacity", "0.7")
            .attr('cx', function (d) { return xA(d.income) })
            .attr('cy', function (d) { return yA(d.life) })
            .attr('r', function (d) { return zA(d.pop) }),
            update => update.attr('cx', function (d) { return xA(d.income) })
                .attr('cy', function (d) { return yA(d.life) })
                .attr('r', function (d) { return zA(d.pop) }),
            exit => exit.remove()
        )
}