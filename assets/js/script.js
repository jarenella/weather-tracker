var boxes = $("#boxes");
var input = $("#input");
var button = $("#button");
var disappearBox = $("#disappearing-box");
var overlayBoxes = $("#overlay-boxes");

//decides what emoji to use based on the conditions
function determineEmoji(cond) {
    if (cond.indexOf("rain") >= 0) {
        var cond = cond + " 🌧️";
    }
    else if (cond.indexOf("cloud") >= 0) {
        var cond = cond + " ⛅";
    }
    else if (cond.indexOf("clear") >= 0) {
        var cond = cond + " ☀️";
    }
    else {
        var cond = cond + " ❗"
    }
}

// function to create a new card for a new city
//this will be run after the button to add a new city is clicked
function createNewCard(a, b, c, d, e) {
    boxes.append('<div id="newbox"> <img> <div> <h5 id="cityname"></h5> <p id="conditions"></p> <p id="temp"></p> <p id="humidity"></p> <p id="windspeed"></p> <p id="uv"></p> <div class="see-more-button btn btn-primary">See more</div> </div> </div>');
    var newBox = $("#newbox");
    newBox.attr("class", "card m-3 bg-dark");
    newBox.attr("style", "width: 18rem;");
    newBox.children("div").attr("class", "card-body");
    newBox.children("div").children("h5").attr("class", "card-title text-light");
    newBox.children("div").children("p").attr("class", "card-text text-light");
    //adds text to the card/box title (HAS TO BE DONE AFTER CLASSES ARE ADDED ABOVE)
    newBox.children("div").children("h5").text(a);
    //adds text to the card body
    newBox.children("div").children("#conditions").text(b);
    newBox.children("div").children("#temp").text(c);
    newBox.children("div").children("#humidity").text(d);
    newBox.children("div").children("#windspeed").text(e);
    //var nameVal = a;
    //adds an onclick listener for the SEE MORE buttons on the new cards
    //every button has it's own individual listener, because of the .val(a), which is where the name of the city is put into this function, and this function is being played in a loop lower in the code
    newBox.children("div").children("h5").val(a).siblings("div").on("click", function() {
        //when the button is clicked, the following code will run, fetching API for future date's weather
        fetch ('https://api.openweathermap.org/data/2.5/forecast/?q='+a+'&units=metric&appid=bc5229c1b510bdc843c547a4fcec0cf4')
        .then(response => response.json())
        .then(data => { 
            var dailyData = [];
            //this for loop looks through all the data and only gets the data for the days at noon UTC, so we only get one result of time per day, as opposed to multiple for the same day
            for (i=0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf("12:00:00") >= 0) {
                    dailyData.push(data.list[i]);
                }
            }
            console.log(dailyData);
            createNewOverlayCard(a + " -- TODAY", b, c, d, e, "");
            //this for loop will determine the emoji to use based on the conditions and create a card for each day of the data
            for (i=0; i < dailyData.length; i++) {
                var dailyDate = dailyData[i].dt_txt;
                var dailyTemp = dailyData[i].main.temp;
                var dailyCond = dailyData[i].weather[0].description;
                var dailyHum = dailyData[i].main.humidity;
                var dailyWind = dailyData[i].wind.speed;
                if (dailyCond.indexOf("rain") >= 0) {
                    dailyCond = dailyCond + " 🌧️";
                }
                else if (dailyCond.indexOf("cloud") >= 0) {
                    var dailyCond = dailyCond + " ⛅";
                }
                else if (dailyCond.indexOf("clear") >= 0) {
                    var dailyCond = dailyCond + " ☀️";
                }
                else {
                    var dailyCond = dailyCond + " ❗"
                }
                createNewOverlayCard(a + " -- ", "Conditions: " + dailyCond, "Temperature: " + dailyTemp + " degrees celcius", "Humidity: " + dailyHum + "%", "Wind speed: " + dailyWind + " MPH", dailyDate + " UTC");
            }
        })
    })
    //removes the newbox id so that when the function is run again, this element wont be selected, but the new one created for THAT particular instance
    newBox.attr("id", "");
}

//function to create new OVERLAY cards
//this will run when you click on the card of a specific city and create cards for the next five days
function createNewOverlayCard(a, b, c, d, e, f) {
    overlayBoxes.append('<div id="newbox"> <img> <div> <a href="#" class="close-button btn btn-danger">Close</a> <h5 id="cityname"></h5> <p id="conditions"></p> <p id="temp"></p> <p id="humidity"></p> <p id="windspeed"></p> <p id="uv"></p> </div> </div>');
    var newBox = $("#newbox");
    newBox.attr("class", "card m-3 bg-dark");
    newBox.attr("style", "width: 18rem;");
    newBox.children("div").attr("class", "card-body");
    newBox.children("div").children("h5").attr("class", "card-title text-light");
    newBox.children("div").children("p").attr("class", "card-text text-light");
    //adds text to the card/box title (HAS TO BE DONE AFTER CLASSES ARE ADDED ABOVE)
    newBox.children("div").children("h5").text(a + f);
    //adds text to the card body
    newBox.children("div").children("#conditions").text(b);
    newBox.children("div").children("#temp").text(c);
    newBox.children("div").children("#humidity").text(d);
    newBox.children("div").children("#windspeed").text(e);
    //removes the newbox id so that when the function is run again, this element wont be selected, but the new one created for THAT particular instance
    newBox.attr("id", "");
    //hides the old boxes so the new ones can be shown
    boxes.attr("class", "hidden");
    //closes the overlay boxes and reopens the new ones when the "close" button is clicked
    $(".close-button").on("click", function() {
        overlayBoxes.children().remove();
        boxes.attr("class", "d-flex justify-content-center flex-wrap");
    })
}

//when the page is loaded, if there is a city name in the local storage, this will use that name to fetch data for that city and create the cards
if (localStorage.length > 0) {
    disappearBox.attr("class", "hidden");
    for (i = 0; i < localStorage.length; i++) {
        fetch ('https://api.openweathermap.org/data/2.5/weather?q='+localStorage.key(i)+'&units=metric&appid=bc5229c1b510bdc843c547a4fcec0cf4')
            .then(response => response.json())
            .then(data => {
                var nameVal = data["name"];
                var conditionsVal = data["weather"][0]["description"];
                var tempVal = data["main"]["temp"];
                var humidityVal = data["main"]["humidity"];
                var windSpeedVal = data["wind"]["speed"];
                //decides what emoji to use based on the conditions
                if (conditionsVal.indexOf("rain") >= 0) {
                    var conditionsVal = conditionsVal + " 🌧️";
                }
                else if (conditionsVal.indexOf("cloud") >= 0) {
                    var conditionsVal = conditionsVal + " ⛅";
                }
                else if (conditionsVal.indexOf("clear") >= 0) {
                    var conditionsVal = conditionsVal + " ☀️";
                }
                else {
                    var conditionsVal = conditionsVal + " ❗"
                }
                //creates the new card
                createNewCard(nameVal, "Conditions: " + conditionsVal,"Temperature: " + tempVal + " degrees celcius", "Humidity: " + humidityVal + "%", "Wind speed: " + windSpeedVal + " MPH");
            })
        .catch()
    }
}

//when the button is clicked, we call the API for the city the user input
button.on("click", function() {
    fetch ('https://api.openweathermap.org/data/2.5/weather?q='+input.val()+'&units=metric&appid=bc5229c1b510bdc843c547a4fcec0cf4')
        .then(response => response.json())
        .then(data => {
            var nameVal = data["name"];
            var conditionsVal = data["weather"][0]["description"];
            var tempVal = data["main"]["temp"];
            var humidityVal = data["main"]["humidity"];
            var windSpeedVal = data["wind"]["speed"];
            //decides what emoji to use based on the conditions
            if (conditionsVal.indexOf("rain") >= 0) {
                var conditionsVal = conditionsVal + " 🌧️";
            }
            else if (conditionsVal.indexOf("cloud") >= 0) {
                var conditionsVal = conditionsVal + " ⛅";
            }
            else if (conditionsVal.indexOf("clear") >= 0) {
                var conditionsVal = conditionsVal + " ☀️";
            }
            else {
                var conditionsVal = conditionsVal + " ❗"
            }
            //creates the new card
            createNewCard(nameVal, "Conditions: " + conditionsVal,"Temperature: " + tempVal + " degrees celcius", "Humidity: " + humidityVal + "%", "Wind speed: " + windSpeedVal + " MPH");
            //adds city name to the local storage
            localStorage.setItem(""+nameVal+"", nameVal);
        })
    .catch(response => alert("This city couldn't be found. Be sure to check your spelling as well as spacing between words and try again"))
    disappearBox.attr("class", "hidden");
})








