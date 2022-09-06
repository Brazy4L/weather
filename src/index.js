import Chart from "chart.js/auto";

const Run = (() => {
  const app = () => {
    console.log();
  };

  let search = document.getElementById("search");
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (search.value === "") {
        console.log();
      } else {
        let location = search.value;
        fetchLocation(location);
      }
    }
  });

  async function fetchLocation(location) {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
        {
          mode: "cors",
        }
      );
      let geo = await response.json();
      fetchWeeklyWeather(geo.results[0].latitude, geo.results[0].longitude);
      fetchHourlyWeather(geo.results[0].latitude, geo.results[0].longitude);
    } catch (error) {
      console.log(error);
    }
  }

  let prec;
  let temp;

  async function fetchHourlyWeather(lat, long) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation,weathercode&timezone=auto`,
        {
          mode: "cors",
        }
      );
      const data = await response.json();
      prec = data.hourly.precipitation;
      temp = data.hourly.temperature_2m;
      HourlyWeather();
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchWeeklyWeather(lat, long) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&daily=sunrise,sunset&daily=weathercode&timezone=auto`,
        {
          mode: "cors",
        }
      );
      const data = await response.json();
      weeklyWeather(
        data.daily.temperature_2m_max,
        data.daily.temperature_2m_min,
        data.daily.weathercode,
        data.daily.precipitation_sum,
        data.daily.time,
        data.daily.sunrise,
        data.daily.sunset
      );
    } catch (error) {
      console.log(error);
    }
  }

  const weeklyWeather = (one, two, three, four, five, six, seven) => {
    let hightemp = document.querySelectorAll(".hightemp");
    let lowtemp = document.querySelectorAll(".lowtemp");
    let icon = document.querySelectorAll(".icon");
    let precip = document.querySelectorAll(".precip");
    let date = document.querySelectorAll(".date");
    let sunrise = document.getElementById("sunrise");
    let sunset = document.getElementById("sunset");

    for (let i = 0; i < 7; i++) {
      hightemp[i].textContent = one[i] + " °C";
    }

    for (let i = 0; i < 7; i++) {
      lowtemp[i].textContent = two[i] + " °C";
    }

    for (let i = 0; i < 7; i++) {
      icon[i].textContent = three[i];
    }

    for (let i = 0; i < 7; i++) {
      if (four[i] === null) {
        precip[i].textContent = "0 mm";
      } else {
        precip[i].textContent = four[i] + " mm";
      }
    }

    for (let i = 0; i < 7; i++) {
      date[i].textContent = five[i].substring(5);
    }

    sunrise.textContent = 'Sunrise: ' + six[0].substring(11);
    sunset.textContent = 'Sunset: ' + seven[0].substring(11);
  };

  const HourlyWeather = () => {
    const canvas = document.getElementById("hourly");
    let ctx = document.getElementById("myChart");
    canvas.removeChild(ctx);
    ctx = document.createElement("canvas");
    ctx.id = "myChart";
    canvas.appendChild(ctx);

    return new Chart(ctx, {
      data: {
        datasets: [
          {
            type: "bar",
            label: "Precipitation",
            data: prec,
            borderColor: "rgb(0, 162, 255)",
            backgroundColor: "rgb(0, 162, 255)",
          },
          {
            type: "line",
            label: "Temperature",
            data: temp,
            borderColor: "rgb(0, 255, 255)",
          },
        ],
        labels: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23,
        ],
      },
    });
  };

  return {
    app,
  };
})();

Run.app();
