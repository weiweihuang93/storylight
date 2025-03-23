import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){

  const navigate = useNavigate();

  // const [cartData, setCartData] = useState([]);
  const { cartData, setCartData, shippingAdd, setShippingAdd, selectedCoupon, setSelectedCoupon } = useContext(AppContext);
  // // const [selectedCoupon, setSelectedCoupon] = useState("");
  // const [selectedCouponDescription, setSelectedCouponDescription] = useState("");
  // const [totalAfterCoupon, setTotalAfterCoupon] = useState("");
  // // const [shippingAdd, setShippingAdd] = useState(false);
  // // const [shippingRemove, setShippingRemove] = useState(false); // 避免重複刪除運費

  const addcoupons = [
    { code: "WELCOME", title: "新會員專屬優惠", description: "新會員首次購物可享 70% 折扣" },
    { code: "MONTHLY90", title: "限時折扣券", description: "購物可享 90% 折扣，限時使用" },
    { code: "NONE", title: "不使用優惠券", description: "不使用優惠券" },
  ];

  // useEffect(() => {
  //   getCart();
  // }, []); 

  useEffect(() => {
    handleCoupon()
  }, []);

  useEffect(() => {
    const isShippingInCart = cartData?.carts?.some((item) => item.product_id === "-OLDh-kx-_pNd2Ls902s");
    if (isShippingInCart){
      setShippingAdd(true);
      if (cartData.final_total >= 1600 || cartData.carts.length === 1){
        //移除運費商品
        const findCartId = cartData.carts.find((item) => item.product_id === "-OLDh-kx-_pNd2Ls902s")?.id;
        delIdCart(findCartId);
      }
    }else{
      setShippingAdd(false);
      if (cartData?.carts?.length > 0 && cartData.final_total < 1500){
        updateCart();
      }
    };
  }, [cartData]);

  const getCart = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      // console.log(res.data.data.carts);
      // console.log('getCart', res);
      setCartData(res.data.data);
    }catch(err){
      // console.log(err);
    }
  };

  const delCart = async() => {
    try{
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      // console.log(res);
      getCart();
    }catch(err){
      console.log(err);
    }
  };

  const delIdCart = async(cart_id) => {
    try{
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      // console.log(res);
      getCart();
    }catch(err){
      console.log(err);
    }
  };

  const updateCart = async() => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        "data": {
          "product_id": "-OLDh-kx-_pNd2Ls902s", //加入運費商品
          "qty": 1
        }
      });
      // console.log('updateCart', res);
      setShippingAdd(true);
      getCart();
    }catch(err){
      console.log(err);
    }
  };

  const handleCoupon = async() => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/coupon`, {
        "data": {
          "code": "NONE"
        }
      });
      console.log("handleCoupon-NONE", res);
    }catch(err){
      console.log(err);
    }
  };

  return(
    <>
    <section className="section-cart">
      <div className="bg">
        <div className="container py-6">
          <h2 className="mb-4">購物車</h2>
          <div className="row g-3">
          {cartData?.carts?.length > 0 ?
          (<>
            <div className="col-xl-9">
              <div className="cart-confirm p-3">
                <div className="d-flex justify-content-between">
                  <h4>確認訂單</h4>
                  <button onClick={() => delCart()} className="btn btn-outline-danger fs-6" type="button">清空購物車</button>
                </div>
                
                <div className="cart-item fw-bold text-center">
                  <p className="cart-info">產品資料</p>
                  <p className="cart-price d-none d-md-block">單價</p>
                  <p className="cart-qty d-none d-md-block">數量</p>
                  <p className="cart-total">小計</p>
                  <p>刪除</p>
                </div>

                {cartData?.carts?.map((cart) => (
                <div className="cart-item" key={cart.id}>
                  <img src={cart.product.imageUrl} alt={cart.product.title} />
                  <div className="cart-info">
                    <p>{cart.product.maintitle}</p>
                  </div>
                  <p className="cart-price d-none d-md-block">NT${cart.product.price}</p>
                  <p className="cart-qty d-none d-md-block">x {cart.qty}</p>
                  <p className="cart-total">NT${cart.total}</p>
                  <button
                    onClick={() => delIdCart(cart.id)}
                    type="button"
                    className="btn btn-sm">
                    <span className="material-symbols-outlined icon-gray"> delete </span>
                  </button>
                </div>
                ))}

              </div>
            </div>
              
            <div className="col-xl-3 position">
              <div className="bg-white">
                <div className="cart-order px-3 py-4 border rounded">
                  <h4>訂單明細</h4>
                  <div className="d-flex justify-content-between">
                    <p>總金額</p>
                    <p>NT$ {cartData.total - (shippingAdd ? 100 : 0)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>宅配運費</p>
                    <p>NT$ {shippingAdd ? "100" : "0"}</p>
                  </div>
                  <p className={shippingAdd ? "text-gray-600" : "text-orange-dark"}>
                    {shippingAdd
                      ? "再加購一些商品，您就可以享有免運優惠囉！"
                      : "您已達免運門檻，快完成您的購物吧！"}
                  </p>

                {/* 進行下一步的按鈕 */}
                <button onClick={() => navigate("/cart/order")} className="btn btn-orange-dark w-100">
                  下一步，<span className="d-lg-inline d-xl-block">填寫訂單資料</span>
                </button>
                </div>
              </div>
            </div>
                
            </>) : 
            (<>
              <h4 className="text-gray-600 py-3">購物車目前沒有商品</h4>
            </>)}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}