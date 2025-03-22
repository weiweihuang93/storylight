import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){

  // console.log(new Date("2025-03-19").getTime() / 1000);

  const navigate = useNavigate();

  // const [cartData, setCartData] = useState([]);
  const { cartData, setCartData } = useContext(AppContext);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [selectedCouponDescription, setSelectedCouponDescription] = useState("");
  const [totalAfterCoupon, setTotalAfterCoupon] = useState("");

  const addcoupons = [
    { code: "WELCOME", title: "新會員專屬優惠", description: "新會員首次購物可享 70% 折扣" },
    { code: "TEST", title: "測試截止日期", description: "測試折扣" }
  ];

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      // console.log(res.data.data.carts);
      console.log('getCart', res);
      setCartData(res.data.data)
    }catch(err){
      // console.log(err);
    }
  }

  const delCart = async() => {
    try{
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      // console.log(res);
      getCart();
    }catch(err){
      console.log(err);
    }
  }

  const delIdCart = async(cart_id) => {
    try{
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      // console.log(res);
      getCart();
    }catch(err){
      console.log(err);
    }
  }

  const handleCoupon = async() => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/coupon`, {
        "data": {
          "code": selectedCoupon
        }
      });
      // console.log('handleCoupon', res);
      setTotalAfterCoupon(res.data.data);

      // 更新優惠券描述
    const selectCouponData = addcoupons.find(coupon => coupon.code === selectedCoupon);
    setSelectedCouponDescription(selectCouponData ? selectCouponData.description : "");
    }catch(err){
      console.log(err);
    }
  }

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
              
            <div className="col-xl-3">
              <div className="bg-white">
                <div className="cart-order px-3 py-4 border rounded">
                  <h4>訂單明細</h4>
                  <div className="d-flex justify-content-between">
                    <p>總金額</p>
                    <p>NT$ {cartData.total}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>宅配運費</p>
                    <p>NT$ {cartData.total >= 1500 ? "0" : "100"}</p>
                  </div>
                  <p className={cartData.total >= 1500 ? "text-orange-dark" : "text-gray-600"}>
                    {cartData.total >= 1500 
                      ? "您已達免運門檻，快完成您的購物吧！"
                      : "再加購一些商品，您就可以享有免運優惠囉！"}
                  </p>
                </div>

                {/* 優惠券選擇區塊 */}
                <div className="cart-order px-3 py-4 border rounded">
                  <h5 className="">選擇優惠券</h5>
                  <select 
                    className="form-select" 
                    value={selectedCoupon} 
                    onChange={(e) => setSelectedCoupon(e.target.value)}
                  >
                    <option value="">請選擇優惠券</option>
                    {addcoupons.map((coupon, index) => (
                      <option key={index} value={coupon.code}>
                        {coupon.title}
                      </option>
                    ))}
                  </select>

                  <button onClick={handleCoupon} className="btn btn-orange w-100">
                    使用優惠券
                  </button>
                </div>

                {/* 顯示優惠折扣（只有在按下按鈕後才會顯示） */}
                <div className="cart-order px-3 py-4 border rounded">
                  {totalAfterCoupon && (
                    <>
                    <div className="d-flex justify-content-between">
                      <p>優惠折扣</p>
                      <p>－ NT$ {cartData.total - totalAfterCoupon.final_total}</p>
                    </div>

                    {/* 顯示優惠券描述 */}
                    <div>
                      <p className="text-orange-dark">{selectedCouponDescription}</p>
                    </div>
                    </>
                  )}

                {/* 顯示結帳金額 */}
                  {totalAfterCoupon ? 
                  (<>
                  <div className="d-flex justify-content-between">
                    <h5>結帳金額</h5>
                    <h5 className="text-danger">NT$ {totalAfterCoupon.final_total + (cartData.total >= 1500 ? 0 : 100)}</h5>
                  </div>
                  </>) : 
                  (<>
                  <div className="d-flex justify-content-between">
                    <h5>結帳金額</h5>
                    <h5 className="text-danger">NT$ {cartData.total + (cartData.total >= 1500 ? 0 : 100)}</h5>
                  </div>
                  </>)}
                </div>


                {/* 進行下一步的按鈕 */}
                <button onClick={() => navigate("/cart/order")} className="btn btn-orange-dark w-100">
                  下一步，<span className="d-lg-inline d-xl-block">填寫訂單資料</span>
                </button>

              
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