var boxes = $("#boxes");

// function to create a new card for a new city
//this will be run after the button to add a new city is clicked
function createNewCard() {
    boxes.append('<div id="newbox"> <img> <div> <h5></h5> <p></p> </div> </div>');
    var newBox = $("#newbox");
    newBox.attr("class", "card m-3 bg-dark");
    newBox.attr("style", "width: 18rem;");
    newBox.children("div").attr("class", "card-body");
    newBox.children("div").children("h5").attr("class", "card-title text-light");
    newBox.children("div").children("p").attr("class", "card-text text-light");
    //adds text to the card/box title (HAS TO BE DONE AFTER CLASSES ARE ADDED ABOVE)
    newBox.children("div").children("h5").text("test");
    //adds text to the card body
    newBox.children("div").children("p").text("test2");
    //removes the newbox id so that when the function is run again, this element wont be selected, but the new one created for THAT particular instance
    newBox.attr("id", "")
}

createNewCard();