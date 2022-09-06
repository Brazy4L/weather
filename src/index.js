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
      fetchWeather(geo.results[0].latitude, geo.results[0].longitude);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchWeather(lat, long) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
        {
          mode: "cors",
        }
      );
      const data = await response.json();
      weather(
        data.daily.temperature_2m_max,
        data.daily.temperature_2m_min,
        data.daily.precipitation_sum,
        data.daily.time
      );
    } catch (error) {
      console.log(error);
    }
  }

  const weather = (one, two, three, four) => {
    let hightemp = document.querySelectorAll(".hightemp");
    let lowtemp = document.querySelectorAll(".lowtemp");
    let precip = document.querySelectorAll(".precip");
    let date = document.querySelectorAll(".date");

    for (let i = 0; i < 7; i++) {
      hightemp[i].textContent = one[i] + " °C";
    }
    for (let i = 0; i < 7; i++) {
      lowtemp[i].textContent = two[i] + " °C";
    }
    for (let i = 0; i < 7; i++) {
      if (three[i] === null) {
        precip[i].textContent = "0 mm";
      } else {
        precip[i].textContent = three[i] + " mm";
      }
    }
    for (let i = 0; i < 7; i++) {
      four[i] = four[i].substring(5);
      date[i].textContent = four[i];
    }
  };

  return {
    app,
  };
})();

Run.app();
