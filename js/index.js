var apigClient = apigClientFactory.newClient({
    region: 'us-east-1'
});

function Renderwelcome(){
  document.getElementById('welcome message').innerHTML = 'Welcome ' + localStorage.getItem('username') + '!';
}

// 
function Renderlogin(){
  if (localStorage.getItem('username') == null){
    document.getElementById('login').innerHTML = '<a href="/login_account.html"><button class="btn btn-outline-primary">Login</button></a>';
  }
  else{
    document.getElementById('login').innerHTML = '<a href="javascript:Customlogout()">Logout</a>';
  }
}

function GeneralOnload(){
  Renderlogin();
}

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
      }).catch(function(result){
        // Add error callback code here.
        console.log(result);
      });

    var params = {
    };
    var body = {
    "username": logininfo.username.value
    };
    var additionalParams = {
    };
    apigClient.currentUserPost(params, body, additionalParams)
    .then(function(result){
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('User Get Success');
      localStorage.setItem('uid', result["data"]["userid"]);
      window.location.href = "home.html";
    }).catch(function(result){
      // Add error callback code here.
      console.log(result);
    });
};

function CustomRegister(){
    var registerinfo = document.getElementById("registerform");
    console.log(registerinfo);
    var params = {
    };
    var body = {
    "username": registerinfo.username.value,
    "email": registerinfo.email.value,
    "password": registerinfo.password.value,
    "confirm-password": registerinfo['confirm-password'].value
    };
    var additionalParams = {};
    console.log('Try Register');
    apigClient.registerPost(params, body, additionalParams)
    .then(function(result){
        console.log("Result : ", result);
        console.log('Register Success');
        window.location.href = "login_account.html";
    }).catch( function(result){
        // Add error callback code here.
        console.log(result);
    })
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

function AddProduct() {
  product_info = document.getElementById("product-form");
  console.log(product_info.pname.value);
  var params = {};
  var body = {
    "pname": product_info.pname.value,
    "ptype": product_info.ptype.value,
    "retailer_link": product_info.retailer_link.value,
    "location": product_info.location.value,
    "description": product_info.description.value,
    "price": product_info.price.value
  };
  var additionalParams = {};

  console.log('Try Add Product');
  apigClient.addProductPost (params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Add product Success');
      // localStorage.setItem('username', logininfo.username.value);
      alert("Add Product Success");
      window.location.href = "get_product.html";
    }).catch(function (result) {
    // Add error callback code here.
      alert("Add Product Failed");
      console.log(result);
    });
};
function RenderProductList(){
  product_list = JSON.parse(localStorage.getItem('product_list'));
  console.log(product_list);
  for (idx in product_list){
    let prod = product_list[idx];
    document.getElementById('product_list').innerHTML += 
    '<tr>'
    +'<td><a href="javascript:GetProductbyID('+prod.pid +')">' +prod.pname+' </a></td>'
      +'<td><a href="javascript:FetchbyType('+"'"+prod.ptype+"'"+')">' +prod.ptype+' </a></td>'
        +'<td> '+prod.description +'</td>'
          +'<td> '+prod.location+'</td>'
            +'<td> '+ prod.price +' </td>'
              +'</tr>'             
  }
  localStorage.removeItem('product_list');
}

function RenderSearch_Ptype(){
  document.getElementById('title').innerHTML = 'Here is the result for ' +localStorage.getItem('ptype');
  console.log(localStorage.getItem('product_list'));
  RenderProductList();
}

function RenderSearch_Pname(){
  document.getElementById('title').innerHTML = 'Here is the result for ' +localStorage.getItem('pname');
  console.log("searching product_name:",localStorage.getItem('pname'));
  console.log(localStorage.getItem('product_list'));
  RenderProductList();
}

function RenderAllProduct(){
  Renderlogin();
  console.log('Try Fetch All Product');
  apigClient.searchProductGet({}, {}, {})
    .then(function (result) {
      console.log("Result : ", result);
      localStorage.setItem('product_list', JSON.stringify(result["data"]))
      RenderProductList();
    }).catch(function (result) {
      console.log(result);
    });
  
}

function FetchbyName() {
  product_info = document.getElementById("search-form");
  console.log(product_info.pname.value);
  var params = {
  };
  var body = {
    'pname': product_info.pname.value
  };
  var additionalParams = {};

  console.log('Try Search Product');
  apigClient.searchPost(params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log('Search product Success');
      console.log("Result : ", result);
      var data = result["data"];
      console.log(data);
      localStorage.setItem('product_list', JSON.stringify(data))
      localStorage.setItem('pname',body.pname)
      // alert("Search Product Success");
      window.location.href = "search_pname.html";
    }).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });
}

function FetchbyType(ptype){
  console.log(ptype)
  var params = {'ptype': ptype
  };
  apigClient.searchPtypePtypeGet(params, {}, {})
  // .then(function(response){
  //   console.log(response);
  //   console.log("Response is ok?", response.ok);
  // })
  .then(function(result){
    var data = result["data"];
    localStorage.setItem('product_list', JSON.stringify(data))
    localStorage.setItem('ptype',ptype)
    console.log(data)
    window.location.href = "search_ptype.html";
  }).catch(function(result){
    // Add error callback code here.
    console.log(result);

  });
}


function GetProductbyID(pid) {
  var params = {  'pid': pid  };
  var body = {};
  var additionalParams = {};

  var uid = 0;
  var sid = 0;

  console.log('Try Get Product');

  localStorage.setItem('pid', pid);
  console.log('pid is', pid);

  // apigClient.currentUserGet(params, body, additionalParams)
  //   .then(function (result) {
  //     // Add success callback code here.
  //     console.log("Result : ", result);
  //     console.log('Get User Success');
  //     localStorage.setItem('uid', JSON.stringify(result));
  //     uid = JSON.stringify(result);
  // }).catch(function (result) {
  //   // Add error callback code here.
  //   console.log(result);
  // });


  localStorage.setItem('uid', uid);

  apigClient.getProductPidGet (params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Get product Success');
      data = result['data']['data'][0];
      localStorage.setItem('product', JSON.stringify(data));
      
      // TODO: get seller id
      // sid = data['seller_id'];
      localStorage.setItem('sid', sid);

      // window.location.href = "get_product.html";
    }).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });
};

window.onload = function () {
  prod = JSON.parse(localStorage.getItem("product"));
  sid = localStorage.getItem("sid");
  uid = localStorage.getItem("uid");

  console.log('sid: ', sid)
  console.log('uid: ', uid)
  
  RenderProductDetail(prod, sid, uid);
}

function RenderProductDetail(prod, sid, uid) {
  if (uid == sid) {
    localStorage.setItem('isSeller', true);
    document.getElementById("delete").innerHTML = "Delete"
  }
  else {
    localStorage.setItem("isSeller", false);
    document.getElementById("delete").innerHTML = "Purchase"
  }

  document.getElementById("pname").innerHTML = prod['pname'];
  document.getElementById("ptype").innerHTML = prod.ptype;
  document.getElementById("description").innerHTML = prod.description;
  document.getElementById("location").innerHTML = prod.location;
  document.getElementById("price").innerHTML = prod.price;
}

function GetProductDelete() {
  isSeller = localStorage.getItem("isSeller");
  pid = localStorage.getItem("pid");
  if (isSeller == false) { GetProductPurchase(pid); return; }

  params = {'pid': pid};
  body = {};
  additionalParams = {};

  console.log('Try Delete Product');
  apigClient.getProductPidPost (params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Delete product Success');
      alert("Delete Product Success");
      window.location.href = "search_product.html";
    }
    ).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });
}

function GetProductPurchase() {
  console.log('Try Adding Product');
}