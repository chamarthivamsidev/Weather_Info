let key = "9882b85335d0174a929837d6c51d91c3";

let body = document.querySelector("body");
async function getWeather() {
  body.style.background =
    "linear-gradient(to top left, #66ffff 10%, #cc99ff 76%)";
  let city = document.getElementById("city").value;
  document.getElementById("map_gif").style.display = "none";
  let iframe = document.querySelector("iframe");
  iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDHmYL0y7ACMUFE2_ySGgXg0VDapn_3Y2U&q=${city}`;

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

  let res = await fetch(url);
  let data = await res.json();
  console.log("data:", data);

  localStorage.setItem("weather_report", JSON.stringify(data));
  showWeather(data);
  getDaily();
}

async function getDaily() {
  let directions = JSON.parse(localStorage.getItem("weather_report"));
  let lat = directions.coord.lat;
  let lon = directions.coord.lon;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${key}&units=metric`;

  let res = await fetch(url);
  let data = await res.json();
  display(data);
}

let content = document.getElementById("content");

function showWeather(data) {
  content.textContent = null;

  let top = document.createElement("div");
  top.setAttribute("id", "top");

  let left_div = document.createElement("div");
  left_div.setAttribute("id", "content_left");

  let max_temp = document.createElement("div");
  max_temp.innerHTML = `<i class='fas fa-temperature-high' style='font-size:20px;color:white'></i> Max_Temp :${data.main.temp_max}<sup>o</sup>C`;

  let min_temp = document.createElement("div");
  min_temp.innerHTML = `<i class='fas fa-temperature-low' style='font-size:20px;color:white'></i> Min_Temp :${data.main.temp_min}<sup>o</sup>C`;

  let wind = document.createElement("div");
  wind.innerHTML = `<i class='fas fa-wind' style='font-size:20px;color:white'></i> Wind_Speed :${data.wind.speed}`;

  //   let cloud = document.createElement("div");
  //   cloud.innerHTML = `<i class='fas fa-cloud' style='font-size:20px;color:white'></i> Cloud : Clear Sky`;

  const sunrise = new Date(data.sys.sunrise * 1000);

  let x;
  if (sunrise.getMinutes() < 10) {
    x = "0" + sunrise.getMinutes();
    console.log("x:", x);
  } else {
    x = sunrise.getMinutes();
  }

  var sunriseTag = document.createElement("div");
  sunriseTag.setAttribute("id", "sunriseTag");
  sunriseTag.innerHTML = `<img src="https://ssl.gstatic.com/onebox/weather/48/sunny.png" width="30px" height="30px"><img><p>Sunrise: ${
    sunrise.getHours() + ":" + x
  }AM</p>`;

  const sunset = new Date(data.sys.sunset * 1000);
  var sunsetTag = document.createElement("div");
  sunsetTag.setAttribute("id", "sunsetTag");
  sunsetTag.innerHTML = `<img src="https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png" width="30px" height="30px"></img><p>Sunset: ${
    sunset.getHours() + ":" + x
  }PM</p>`;

  left_div.append(max_temp, min_temp, wind, sunriseTag, sunsetTag);

  let right_div = document.createElement("div");
  right_div.setAttribute("id", "content_right");

  let right_top = document.createElement("div");
  right_top.setAttribute("id", "content_top");

  let right_top_logo = document.createElement("img");
  right_top_logo.setAttribute("id", "right_top_logo");

  if (data.main.temp > 25) {
    right_top_logo.src =
      "https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png";
  } else if (data.main.temp < 25 && data.main.temp > 20) {
    right_top_logo.src =
      "https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png";
  } else {
    right_top_logo.src =
      "https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png";
  }

  let temp = document.createElement("p");
  temp.setAttribute("id", "temprature");
  temp.innerHTML = `${data.main.temp}<sup>o</sup>C`;

  right_top.append(right_top_logo, temp);

  let right_bot = document.createElement("div");
  right_bot.setAttribute("id", "content_bot");
  right_bot.innerHTML = `<p id="title">${data.name}</p>`;

  right_div.append(right_top, right_bot);

  top.append(left_div, right_div);

  content.append(top);
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// displaying weekly weather forecast
function display(weather) {
  var day = weather.daily;
  var d = new Date();
  let day_index = d.getDay();

  let bottom = document.createElement("div");
  bottom.setAttribute("id", "bottom");

  day.map(function (item, index) {
    let div = document.createElement("div");
    div.setAttribute("id", "daily_div");

    let img = document.createElement("img");

    let p = document.createElement("p");

    p.innerHTML = `${days[day_index % 7]}`;
    day_index++;

    let p1 = document.createElement("p");
    p1.setAttribute("id", "daily");
    let max = item.temp.max;
    let min = item.temp.min;

    p1.innerHTML = `<span>${max}</span><sup>o</sup>&nbsp <span>${min}<sup>o</sup></span>`;

    if (max > 22) {
      img.src = "https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png";
    } else if (min < 19) {
      img.src = "https://ssl.gstatic.com/onebox/weather/64/rain_s_cloudy.png";
    } else {
      img.src = "https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png";
    }

    div.append(p, img, p1);
    bottom.append(div);
  });

  content.append(bottom);
}
