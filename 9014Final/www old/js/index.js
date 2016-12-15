"use strict"; //needed for the mobile browser

let standings = [];

if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady);
}
else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}
// main initialization function
function onDeviceReady() {
    console.log("Ready!");
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

    standings = []; // empty the standings array

    // Create the standings array keys for each team
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

    // tables stuff here:
    let results = document.getElementById("scores");
    results.innerHTML = "";
    let tbody = document.querySelector("#standings");
    tbody.innerHTML = "";
    // create list items for each match in the schedule
    data.scores.forEach(function (value) {

     
        let homeTeam = null;
        let awayTeam = null;

        //Tables stuff here:
        let df = new DocumentFragment();

        let date = value.date;
        let datetime = new Date(date);
        let t = document.createElement("time");
        t.className = "gameday"
        t.textContent = date;
        t.setAttribute("datetime", datetime.getUTCDate());
        df.appendChild(t);

        // for each game calculate the standings and create the HTML for the schedule with the correct data
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


            //Tables stuff here:
//
//            let dg = document.createElement("div");
//            dg.className = "game";
//
//            let home = document.createElement("div");
//            home.classList.add("team");
//            home.classList.add("home");
//            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";
//
//            let away = document.createElement("div");
//            away.classList.add("team");
//            away.classList.add("away");
//            away.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";
//
//            dg.appendChild(home);
//            dg.appendChild(away);
//            df.appendChild(dg);


        });

 
        //Tables stuff here:
 //       results.appendChild(df);

    });

    // we now have standings data ready to be displayed
    console.log(standings);

    // sort the standings data based on total points highest first
    standings.sort(function (a, b) {
        return b.points - a.points;
    });


    
    
    // for each team create the HTML for the standings with the correct data
    standings.forEach(function (value) {

      
        //Tables stuff here:

        let tr = document.createElement("tr");
        let tdn = document.createElement("td");
        tdn.textContent = getTeamName(data.teams, value.id);
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


//function displayData(data) {
//    console.log(data);
//    localStorage.setItem("scores", JSON.stringify(data));
//    //    var myScoreData = 
//    //        JSON.parse(localStorage.getItem("scores"));
//    //    console.log("From LS: ");
//    //    console.log(myScoreData);
//    console.log(data.teams);
//    console.log(data.scores);
//    //get our schedule unordered list
//    let information = document.querySelector(".results_list");
//    let table = document.createElement("table");
//    let tbody = document.querySelector("#standings");
//    tbody.innerHTML = "";
//    // create list items for each match in the schedule
//    data.scores.forEach(function (value) {
//        console.log(data);
//        
//       
//        value.games.forEach(function (item) {
//            let tr = document.createElement("tr");
//            let tdn = document.createElement("td");
//            
//            console.log(value);
//            tdn.textContent = getTeamName(data.teams, item.id);
//            
//            let tdw = document.createElement("td");
//            tdw.textContent = value.W;
//            let tdl = document.createElement("td");
//            tdl.textContent = value.L;
//            let tdt = document.createElement("td");
//            tdt.textContent = value.T;
//            let tdp = document.createElement("td");
//            tdp.textContent = value.points;
//            tr.appendChild(tdn);
//            tr.appendChild(tdw);
//            tr.appendChild(tdl);
//            tr.appendChild(tdt);
//            tr.appendChild(tdp);
//            tbody.appendChild(tr);
//            // let tr = document.createElement("tr");
//            // let td = document.createElement("td");
//            //            td.textContent = getTeamName(data.teams, value.id);
//            //            
//            //            console.log(tr + td);
//            //            console.log(homeTeam);
//            //            td.appendChild(homeTeam);
//            //            td.appendChild(item.home_score);
//            //            td.appendChild(awayTeam);
//            //            td.appendChild(item.away_score);
//            //            tr.appendChild(td);
//            //            td.appendChild(homeTeam);
//        });
//        //            console.log(table + "table")
//        information.appendChild(table);
//    });
//}

function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "unknown";
}

function calculateStandings(id, result) {

    let win = 2; //  using this for Quidditch
    let tie = 1; 
  

    standings.forEach(function (value) {
        if (value.id == id) {

            switch (result) {

            case "W":
                value.points += win;
                value.W++;
                break;

            case "L":
                value.L++;
                break;

            case "T":
                value.points += tie;
                value.T++;
                break;

            default:
                console.log("calculateStandings ERROR");
                break;

            }
        }
    });
}