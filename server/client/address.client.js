document.addEventListener("DOMContentLoaded", function () {
  const sidoSelect = document.getElementById("sido");
  const gunguSelect = document.getElementById("gungu");
  const locationInput = document.getElementById("location");

  const userLocation = locationInput.value.split(" ");
  const defaultSido = userLocation[0] || "서울특별시";
  const defaultGungu = userLocation[1] || "중구";

  const loadSidoOptions = async () => {
    const sidos = ["서울특별시", "부산광역시", "대구광역시"];
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
});
