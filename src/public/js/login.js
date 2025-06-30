async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await axios.post("login", { email, password });
    const access_token = response.data.data.access_token;
    localStorage.setItem("access_token", access_token);
    alert("Login successful");
    window.location.replace("/");
  } catch (error) {
    alert(error.response.data.message);
    console.log(error);
  }
}

document.getElementById("go-to-register").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("/auth/register");
});
