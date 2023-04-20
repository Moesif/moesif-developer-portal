async function submitRegistration() {
  const email = document.getElementById("email-input").value;
  const firstname = document.getElementById("firstname-input").value;
  const lastname = document.getElementById("lastname-input").value;
  const errorElement = document.getElementById("error-message");
  const apikey = document.getElementById("apikey-output");

  var body = { email, firstname, lastname };
  console.log(body);
  var response = await fetch("http://localhost:3000/register", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  var data = await response.json();
  console.log("Kong create consumer");
  console.log(data);
  apikey.innerHTML = data.jwt;
}
