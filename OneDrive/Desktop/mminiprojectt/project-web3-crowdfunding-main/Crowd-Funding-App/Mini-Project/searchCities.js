var OUR_DATA = [];
var data;
var myCity;

$(document).ready(function () {
    GetCitiesData();
})

function GetCitiesData() {
    $.get({
        method: "GET",
        url: "http://localhost:3000/cities/",
        dataType: "json",
        success: function (result) {
            console.log("Result" + result);
            var TEMP_DATA = JSON.stringify(result);
            console.log("Temp data " + TEMP_DATA);
            OUR_DATA = JSON.parse(TEMP_DATA);
            console.log(OUR_DATA);
            for (var i = 0; i < OUR_DATA.length; i++) {
                data = OUR_DATA[i];
                console.log("Individual data" + data);
                $("#listPopulate").append(
                    `<tr><td id="city_list">${data.city}</td></tr>`
                )
            }
        }
    })
}

function findCity(e) {
    /* $("#CustList").empty(); */

    if (e.code === "Enter") {
        console.log(myCity);
        $('#inputSearch').val('');
        $("#cityPopulate").empty();

        $.get({
            method: "GET",
            url: "http://localhost:3000/cities/" + myCity,
            dataType: "json",
            success: function (result) {

                var TEMP_DATA = JSON.stringify(result);
                OUR_DATA = JSON.parse(TEMP_DATA);

                $("#cityPopulate").append(
                    `<h2 class="up">${OUR_DATA.city}</h2><br>
                         <a href="" target="_blank"><img src=${OUR_DATA.img} /></a><br>
                         <p id="desc">${OUR_DATA.description}</p>`
                )
            },
            error: function () {
                $("#cityPopulate").append(
                    `<h2 id="no_desc">No Result Found</h2>`
                )
            }

        })
    }

}

function storeCity(t) {
    var dInput = t.value;
    myCity = dInput.toLowerCase();
}

$("#btn_close").click(function(){
    $("#cityPopulate").empty();
})