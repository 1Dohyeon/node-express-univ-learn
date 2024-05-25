document.addEventListener("DOMContentLoaded", function () {
  const getTph = () => {
    const placeSelect = document.getElementById("place");
    const startDateInput = document.getElementById("start-date");

    if (!placeSelect || !startDateInput) {
      return;
    }

    const place_code = placeSelect.value;
    const place = placeSelect.options[placeSelect.selectedIndex].text;
    const startDate = startDateInput.value;
    const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 사용자 ID 가져오기
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기

    if (!place_code) {
      alert("위치를 선택해주세요");
      return;
    }

    const searchTime = new Date().toISOString();
    if (userId && token) {
      fetch("/searchHistory/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          searcher_id: userId,
          place,
          place_code,
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
          console.log("검색 기록 저장 완료 또는 업데이트 완료:", data);

          // 이후 외부 API 호출
          const url = `https://www.khoa.go.kr/api/oceangrid/tideObsPreTab/search.do?ServiceKey=YOUR_API_KEY&ObsCode=${place_code}&Date=${startDate.replace(
            /-/g,
            ""
          )}&ResultType=json`;

          return fetch(url);
        })
        .then((response) => response.json())
        .then((data) => {
          // Json data의 원하는 key만 불러오는데, ' '를 기준으로 분리하여 필요한 부분만 가져오고 html에 출력
          document.getElementById("city").textContent = place;
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
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const fetchSearchHistory = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return;
    }

    fetch(`/searchHistory/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const recentSearchesContainer =
          document.querySelector(".recent-searches");
        recentSearchesContainer.innerHTML = "";

        if (data.length === 0) {
          recentSearchesContainer.textContent = "최근 검색 기록이 없습니다.";
        } else {
          data.forEach((record) => {
            const recordElement = document.createElement("div");
            recordElement.classList.add("search-record");
            recordElement.innerHTML = `
            <div class="search-history">
              <span class="place">${
                record.place
              }</span><span class="time">${new Date(
              record.search_time
            ).toLocaleString()}</span>
            </div>`;
            recordElement.addEventListener("click", () => {
              /** 클릭시 메서드 축가 */
            });
            recentSearchesContainer.appendChild(recordElement);
          });
        }
      })
      .catch((error) => {
        console.error("검색 기록 조회 실패:", error);
      });
  };

  document.querySelector(".search-button").addEventListener("click", getTph);
  fetchSearchHistory();
});
