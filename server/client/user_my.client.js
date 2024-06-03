document.addEventListener("DOMContentLoaded", () => {
  const locationInput = document.getElementById("location");
  const suggestionsList = document.getElementById("location-suggestions");
  const searchAddressButton = document.getElementById("search-address-button");

  if (!locationInput || !suggestionsList || !searchAddressButton) {
    console.error("Required elements not found");
    return;
  }

  searchAddressButton.addEventListener("click", async () => {
    const query = locationInput.value;
    console.log("Search button clicked with query:", query);

    try {
      const response = await fetch(`/users/search-address?query=${query}`);
      console.log("Response received");
      const results = await response.json();
      console.log("Results:", results);

      // Clear previous suggestions
      suggestionsList.innerHTML = "";

      results.documents.forEach((document) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = `${document.region_1depth_name} ${document.region_2depth_name}`;
        suggestionItem.addEventListener("click", () => {
          locationInput.value = `${document.region_1depth_name} ${document.region_2depth_name}`;
          suggestionsList.innerHTML = "";
        });
        suggestionsList.appendChild(suggestionItem);
      });
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  });

  document
    .getElementById("userForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const data = {
        name: formData.get("name"),
        nickname: formData.get("nickname"),
        location: formData.get("location"),
      };

      // 닉네임 중복 체크
      try {
        const nicknameResponse = await fetch(
          `/auth/check-nickname/${data.nickname}`
        );
        const nicknameResult = await nicknameResponse.json();
        if (
          !nicknameResult.available &&
          data.nickname !== "{{ user.nickname }}"
        ) {
          alert("Nickname is already taken");
          return;
        }
      } catch (error) {
        console.error("Error checking nickname:", error);
        alert("Error checking nickname");
        return;
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
