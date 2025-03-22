import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CompletePage(){
  
  const { orderId } = useContext(AppContext);
  const [order, setOrder] = useState({});

  useEffect(() => {
    getOrderId();
  }, [orderId])

  const getOrderId = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/order/${orderId}`);
      // console.log(res.data.data.carts);
      // console.log('getOrderId', res.data.order);
      setOrder(res.data.order);
    }catch(err){
      // console.log(err);
    }
  }

  return(
    <>
    <section className="section-order">
      <div className="container p-6">
        <div className="text-center">
          <span className="material-symbols-outlined d-block fs-1 text-success">
            check_circle
          </span>
          <h3 className="mb-3">已收到您的訂單，感謝你的購買</h3>
        </div>

        <div className="order-content mt-4 p-4 border rounded bg-white w-50">
          <h5 className="mb-3">訂單資訊</h5>
          <ul>
            <li><strong>訂單編號：</strong>{orderId}</li>
            <li><strong>訂單時間：</strong>{order.create_at}</li>
            <li><strong>運送方式：</strong>宅配</li>
            <li className="text-danger">預計出貨時間：2-3 個工作天內</li>
            <li>
              <strong>總金額：</strong>NT$ {order.total < 1500 ? order.total + 100 : order.total}
              {order.total < 1500 && <span className="text-muted">（已加收運費 NT$ 100）</span>}
            </li>
            <li>
              <strong>付款狀態：</strong>
              {order.is_paid ? <span className="text-success">已付款</span> : <span className="text-danger">尚未付款</span>}
            </li>
          </ul>
        </div>
        <div className="order-content mt-4 p-4 border rounded bg-white w-50">
          <h5 className="mb-3">訂單明細</h5>
          <ul>
            {Object.values(order.products || {}).map((item) => (
              <li key={item.product_id} className={`d-flex align-items-center ${order.products.length > 1 ? "border-bottom pb-3" : ""}`}>
                <img src={item.product.imageUrl} alt={item.product.title} className="me-3 rounded" width="80" />
                <div>
                  <h6 className="">{item.product.title}</h6>
                  <p>數量：{item.qty} | 價格：NT$ {item.final_total}</p>
                </div>
              </li>
              ))}
          </ul>
        </div>

        <div className="mt-5">
          <a href="/" className="btn btn-orange-dark me-3">返回首頁</a>
          <a href="/" className="btn btn-outline-orange-dark">查看訂單(未)</a>
        </div>
      </div>
    </section>
    </>
  )
}