async function handleRegisterSubmit(e) {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const phone = e.target.phone.value;
  const password = e.target.password.value;

  const data = { name, email, phone, password };

  try {
    const response = await axios.post("register", data);
    if (response.status === 201) {
      alert("Successfuly signed up");
    }
  } catch (error) {
    if (error.response.status === 400) {
      alert(error.response.data.error);
    }
    if (error.response.status === 409) {
      alert("User already exists, Please Login");
    }
    console.log(error);
  }
}
