var apigClient = apigClientFactory.newClient({
    region: 'us-east-1'
});

function Renderwelcome(){
    templete  = "Welcome "+localStorage.getItem('username') +"!";
    document.getElementById("welcome message").innerHTML=templete;
};

function CustomLogin(){
    logininfo = document.getElementById("login form");
    console.log(logininfo.username.value);
    var params = {
      };
    var body = {
    "username": logininfo.username.value,
    "password": logininfo.password.value
    };
    var additionalParams = {
    };
    
    console.log('Try Log In');
    apigClient.loginAccountPost(params, body, additionalParams)
      .then(function(result){
        // Add success callback code here.
        console.log("Result : ", result);
        console.log('Login Success');
        localStorage.setItem('username', logininfo.username.value);
        alert("Login Success");
        window.location.href = "home.html";
      }).catch( function(result){
        // Add error callback code here.
        console.log(result);
      });
};

function Customlogout(){
    var params = {
    };
    var body = {
    };
    var additionalParams = {
    };
    console.log('Try Log Out');
    apigClient.logoutGet(params, body, additionalParams)
        .then(function(result){
            console.log("Result : ", result);
            console.log('Logout Success');
            localStorage.clear();
            window.location.href = "index.html";
        }).catch( function(result){
            // Add error callback code here.
            console.log(result);
        })
}
