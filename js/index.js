var apigClient = apigClientFactory.newClient({
    region: 'us-east-1'
});

function Renderwelcome(){
  Renderlogin();
  document.getElementById('welcome message').innerHTML = 'Welcome ' + localStorage.getItem('username') + '!';
}

// 
function Renderlogin(){
  if (localStorage.getItem('username') == null){
    document.getElementById('login').innerHTML = '<a href="/login_account.html"><button class="btn btn-outline-primary">Login</button></a>';
  }
  else{
    document.getElementById('login').innerHTML = '<a href="javascript:Customlogout()"><button class="btn btn-outline-primary">Logout</button></a>';
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
        if (result["data"].includes("user-not-found")){
          alert("User not found. Please register first!");
          window.location.href = "register.html";
          return;
        }else if (result["data"].includes("incorrect-password")){
          alert("Incorrect password!");
          window.location.href = "login_account.html";
        }
        else{
          console.log("Result : ", result);
          console.log('Login Success');
          localStorage.setItem('username', logininfo.username.value);
          setinfo(logininfo.username.value);
          alert("Login Success");
        };
        
      }).catch(function(result){
        // Add error callback code here.
        console.log(result);
      });
    };

function setinfo(username){
    var params = {
    };
    var body = {
    "username": username
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
      if (result["data"].includes("Missing-fields")){
        alert("Please have all fields filled.");
        window.location.href = "register.html";
        return;
      }else if (result["data"].includes("User-or-email-exists")){
        alert("User or email exists. Please also check if both password are the same.");
        window.location.href = "register.html";

      }else{
        console.log("Result : ", result);
        console.log('Register Success');
        alert("Register Success!");
        window.location.href = "login_account.html";
      }

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
function AddProductOnload(){
  Renderlogin();
  if (localStorage.getItem('uid') == null){
    alert("Please login first.");
    window.location.href = "login_account.html";
  }
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
    "price": product_info.price.value,
    "seller_id": localStorage.getItem('uid')
  };
  var additionalParams = {};

  console.log('Try Add Product');
  apigClient.addProductPost (params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Add product Success');
      // localStorage.setItem('username', logininfo.username.value);
      
      if (result["data"].includes("Price")) {
        alert("Price should be at least $1.");
        return;
      }
      else if (result["data"].includes("Location")) {
        alert("Invalid Location.");
        return;
      }

      alert("Add Product Success");
      window.location.href = "selling_product.html";
    }).catch(function (result) {
    // Add error callback code here.
      alert("Add Product Failed");
      console.log(result);
    });
};
function RenderProductList(){
  product_list = JSON.parse(localStorage.getItem('product_list'));
  if (product_list.includes("no product")){
    alert("There is no product selling on the market");
    return;
  }
  console.log(product_list);
  for (idx in product_list){
    let prod = product_list[idx];
    if (prod.sold){
      continue;
    }
    document.getElementById('product_list').innerHTML += 
    '<tr>'
    +'<td><a href="javascript:GetProductbyID('+prod.pid +')">' +prod.pname+' </a></td>'
      +'<td><a href="javascript:FetchbyType('+"'"+prod.ptype+"'"+')">' +prod.ptype+' </a></td>'
        +'<td> '+prod.description +'</td>'
          +'<td> '+prod.location+'</td>'
            +'<td> $ '+ prod.price +' </td>'
              +'</tr>'             
  }
  document.getElementById("product_list").style.textTransform = "capitalize";
}

function RenderSearch_Ptype(){
  Renderlogin();
  document.getElementById('title').innerHTML = 'Here is the result for ' +localStorage.getItem('ptype');
  console.log(localStorage.getItem('product_list'));
  RenderProductList();
}

function RenderSearch_Pname(){
  Renderlogin();
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

function RenderMySellingProduct(){
  Renderlogin();
  console.log('Try Fetch My selling Product');
  if (localStorage.getItem('uid') == null){
    alert("Please login first.");
    window.location.href = "login_account.html";
  }
  apigClient.sellerProductUidGet({'uid': localStorage.getItem('uid')}, {}, {})
    .then(function (result) {
      console.log("Result : ", result);
      if (result["data"].includes("no product")){
        alert("You have no selling product.");
        return;
      }
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

  console.log('Try Search Product:', product_info.pname.value);
  apigClient.searchPost(params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log('Search product Success');
      console.log("Result : ", result);
      var data = result["data"];
      if (data.includes("NOT FOUND")){
        alert("Product Not Found");
        return;
      }
      localStorage.setItem('product_list', JSON.stringify(data))
      localStorage.setItem('pname',body.pname)
      // alert("Search Product Success");
      // window.location.href = "search_pname.html";
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
  .then(function(result){
    var data = result["data"];
    if (data.includes("NOT FOUND")){
      alert("Product with type: '"+ptype+ "' Not Found");
      return;
    }
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

  var sid = 0;

  console.log('Try Get Product');

  localStorage.setItem('pid', pid);
  console.log('pid is', pid);


  apigClient.getProductPidGet (params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Get product Success');
      data = result['data']['data'][0];
      localStorage.setItem('product', JSON.stringify(data));
      
      // TODO: get seller id
      sid = data['seller_id'];
      localStorage.setItem('sid', sid);

      if (data['sold'] == true) {
        alert("Product Sold");
      }

      window.location.href = "get_product.html";
    }).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });

  // RenderProductDetail(prod, sid);
};

// window.onload = function () {
//   prod = JSON.parse(localStorage.getItem("product"));
//   sid = localStorage.getItem("sid");
//   console.log('sid: ', sid)

//   var params = {  'pid': prod.pid  };
//   var body = {};
//   var additionalParams = {};

//   apigClient.getProductPidGet (params, body, additionalParams)
//     .then(function (result) {
//       // Add success callback code here.
//       console.log("Result : ", result);
//       console.log('Get product Success');
//       data = result['data']['data'][0];
//       // localStorage.setItem('product', JSON.stringify(data));

//       if (data['sold'] == true) {
//         alert("Product Sold");
//         // return;
//       }
//     }).catch(function (result) {
//       // Add error callback code here.
//       console.log(result);
//     });
  
//   RenderProductDetail(prod, sid);
// }

function RenderProductDetail() {
  prod = JSON.parse(localStorage.getItem("product"));
  pid = localStorage.getItem("pid");
  sid = localStorage.getItem("sid");
  Renderlogin();
  if ( localStorage.getItem('uid')!=null && localStorage.getItem('uid') == sid) {
    document.getElementById("delete").innerHTML = "Delete";
  }
  else {
    document.getElementById("delete").innerHTML = "Purchase";
  }
  console.log("This is prod:", prod)
  if (prod['sold']) {
    document.getElementById("delete").innerHTML = "Sold";
    document.getElementById("delete").setAttribute("disabled", "");
  }
  apigClient.findUserPost({}, {"id": sid}, {})
    .then(function(result){
      // Add success callback code here.
      console.log('Getting seller email:', result);
      document.getElementById("contact").innerHTML += '<a href="mailto:'
      +result["data"]["user_email"]
      +'">'
      +result["data"]["user_email"]
      +'</a>';
      
    }).catch(function(result){
      // Add error callback code here.
      console.log(result);
    });
  document.getElementById("pname").innerHTML = prod['pname'];
  document.getElementById("pname").style.textTransform = "capitalize";
  document.getElementById("ptype").innerHTML = prod.ptype;
  document.getElementById("ptype").style.textTransform = "capitalize";
  document.getElementById("description").innerHTML += prod.description;
  document.getElementById("location").innerHTML += prod.location;
  document.getElementById("price").innerHTML += prod.price;
}

function GetProductDelete() {
  if (localStorage.getItem('uid') == null){
    alert("Please login first.");
    window.location.href = "login_account.html";
  }
  seller_id = localStorage.getItem("sid");
  uid = localStorage.getItem("uid");
  pid = localStorage.getItem("pid");
  if (uid != seller_id) { GetProductPurchase(pid); return; }


  console.log('Try Delete Product');
  apigClient.getProductPidPost ({'pid': pid}, {'type': 'delete'}, {})
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
  console.log('Try Purchasing Product');
  body = {
    "seller_id":localStorage.getItem("sid"),
    "product_id":localStorage.getItem("pid"),
    "buyer_id":localStorage.getItem("uid")
  };
  apigClient.getProductPidPost ({'pid': pid}, {'type': 'purchase'}, {})
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Set product.sold=True Success');
    }
    ).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });
  apigClient.apiRecordInsertPost({},body,{}).then(function (result) {
    // Add success callback code here.
    console.log("Result : ", result);
    console.log('Craete order Success');
    alert("Purchase Product Success");
    RedirectOrders('buyer');
  }).catch(function (result) {
    // Add error callback code here.
    console.log(result);
  });
}

function RedirectOrders(type){
  localStorage.setItem('type', type);
  window.location.href = "orders.html";
}

function RenderOrders(){
  GeneralOnload();
  if (localStorage.getItem('uid') == null){
    alert("Please login first.");
    window.location.href = "login_account.html";
  }
  console.log('Try Get SellerId');
  var user_id = localStorage.getItem('uid');
  // var user_id = 10;
  var body = {};
  var additionalParams = {};
  var params = {};
  type = localStorage.getItem('type');

  if (type=='seller') {
    var body = {"seller":user_id};
    console.log('Try Get Orders By BuyerId');

    apigClient.getOrdersBySellerPost(params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      data = result["data"]
      console.log(data)
      // Add success callback code here.
      console.log("Result : ", result);

      template = '<h1> Your Selling Orders </h1>'+
                  '<table class="table table-striped">'+
                  '<tr>'+
                      '<th scope="col"><b> order id </b></th>'+
                      '<th scope="col"><b> product name </b></th>'+
                      '<th scope="col"><b> buyer email </b></th>'+
                  '</tr>'+
                  '<tr>';
      for (var p in data){
          template += '<td>'+data[p].order_id+'</td>'+
          '<td><a href="javascript:GetProductbyID('+data[p].pname.data[0].pid +')">' +data[p].pname.data[0].pname+' </a></td>'+
          '<td><a href="mailto:'+data[p].buyer_email.user_email+'">'+data[p].buyer_email.user_email+'</a>'+'</td>'+
          '</tr>';
          }
      template += '</tr>'+
          '</table>'
      document.getElementById('orderByUserId').innerHTML = template;
    }
    ).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });
  } else {
    var body = {"buyer":user_id};
    console.log('Try Get Orders By BuyerId');
    apigClient.getOrdersByBuyerPost(params, body, additionalParams)
    .then(function (result) {
    data = result["data"]
    // Add success callback code here.
    console.log("Result : ", result);
    // alert("Get Orders Success");
    template = '<h1> Your Buying Orders </h1>'+
                '<table class="table table-striped">'+
                '<tr>'+
                    '<th scope="col"><b> order id </b></th>'+
                    '<th scope="col"><b> product name </b></th>'+
                    '<th scope="col"><b> seller email </b></th>'+
                '</tr>'+
                '<tr>'
    for (var p in data){
        template += '<td>'+data[p].order_id+'</td>'+
        '<td><a href="javascript:GetProductbyID('+data[p].pname.data[0].pid +')">' +data[p].pname.data[0].pname+' </a></td>'+
        '<td><a href="mailto:'+data[p].seller_email.user_email+'">'+data[p].seller_email.user_email+'</a></td>'+
        '</tr>';
        }
    template += '</tr>'+
          '</table>'
    document.getElementById('orderByUserId').innerHTML = template;
    }).catch(function (result) {
    // Add error callback code here.
    console.log(result);
    });
  };

  };




