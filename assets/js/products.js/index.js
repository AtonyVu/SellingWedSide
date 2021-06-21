let dataProduct = [];
let dataCart = [];
let TinhTien = 0;
const load = (callback) => {
  firebase
    .database()
    .ref("Product")
    .on("value", function (snapshot) {
      dataProduct = [];
      for (let id in snapshot.val()) {
        dataProduct.push(snapshot.val()[id]);
      }
      callback(dataProduct);
    });
};

const loadingProduct = (data) => {
  let products = document.getElementById("productsss");
  products.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    products.innerHTML += `	<div class="col-lg-3 col-6 product-incfhny mt-4">
    <div class="product-grid2 ">
        <div class="product-image2">
            
                <img class="pic-1 img-fluid" src="${data[i].link1}">
              <img class="pic-2 img-fluid" src="${data[i].link2}">
            
                <button class="add-to-cart" onclick="myFunction(${data[i].id})">MUA NGAY</button>
           
           
     
        </div>
        <div class="product-content">
            <h3 class="title"><a>${data[i].name} </a></h3>
            <span class="price"><del>${data[i].discount}</del>${data[i].price}</span>
        </div>
    </div>
</div>

</div>`;
  }
};
function myFunction(id) {
  let cartContainer = document.getElementById("cartContainer");
  let ulcart = document.getElementById("ulCart");
  let tongtien = document.getElementById("cart_content");
  let vitri = dataProduct.findIndex((item) => {
    return item.id == id;
  });
  if (vitri != -1) {
    let vitri1 = dataCart.findIndex((item) => {
      return item.id == dataProduct[vitri].id;
    });
    if (vitri1 != -1) {
      dataCart[vitri1].soluong += 1;
    } else {
      dataProduct[vitri] = { ...dataProduct[vitri], soluong: 1 };
      dataCart.push(dataProduct[vitri]);
    }
  }

  console.log(dataCart);
  ulcart.innerHTML = "";
  TinhTien = 0;
  dataCart.forEach((item) => {
    ulcart.innerHTML += `	<li> 
      <span>${item.name}</span>
      <div>
      <span class="soluong"> ${item.soluong}</span>
      <span>${item.price}</span>
      </div>
      
  </li>`;
    TinhTien += parseInt(item.price) * parseInt(item.soluong);
  });
  tongtien.innerText = "Tổng Tiền : " + TinhTien + " VND";
  cartContainer.classList.remove("offCart");
  cartContainer.classList.add("onCart");
}
function clickCart() {
  let cartContainer = document.getElementById("cartContainer");
  if (cartContainer.classList.contains("onCart")) {
    cartContainer.classList.remove("onCart");
    cartContainer.classList.add("offCart");
  } else {
    cartContainer.classList.remove("offCart");
    cartContainer.classList.add("onCart");
  }
}
function checkout() {
  let conficProducts = document.getElementById("conficProducts");
  let conficSumMoney = document.getElementById("conficSumMoney");
  conficSumMoney;
  if (dataCart.length > 0) {
    dataCart.forEach((item) => {
      conficProducts.innerHTML += `<li> 
      <span>${item.name}</span>
      <div>
      <span class="soluong"> ${item.soluong}</span>
      <span>${item.price}</span>
      </div>
      
  </li>`;
    });
    conficSumMoney.innerText = "TỔNG TIỀN : " + TinhTien + "VND";
  }
}
async function sendInfoCustom() {
  let myform = document.getElementById("myform");
  let name = document.getElementById("name");
  let SDT = document.getElementById("SDT");
  let address = document.getElementById("address");
  let dataSend = {
    name: name.value,
    SDT: SDT.value,
    address: address.value,
    products: dataCart,
  };
  await firebase.database().ref("Customer").push(dataSend);
  name.value = "";
  SDT.value = "";
  address.value = "";
  dataCart = [];
  cartContainer.classList.remove("onCart");
  cartContainer.classList.add("offCart");
}
load(loadingProduct);
