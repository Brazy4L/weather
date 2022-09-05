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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const weather = () => {
    let hightemp = document.getElementsByClassName("hightemp");
    let lowtemp = document.getElementsByClassName("lowtemp");
    let precip = document.getElementsByClassName("precip");
    let date = document.getElementsByClassName("date");
  };

  return {
    app,
  };
})();

Run.app();
