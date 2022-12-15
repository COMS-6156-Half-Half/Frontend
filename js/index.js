var apigClient = apigClientFactory.newClient({
    region: 'us-east-1'
});


// 

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
      console.log(result);
    });
};

function RenderSearch_Ptype(){
  document.getElementById('title').innerHTML = 'Here is the result for ' +localStorage.getItem('ptype');
  console.log(localStorage.getItem('product_list'));
  let product_list = JSON.parse(localStorage.getItem('product_list'));
  for (prod in product_list){
    console.log(product_list[prod]);
    console.log( document.getElementById('product_list'))
    document.getElementById('product_list').innerHTML += 
    '<tr>'
    +'<td><a onclick="GetProductbyID(\''+prod.pid +'\") '+prod.pname+' </a></td>'
      +'<td><a onclick="FetchbyType(\''+prod.ptype+'\") ' +prod.ptype+' </a></td>'
        +'<td> '+prod.description +'</td>'
          +'<td> '+prod.location+ '</td>'
            +'<td> '+ prod.price +' </td>'
              +'</tr>'           
    }
}

function RenderSearch_Pname(){
  document.getElementById('title').innerHTML = 'Here is the result for ' +localStorage.getItem('pname');
  console.log(localStorage.getItem('product_list'));
  let product_list = JSON.parse(localStorage.getItem('product_list'));

  for (prod in product_list){
    console.log(product_list[prod]);
    var prod = product_list[prod];
    console.log(prod)
    document.getElementById('product_list').innerHTML += 
    '<tr>'
    +'<td><a href="javascript:GetProductbyID('+prod.pid +')">' +prod.pname+' </a></td>'
      +'<td><a href="javascript:FetchbyType('+"'"+prod.ptype+"'"+')">' +prod.ptype+' </a></td>'
        +'<td> '+prod.description +'</td>'
          +'<td> '+prod.location+'</td>'
            +'<td> '+ prod.price +' </td>'
              +'</tr>'             
    }

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

function FetchbyType(type){
  console.log(type)
  var params = {'ptype': type
  };
  var body = {
  };
  var additionalParams = {
  };

  apigClient.searchPtypePtypeGet(params, body, additionalParams)
  .then(function(result){
    var data = result["data"];
    localStorage.setItem('searchbyptype', JSON.stringify(data))
    localStorage.setItem('ptype',type)
    console.log(data)
    window.location.href = "search_ptype.html";
  }).catch(function(result){
    // Add error callback code here.
    console.log(result);
  });
}


function GetProductbyID(pid) {
  var params = {
    'pid': pid
  };
  var body = {};
  var additionalParams = {};

  var uid = 0;

  console.log('Try Get Product');

  apigClient.currentUserGet(params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Get User Success');
      localStorage.setItem('uid', JSON.stringify(result));
      uid = JSON.stringify(result);
      alert("Get User Success");
  }).catch(function (result) {
    // Add error callback code here.
    console.log(result);
  });

  apigClient.getProductPidGet (params, body, additionalParams)
    .then(function (result) {
      // Add success callback code here.
      console.log("Result : ", result);
      console.log('Get product Success');
      localStorage.setItem('product', JSON.stringify(result));
      alert("Get Product Success");
      sid = JSON.stringify(result).seller_id;
      window.location.href = "search_product.html";
    }).catch(function (result) {
      // Add error callback code here.
      console.log(result);
    });

  if (uid == sid) {
    localStorage.setItem('isSeller', true);
  }
  else {
    localStorage.setItem('isSeller', false);
  }
};

function GetProductDelete(pid) {
  params = {'pid': pid};
  body = {};
  additionalParams = {};
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

function GetProductPurchase(pid) {

}