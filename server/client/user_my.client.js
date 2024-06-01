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
      if (!nicknameResult.available) {
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
