async function getTph() {
  var place = document.getElementById("place");
  var dt = place.options[place.selectedIndex].value;
  var city = place.options[place.selectedIndex].text;
  document.getElementById("city").innerHTML = city;

  const startDate = document.getElementById("start-date").value;
  var todayDate = startDate.split("-");
  var Date = todayDate[0] + todayDate[1] + todayDate[2];

  const url = `/api/tide?place=${dt}&date=${Date}`;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      var tph0 = data.result.data[0].tph_time.split(" ");
      document.getElementById("t1").innerHTML =
        tph0[1] + " " + data.result.data[0].hl_code;
      var tph1 = data.result.data[1].tph_time.split(" ");
      document.getElementById("t2").innerHTML =
        tph1[1] + " " + data.result.data[1].hl_code;
      var tph2 = data.result.data[2].tph_time.split(" ");
      document.getElementById("t3").innerHTML =
        tph2[1] + " " + data.result.data[2].hl_code;
      var tph3 = data.result.data[3].tph_time.split(" ");
      document.getElementById("t4").innerHTML =
        tph3[1] + " " + data.result.data[3].hl_code;
    });
}
