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
    alert(error.response.data.message);
    console.log(error);
  }
}
