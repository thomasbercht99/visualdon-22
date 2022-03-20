// https://jsonplaceholder.typicode.com/users
// https://jsonplaceholder.typicode.com/posts

import * as d3 from 'd3';
import { json } from 'd3-fetch';

Promise.all([
    json('https://jsonplaceholder.typicode.com/posts'),
    json('https://jsonplaceholder.typicode.com/users')
])

    // * A partir des données **users** et **posts**, créez un tableau d'objets qui a la structure suivante
    // [
    //     {
    //       nom_utilisateur: 'Machin',
    //       ville: 'Truc',
    //       nom_companie: 'Bidule',
    //       titres_posts: [
    //         'Titre 1',
    //         'Titre 2',
    //       ]
    //     },
    //     // ...
    //   ]
    .then(([postsTab, usersTab]) => {
        let arrayUserPost = [];
        for (let i = 0; i < usersTab.length; i++) {
            let arrayCurrentUser = {};
            arrayCurrentUser["nom_utilisateur"] = usersTab[i].username;
            arrayCurrentUser["ville"] = usersTab[i].address.city;
            arrayCurrentUser["nom_companie"] = usersTab[i].company.name;

            let userPosts = [];
            postsTab.forEach(post => {
                if (post.userId == usersTab[i].id) {
                    userPosts.push(post.title)
                }
            });
            arrayCurrentUser["posts"] = userPosts;
            arrayUserPost.push(arrayCurrentUser);
            // console.log(arrayCurrentUser);
        }
        // console.log(arrayUserPost);

        // *********************************************************
        let graphPosts = []; // pour les besoins de la dernière partie.
        // *********************************************************
        // * Calculez le nombre de **posts** par **user**
        d3.select("body")
            .append("div")
            .attr('id', `div-users`)
            .attr("font-weight", "bold")

        usersTab.forEach(user => {
            let compteurParUser = 0;
            // console.log(user.name);

            postsTab.forEach(post => {
                // console.log(post.userId);
                if (post.userId == user.id) {
                    compteurParUser++;
                }
            })
            graphPosts.push(compteurParUser);
            d3.select(`#div-users`)
                .append('div')
                .attr('id', user.id)
                .append('p')
                .text(`${user.name} a écrit ${compteurParUser} article(s).`)
                .attr("font-weight", "bold") 

        })

        // *********************************************************
        // * Trouvez le **user** qui a écrit le texte le plus long dans **posts.body**
        let postLePlusLong = 'abc';
        let postLePlusLongUserId = 0;
        console.log(postsTab);
        postsTab.forEach(post => {
            // console.log(post.body.length);
            if (postLePlusLong.length < post.body.length) {
                postLePlusLong = post.body;
                postLePlusLongUserId = post.userId
            }
        })
        console.log(postLePlusLong);
        console.log(postLePlusLongUserId);
        let userPostLePlusLong = usersTab[postLePlusLongUserId - 1].name;

        d3.select("body")
            .append("div")
            .attr('id', 'postLePlusLong')
        d3.select('#postLePlusLong')
            .append('p')
            .text(`${userPostLePlusLong} a écrit le plus long post. C'était "${postLePlusLong}".`)

        // *********************************************************
        // * Dessinez un graphique en bâton en ayant sur l'axe *x* les utilisateurs et *y* le nombre de posts

        let margin = { top: 20, right: 10, bottom: 60, left: 60 };
        let width = 1500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        d3.select("body")
            .append("div")
            .attr('id', 'graph')
            
        let svg = d3.select("#graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let x = d3.scaleBand()
            .domain(arrayUserPost.map(function (d) { return d["nom_utilisateur"]; }))
            .range([1000, 0]);

        let y = d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("font-weight", "bold")
            .attr("font-size", "12px")

            .attr("transform", "translate(-2,10)")

        svg.selectAll("bars")
            .data(arrayUserPost)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d["nom_utilisateur"]) + 20; })
            .attr("y", function (d) { return y(d["posts"].length); })
            .attr("width", "60px")
            .attr("height", function (d) { return height - y(d["posts"].length); })
            .attr("fill", `#2d4680`)
    })