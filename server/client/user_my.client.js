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
        alert("이미 존재하는 닉네임입니다.");
        return;
      }
    } catch (error) {
      console.error("닉네임 체크 에러:", error);
      alert("닉네임 체크 에러");
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
          alert("프로필 업데이트 성공");
          window.location.reload();
        } else {
          alert("프로필 업데이트 실패");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("프로필 업데이트 실패");
      });
  });
