import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { Modal } from "bootstrap";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminOrder(){

  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  
  const orderModalRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState({
    id: "",
    create_at: 0,
    total: 0,
    is_paid: false,
    status: "",
    user: {
      name: "",
      email: "",
      tel: "",
      address: "",
      message: ""
    },
    products: [],
  });

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      getOrder();
    }else{
      Navigate("/adminLogin");
      return;
    }
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    const modalInstance = Modal.getInstance(orderModalRef.current);
    modalInstance.show();
  }

  const closeModal = () => {
    const modalInstance = Modal.getInstance(orderModalRef.current);
    modalInstance.hide();
  };

  const getOrder = async (page = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/orders?page=${page}`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const updateOrder = async (order_id, order_paid) => {
    try {
      const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${order_id}`,{
        data: {
          status: selectedStatus,
          is_paid: order_paid
        }
      });
      dispatch(pushMessage(res.data));
      closeModal();
      getOrder();
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const delIdOrder = async (order_id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${order_id}`);
      dispatch(pushMessage(res.data));
      getOrder();
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    getProduct(page);
  };

  useEffect(() => {
    new Modal(orderModalRef.current, {
      backdrop: false
    });
  }, []);
  
  return(
    <>
    <div className="container">
      <div className="row py-3 g-3">
        <div className="col-12">
          <h4>訂單資訊</h4>
        </div>

        {/* 搜尋 & 分類篩選 */}
        <div className="col-md-6">
          <div className="d-flex">
            <input type="text" className="form-control" placeholder="搜尋" />
            <button className="btn px-2 py-0">
              <span className="material-symbols-outlined icon-black"> search </span>
            </button>
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option value="" disabled>選擇交易狀態</option>
            <option value="未付款" >未付款</option>
            <option value="已付款" >已付款</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option value="" disabled>選擇訂單狀態</option>
            <option value="未確認">未確認</option>
            <option value="已出貨">已出貨</option>
          </select>
        </div>

        {/* 訂單列表 */}
        <div className="col-12">
          <div className="order-header fw-bold text-center">
            <span className="order-date d-none d-md-block">訂單日期</span>
            <span className="order-username">聯絡人</span>
            <span className="order-price d-none d-md-block">訂單金額</span>
            <span className="order-paid">交易狀態</span>
            <span className="order-status">訂單狀態</span>
            <span className="order-action">操作</span>
          </div>

          <div className="product-list">
            {orders.map((order) => (
            <div className="order-item text-center" key={order.id}>
              <span className="order-date d-none d-md-block">{new Date(order.create_at *1000).toLocaleDateString("zh-TW")}</span>
              <span className="order-username">{order.user.name}</span>
              <span className="order-price d-none d-md-block">{parseInt(order.total, 10)}</span>
              <span className={`order-paid ${order.is_paid ? "text-success fw-bold" : "text-danger fw-bold"}`}>{order.is_paid ? "已付款" : "未付款"}</span>
              <span className={`order-status ${order.status === "已出貨" ? "text-success fw-bold" : "text-danger fw-bold"}`}>{order.status}</span>
              <span className="order-action">
                <div className="d-flex gap-2">
                  <button
                    onClick={() => openModal(order)}
                    className="btn btn-outline-primary btn-sm"
                  >
                    查看
                  </button>
                  <button
                    onClick={() => delIdOrder(order.id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    刪除
                  </button>
                </div>
              </span>
            </div>
          ))}
          </div>
        </div>

        {/* 分頁 */}
        <nav className="pagination-container" aria-label="分頁導航">
          <ul className="pagination">
            {/* 上一頁按鈕 */}
            <li className={`page-item ${pagination.has_pre ? '' : 'disabled'}`}>
              <a 
                onClick={(e) => handlePageChange(e, pagination.current_page - 1)}
                className="page-link"
                href="#">
                上一頁
              </a>
            </li>
            {/* 頁碼 */}
            {Array.from({ length: pagination.total_pages }).map((_, index) => (
              <li key={index} className={`page-item ${pagination.current_page === index + 1 ? 'active' : ''}`}>
                <a 
                  onClick={(e) => handlePageChange(e, index + 1)}
                  className="page-link"
                  href="#">
                  {index + 1}
                </a>
              </li>
            ))}
            {/* 下一頁按鈕 */}
            <li className={`page-item ${pagination.has_next ? '' : 'disabled'}`}>
              <a
                onClick={(e) => handlePageChange(e, pagination.current_page + 1)}
                className="page-link"
                href="#">
                下一頁
              </a>
            </li>
          </ul>
        </nav>

        {/* modal */}
        <div id="orderModal" ref={orderModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">

              <div className="modal-header border-bottom">
                <h5 className="modal-title">詳細訂單資訊</h5>
                <button onClick={() => closeModal()} type="button" className="btn-close" aria-label="Close"></button>
              </div>

            {/* Modal Body */}
            <div className="modal-body overflow-auto" style={{ maxHeight: "80vh" }}>
              {/* 訂單資訊 */}
              <div className="p-3">
                <h6 className="mb-2">訂單明細</h6>
                <ul className="d-flex flex-column gap-3 p-3 border rounded">
                  <li><strong>訂單編號：</strong>{selectedOrder.id}</li>
                  <li><strong>訂單日期：</strong>{new Date(selectedOrder.create_at * 1000).toLocaleString("zh-TW")}</li>
                  <li><strong>總金額：</strong>NT$ {parseInt(selectedOrder.total, 10)}</li>
                  <li><strong>付款狀態：</strong> 
                    <span className={selectedOrder.is_paid ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {selectedOrder.is_paid ? "已付款" : "未付款"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* 客戶資訊 */}
              <div className="p-3">
                <h6 className="mb-2">買家資訊</h6>
                <ul className="d-flex flex-column gap-3 p-3 border rounded">
                  <li><strong>姓名：</strong>{selectedOrder.user.name}</li>
                  <li><strong>Email：</strong>{selectedOrder.user.email}</li>
                  <li><strong>電話：</strong>{selectedOrder.user.tel}</li>
                  <li><strong>地址：</strong>{selectedOrder.user.address}</li>
                  <li><strong>留言：</strong>{selectedOrder.user.message}</li>
                </ul>
              </div>

              {/* 訂單內容 */}
              <div className="p-3">
                <h6 className="mb-2">訂單內容</h6>
                <ul className="d-flex flex-column gap-3 p-3 border rounded">
                {Object.values(selectedOrder.products).map((product) => (
                  <li key={product.product.id}>{product.product.title} x {product.qty}</li>
                ))}
                </ul>
              </div>

              {/* 更新訂單狀態*/}
              <div className="p-3">
                <h6 className="mb-2">訂單狀態</h6>
                <select 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  value={selectedOrder.status}
                  className="form-select">
                  <option value="" disabled>選擇狀態</option>
                  <option value="未確認">未確認</option>
                  <option value="已出貨">已出貨</option>
                </select>
              </div>

              <div className="modal-footer border-top bg-light">
                <button
                  onClick={() => closeModal()}
                  type="button" className="btn btn-secondary">
                  取消
                </button>
                <button
                  onClick={() => updateOrder(selectedOrder.id, selectedOrder.is_paid)}
                  type="button" className="btn btn-primary">
                  確認
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  )
}