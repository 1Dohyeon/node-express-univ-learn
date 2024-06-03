document.addEventListener("DOMContentLoaded", function () {
  const sidoSelect = document.getElementById("sido");
  const gunguSelect = document.getElementById("gungu");

  // 시/도 리스트를 채우기 위한 함수
  function populateSido() {
    const sidos = [
      "서울특별시",
      "부산광역시",
      "대구광역시",
      "인천광역시",
      "광주광역시",
      "대전광역시",
      "울산광역시",
      "세종특별자치시",
      "경기도",
      "강원도",
      "충청북도",
      "충청남도",
      "전라북도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ];
    sidos.forEach((sido) => {
      const option = document.createElement("option");
      option.value = sido;
      option.textContent = sido;
      sidoSelect.appendChild(option);
    });
  }

  // 시/도를 선택했을 때 군/구 리스트를 업데이트하는 함수
  async function updateGungu(sido) {
    // 예시 API 호출 (실제로 사용할 API로 변경 필요)
    try {
      const response = await fetch(
        `/api/get-gungu?sido=${encodeURIComponent(sido)}`
      );
      const data = await response.json();

      // 군/구 리스트 초기화
      gunguSelect.innerHTML = '<option value="">군/구를 선택하세요</option>';

      data.forEach((gungu) => {
        const option = document.createElement("option");
        option.value = gungu;
        option.textContent = gungu;
        gunguSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching gungu:", error);
    }
  }

  // 시/도 선택 이벤트 리스너
  sidoSelect.addEventListener("change", function () {
    const selectedSido = sidoSelect.value;
    if (selectedSido) {
      updateGungu(selectedSido);
    } else {
      gunguSelect.innerHTML =
        '<option value="">시/도를 먼저 선택하세요</option>';
    }
  });

  populateSido();
});
