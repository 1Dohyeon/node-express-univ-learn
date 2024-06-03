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
      서울특별시: ["강남구", "강동구", "강북구", "중구"],
      부산광역시: ["중구", "서구", "동구"],
      대구광역시: ["남구", "북구", "수성구"],
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
            alert("Nickname is already taken");
            return;
          }
        } catch (error) {
          console.error("Error checking nickname:", error);
          alert("Error checking nickname");
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
            alert("Profile updated successfully");
            window.location.reload();
          } else {
            alert("Error updating profile");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error updating profile");
        });
    });
});
