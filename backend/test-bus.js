async function test() {
  const loginRes = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "testowner@example.com", otp: "000000" })
  });
  const loginData = await loginRes.json();
  console.log("Login Res:", loginData);

  const token = loginData.data?.accessToken || loginData.accessToken;
  const busRes = await fetch("http://localhost:5000/api/v1/businesses/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const busData = await busRes.json();
  console.log("Bus Res status:", busRes.status);
  console.log("Bus Data:", JSON.stringify(busData, null, 2));
}
test();
