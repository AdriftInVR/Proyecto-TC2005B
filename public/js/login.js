let buttonLogin = document.getElementById("loginButton");
buttonLogin.innerHTML = "Login";
buttonLogin.onclick = () => {
    location.href = 'http://localhost:3000/login'
}