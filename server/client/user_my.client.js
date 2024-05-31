document
  .getElementById("userForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const response = await fetch("/users/my", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("User updated successfully!");
    } else {
      const errorText = await response.text();
      alert(`Error: ${errorText}`);
    }
  });
