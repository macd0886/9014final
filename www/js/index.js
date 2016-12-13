"use strict"; //needed for the mobile browser

let pages = []; 
let links = []; 
let standings = [];
let teamImages = {
    'GRYFFINDOR' : "<img src='img/G.png'></img>",
    'HUFFLEPUFF' : "<img src='img/H.png'></img>",
    'RAVENCLAW' : "<img src='img/R.png'></img>",
    'SLYTHERIN' : "<img src='img/S.png'></img>"
};

if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady);
}
else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}
// main initialization function
function onDeviceReady() {
    console.log("Ready!");
     pages = document.querySelectorAll('[data-role="page"]');

    links = document.querySelectorAll('[data-role="nav"] a');
    
     for(let i=0; i<links.length; i++) {
        links[i].addEventListener("click", navigate);
    }
    serverData.getJSON();
}
document.addEventListener("DOMContentLoaded", function () {
    serverData.getJSON();
});


let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php"
    , httpRequest: "GET"
    , getJSON: function () {
        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();
        // Add a header(s)
        // key value pairs sent to the server
        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));
        // Now the best way to get this data all together is to use an options object:
        // Create an options object
        let options = {
            method: serverData.httpRequest
            , mode: "cors"
            , headers: headers
        };
        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);
        fetch(request).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            console.log(data); // now we have JS data, let's display it
            // Call a function that uses the data we recieved  
            displayData(data);
        }).catch(function (err) {
            alert("Error: " + err.message);
        });
    }
};


function displayData(data) {
    console.log("processData: " + data);

    console.log(data.teams);

    standings = []; // empty the standings

    // Create the standings array keys for each team, from Tony
    data.teams.forEach(function (value) {
        let team = {
            id: value.id,
            points: 0,
            W: 0,
            L: 0,
            T: 0
        };
        standings.push(team);
    });

    
    let results = document.getElementById("results");
    results.innerHTML = "";
    let tbody = document.querySelector("#teamStandings tbody");
    tbody.innerHTML = "";
    // create list items for each game in the schedule
    data.scores.forEach(function (value) {

     
        let homeTeam = null;
        let awayTeam = null;

        //Tables: Tony showed how to use this
        let df = new DocumentFragment();

        let date = value.date;
        let datetime = new Date(date);
        let t = document.createElement("time");
        t.className = "gameday"
        t.textContent = date;
        t.setAttribute("datetime", datetime.getUTCDate());
        df.appendChild(t);

  // process each game
        value.games.forEach(function (item) {

            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);

            if (item.home_score > item.away_score) {
                calculateStandings(item.home, "W");
                calculateStandings(item.away, "L");
            } else if (item.home_score < item.away_score) {
                calculateStandings(item.home, "L");
                calculateStandings(item.away, "W");
            } else {
                calculateStandings(item.home, "T");
                calculateStandings(item.away, "T");
            }


            //Table:

            let dg = document.createElement("div");
            dg.className = "game";

            let home = document.createElement("div");
            home.classList.add("team");
            home.classList.add("home");
            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";

            let away = document.createElement("div");
            away.classList.add("team");
            away.classList.add("away");
            away.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";

            dg.appendChild(home);
            dg.appendChild(away);
            df.appendChild(dg);


        });

 
        //Table:
        results.appendChild(df);

    });


    standings.forEach(function (value) {

        //Update the table:

        let tr = document.createElement("tr");
        let tdn = document.createElement("td");
        tdn.innerHTML = getTeamName(data.teams, value.id);
        let tdw = document.createElement("td");
        tdw.textContent = value.W;
        let tdl = document.createElement("td");
        tdl.textContent = value.L;
        let tdt = document.createElement("td");
        tdt.textContent = value.T;
        let tdp = document.createElement("td");
        tdp.textContent = value.points;
        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);

    });
}


function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return  teamImages [teams[i].name.toUpperCase()] + teams[i].name;
        }
    }
    return "unknown team";
}

function calculateStandings(id, result) {
 

    standings.forEach(function (value) {
        if (value.id == id) {

            switch (result) {

            case "W":
                value.points += 2;
                value.W++;
                break;

            case "L":
                value.L++;
                break;

            case "T":
                value.points += 1;
                value.T++;
                break;

            default:
                console.log("ERROR");
                break;

            }
        }
    });
}

// from codepen
function navigate(ev) {
    ev.preventDefault();

    let link = ev.currentTarget;
    let id = link.href.split("#")[1];
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);
    
    for(let i=0; i<pages.length; i++) {
        if(pages[i].id == id){
             pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }           
    }
}