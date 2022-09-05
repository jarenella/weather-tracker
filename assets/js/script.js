var boxes = $("#boxes");
var input = $("#input");
var button = $("#button");
var disappearBox = $("#disappearing-box");

// function to create a new card for a new city
//this will be run after the button to add a new city is clicked
function createNewCard(a, b, c, d, e) {
    boxes.append('<div id="newbox"> <img> <div> <h5 id="cityname"></h5> <p id="conditions"></p> <p id="temp"></p> <p id="humidity"></p> <p id="windspeed"></p> <p id="uv"></p> </div> </div>');
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
    //removes the newbox id so that when the function is run again, this element wont be selected, but the new one created for THAT particular instance
    newBox.attr("id", "")
}

//when the page is loaded, if there is a city name in the local storage, this will use that name to fetch data for that city and create the cards
if (localStorage.length > 0) {
    disappearBox.attr("class", "hidden");
    for (i = 0; i < localStorage.length; i++) {
        fetch ('https://api.openweathermap.org/data/2.5/weather?q='+localStorage.key(i)+'&appid=bc5229c1b510bdc843c547a4fcec0cf4')
            .then(response => response.json())
            .then(data => {
                var nameVal = data["name"];
                var conditionsVal = data["weather"][0]["description"];
                //converts temp from k to c
                var temp = data["main"]["temp"] - 273.15;
                var tempVal = +temp.toFixed(2);
                var humidityVal = data["main"]["humidity"];
                var windSpeedVal = data["wind"]["speed"];
                //creates the new card
                createNewCard(nameVal, "Conditions: " + conditionsVal,"Temperature: " + tempVal + " degrees celcius", "Humidity: " + humidityVal + "%", "Wind speed: " + windSpeedVal);
            })
        .catch()
    }
}

//when the button is clicked, we call the API for the city the user input
button.on("click", function() {
    fetch ('https://api.openweathermap.org/data/2.5/weather?q='+input.val()+'&appid=bc5229c1b510bdc843c547a4fcec0cf4')
        .then(response => response.json())
        .then(data => {
            var nameVal = data["name"];
            var conditionsVal = data["weather"][0]["description"];
            //converts temp from k to c
            var temp = data["main"]["temp"] - 273.15;
            var tempVal = +temp.toFixed(2);
            var humidityVal = data["main"]["humidity"];
            var windSpeedVal = data["wind"]["speed"];
            //creates the new card
            createNewCard(nameVal, "Conditions: " + conditionsVal,"Temperature: " + tempVal + " degrees celcius", "Humidity: " + humidityVal + "%", "Wind speed: " + windSpeedVal);
            //adds city name to the local storage
            localStorage.setItem(""+nameVal+"", nameVal);
        })
    .catch(response => alert("This city couldn't be found. Be sure to check your spelling as well as spacing between words and try again"))
    disappearBox.attr("class", "hidden");
})
