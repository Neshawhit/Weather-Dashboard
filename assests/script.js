var cityInfo = document.querySelector("#City-name");
var searchEntry = document.querySelector("#search-entry")
var forecast = document.querySelector("#forecast");
var search = document.querySelector("#search-city")
var searchHistory = document.querySelector("#container");
var searchbtn = document.querySelector("#searchbtn")
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var UVIndex = document.querySelector("#UvIndex");
var cities = []

var loadCities = function () {
  var citiesLoaded = localStorage.getItem("cities")
  if (!citiesLoaded) {
    return false;
  }

  citiesLoaded = JSON.parse(citiesLoaded);

  for (var i = 0; i < citiesLoaded.length; i++) {
    makebtn(citiesLoaded[i])
    cities.push(citiesLoaded[i])
  }
}

var saveCities = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
}

var searchfunction = function (event) {

  event.preventDefault();

  var city = searchEntry.value.trim();

  if (city) {

    getcityInfo(city);

    forecast.textcontent = "";
    forecast.replaceChildren();

    searchEntry.value = "";

  } else {
    alert("Enter an actual city");
  }
};

var getcityInfo = function (city) {
  console.log(city);
  var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",USA&APPID=cfe0b2658aec5af16bf8115cfd986eca";

  // request to url
  fetch(apiURL)
    .then(function (response) {

      if (response.ok) {
        response.json().then(function (data) {
          dashboard(data, city);

        });


        var prevSearch = cities.includes(city)
        if (!prevSearch) {
          cities.push(city)
          saveCities()
          makebtn(city);
        }


      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
    
    });
};

var dashboard = function (data, city) {
  console.log(city)

  cityInfo.innerHTML = city;
  temp.innerHTML = (((data.main.temp) - 273.15) * 9 / 5 + 32).toFixed(1);

  wind.innerHTML = data.wind.deg;
  humidity.innerHTML = data.main.humidity;

  let lon = data.coord.lon;
  let lat = data.coord.lat;

  fivedayforecast(lat, lon)
}

var fivedayforecast = function (lat, lon) {

  var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=cfe0b2658aec5af16bf8115cfd986eca";

  fetch(apiURL)
    .then(function (response) {

      if (response.ok) {

        response.json().then(function (data) {

          UVIndex.innerHTML = data.current.uvi;
          UVIndex.classList.add("UV-green")

          if (data.current.uvi > 2) {
            UVIndex.classList.add("UV-yellow")
          }

          else if (data.current.uvi > 7) {
            UVIndex.classList.add("UV-red")

          }

          forecastresults(data);
        });

      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
 
    });
};
var forecastresults = function (data) {
  console.log(data)

  for (var i = 1; i < 6; i++) {
    var daytoday = data.daily[i]

    var spacerEl = document.createElement('div');
    spacerEl.className = "m-1 w-100";

    //'var weekForecast = document.querySelector(".weekForecast");
    var divtwo = document.createElement("div");
    divtwo.className = "bg-primary text-light p-2 w-100";

    var title = document.createElement("h3");
    var mili = daytoday.dt * 1000;
    var gendate = new Date(mili);
    var date = gendate.toLocaleString("en-US", { weekday: "long" })

    title.innerHTML = date;
    divtwo.appendChild(title);

    var temptext = document.createElement("p")
    temptext.innerHTML = "Temp: " + (((daytoday.temp.day) - 273.15) * 9 / 5 + 32).toFixed(1);

    divtwo.appendChild(temptext);

    var windtext = document.createElement("p")
    windtext.innerHTML = "Wind: " + daytoday.wind_deg
    divtwo.appendChild(windtext);

    var humiditytext = document.createElement("p")
    humiditytext.innerHTML = "Humidity: " + daytoday.humidity
    divtwo.appendChild(humiditytext);
    spacerEl.appendChild(divtwo);

    forecast.appendChild(spacerEl);
  }
}

var makebtn = function (city) {

  console.log(city);
  var line1 = document.querySelector("#line");
  line1.classList.remove("hide");

  var button = document.createElement("button")
  button.classList.add("layout");
  button.textContent = city;



  searchHistory.appendChild(button);
  button.addEventListener("click", function () {
    forecast.replaceChildren();
    getcityInfo(city);
  });

}
loadCities()

searchbtn.addEventListener("click", searchfunction);