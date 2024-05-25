document.addEventListener("DOMContentLoaded", function () {
  const getTph = () => {
    const placeSelect = document.getElementById("place");
    const startDateInput = document.getElementById("start-date");

    if (!placeSelect || !startDateInput) {
      return;
    }

    const place = placeSelect.value;
    const startDate = startDateInput.value;
    const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 사용자 ID 가져오기

    if (!place) {
      alert("위치를 선택해주세요");
      return;
    }

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const searchTime = new Date().toISOString();

    fetch("/searchHistory/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searcher_id: userId,
        place,
        search_time: searchTime,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("검색 기록 저장 실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log("검색 기록 저장 완료:", data);

        // 이후 외부 API 호출
        const url = `https://www.khoa.go.kr/api/oceangrid/tideObsPreTab/search.do?ServiceKey=${
          process.env.TIDE_API_KEY
        }&ObsCode=${place}&Date=${startDate.replace(/-/g, "")}&ResultType=json`;

        return fetch(url);
      })
      .then((response) => response.json())
      .then((data) => {
        // Json data의 원하는 key만 불러오는데, ' '를 기준으로 분리하여 필요한 부분만 가져오고 html에 출력
        document.getElementById("city").textContent =
          placeSelect.options[placeSelect.selectedIndex].text;
        document.getElementById("t1").textContent =
          data.result.data[0].tph_time.split(" ")[1] +
          " " +
          data.result.data[0].hl_code;
        document.getElementById("t2").textContent =
          data.result.data[1].tph_time.split(" ")[1] +
          " " +
          data.result.data[1].hl_code;
        document.getElementById("t3").textContent =
          data.result.data[2].tph_time.split(" ")[1] +
          " " +
          data.result.data[2].hl_code;
        document.getElementById("t4").textContent =
          data.result.data[3].tph_time.split(" ")[1] +
          " " +
          data.result.data[3].hl_code;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  document.querySelector(".search-button").addEventListener("click", getTph);
});
