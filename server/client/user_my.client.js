document.addEventListener("DOMContentLoaded", function () {
  const sidoSelect = document.getElementById("sido");
  const gunguSelect = document.getElementById("gungu");
  const locationInput = document.getElementById("location");

  const userLocation = locationInput.value.split(" ");
  const defaultSido = userLocation[0] || "서울특별시";
  const defaultGungu = userLocation[1] || "중구";

  const loadSidoOptions = async () => {
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
    sidoSelect.value = defaultSido;
  };

  const loadGunguOptions = async (sido) => {
    const gunguData = {
      서울특별시: [
        "강남구",
        "강동구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
        "노원구",
        "도봉구",
        "동대문구",
        "동작구",
        "마포구",
        "서대문구",
        "서초구",
        "성동구",
        "성북구",
        "송파구",
        "양천구",
        "영등포구",
        "용산구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
      ],
      부산광역시: [
        "강서구",
        "금정구",
        "기장군",
        "남구",
        "동구",
        "동래구",
        "부산진구",
        "북구",
        "사상구",
        "사하구",
        "서구",
        "수영구",
        "연제구",
        "영도구",
        "중구",
        "해운대구",
      ],
      대구광역시: [
        "남구",
        "달서구",
        "달성군",
        "동구",
        "북구",
        "서구",
        "수성구",
        "중구",
      ],
      인천광역시: [
        "강화군",
        "계양구",
        "미추홀구",
        "남동구",
        "동구",
        "부평구",
        "서구",
        "연수구",
        "옹진군",
        "중구",
      ],
      광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
      대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
      울산광역시: ["남구", "동구", "북구", "울주군", "중구"],
      세종특별자치시: ["세종시"],
      경기도: [
        "가평군",
        "고양시",
        "과천시",
        "광명시",
        "광주시",
        "구리시",
        "군포시",
        "김포시",
        "남양주시",
        "동두천시",
        "부천시",
        "성남시",
        "수원시",
        "시흥시",
        "안산시",
        "안성시",
        "안양시",
        "양주시",
        "양평군",
        "여주시",
        "연천군",
        "오산시",
        "용인시",
        "의왕시",
        "의정부시",
        "이천시",
        "파주시",
        "평택시",
        "포천시",
        "하남시",
        "화성시",
      ],
      강원도: [
        "강릉시",
        "고성군",
        "동해시",
        "삼척시",
        "속초시",
        "양구군",
        "양양군",
        "영월군",
        "원주시",
        "인제군",
        "정선군",
        "철원군",
        "춘천시",
        "태백시",
        "평창군",
        "홍천군",
        "화천군",
        "횡성군",
      ],
      충청북도: [
        "괴산군",
        "단양군",
        "보은군",
        "영동군",
        "옥천군",
        "음성군",
        "제천시",
        "진천군",
        "청주시",
        "충주시",
        "증평군",
      ],
      충청남도: [
        "계룡시",
        "공주시",
        "금산군",
        "논산시",
        "당진시",
        "보령시",
        "부여군",
        "서산시",
        "서천군",
        "아산시",
        "연기군",
        "예산군",
        "천안시",
        "청양군",
        "태안군",
        "홍성군",
      ],
      전라북도: [
        "고창군",
        "군산시",
        "김제시",
        "남원시",
        "무주군",
        "부안군",
        "순창군",
        "완주군",
        "익산시",
        "임실군",
        "장수군",
        "전주시",
        "정읍시",
        "진안군",
      ],
      전라남도: [
        "강진군",
        "고흥군",
        "곡성군",
        "광양시",
        "구례군",
        "나주시",
        "담양군",
        "목포시",
        "무안군",
        "보성군",
        "순천시",
        "신안군",
        "여수시",
        "영광군",
        "영암군",
        "완도군",
        "장성군",
        "장흥군",
        "진도군",
        "함평군",
        "해남군",
        "화순군",
      ],
      경상북도: [
        "경산시",
        "경주시",
        "고령군",
        "구미시",
        "군위군",
        "김천시",
        "문경시",
        "봉화군",
        "상주시",
        "성주군",
        "안동시",
        "영덕군",
        "영양군",
        "영주시",
        "영천시",
        "예천군",
        "울릉군",
        "울진군",
        "의성군",
        "청도군",
        "청송군",
        "칠곡군",
        "포항시",
      ],
      경상남도: [
        "거제시",
        "거창군",
        "고성군",
        "김해시",
        "남해군",
        "밀양시",
        "사천시",
        "산청군",
        "양산시",
        "의령군",
        "진주시",
        "창녕군",
        "창원시",
        "통영시",
        "하동군",
        "함안군",
        "함양군",
        "합천군",
      ],
      제주특별자치도: ["서귀포시", "제주시"],
    };

    const gungus = gunguData[sido] || [];
    gunguSelect.innerHTML = '<option value="">Select 군/구</option>';
    gungus.forEach((gungu) => {
      const option = document.createElement("option");
      option.value = gungu;
      option.textContent = gungu;
      gunguSelect.appendChild(option);
    });
    gunguSelect.value = defaultGungu;
  };

  sidoSelect.addEventListener("change", (event) => {
    const selectedSido = event.target.value;
    if (selectedSido) {
      loadGunguOptions(selectedSido);
      locationInput.value = selectedSido;
    } else {
      gunguSelect.innerHTML = '<option value="">Select 군/구</option>';
      locationInput.value = "";
    }
  });

  gunguSelect.addEventListener("change", () => {
    const selectedSido = sidoSelect.value;
    const selectedGungu = gunguSelect.value;
    if (selectedSido && selectedGungu) {
      locationInput.value = `${selectedSido} ${selectedGungu}`;
    }
  });

  loadSidoOptions();
  loadGunguOptions(defaultSido);
  locationInput.value = `${defaultSido} ${defaultGungu}`;

  document
    .getElementById("userForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const data = {
        name: formData.get("name"),
        nickname: formData.get("nickname"),
        location: locationInput.value,
      };

      const currentNickname = this.getAttribute("data-current-nickname");

      // 닉네임 중복 체크
      if (data.nickname !== currentNickname) {
        try {
          const nicknameResponse = await fetch(
            `/auth/check-nickname/${data.nickname}`
          );
          const nicknameResult = await nicknameResponse.json();
          if (!nicknameResult.available) {
            alert("이미 존재하는 닉네임입니다.");
            return;
          }
        } catch (error) {
          console.error("닉네임 중복 체크 에러:", error);
          alert("닉네임 중복 체크 에러");
          return;
        }
      }

      fetch(`/users/my`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            alert("프로필이 성공적으로 업데이트 되었습니다.");
            window.location.reload();
          } else {
            alert("프로필 업데이트에 실패하였습니다.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("프로필 업데이트에 실패하였습니다.");
        });
    });

  const deleteButton = document.getElementById("deleteAccount");

  deleteButton.addEventListener("click", async () => {
    if (confirm("정말로 계정을 삭제하시겠습니까?")) {
      const userId = document.getElementById("userForm").dataset.userId;
      if (!userId) {
        alert("User ID is undefined");
        return;
      }
      try {
        const response = await fetch(`/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          alert("계정이 성공적으로 삭제되었습니다.");
          window.location.href = "/"; // 메인 페이지로 리디렉션
        } else {
          const error = await response.json();
          alert(`계정 삭제 중 오류가 발생했습니다: ${error.message}`);
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("계정 삭제 중 오류가 발생했습니다.");
      }
    }
  });
});
