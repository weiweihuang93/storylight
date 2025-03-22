import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function OrderPage() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({ mode: "onBlur" });

  const paymentMethod = watch("paymentMethod");

  const { setOrderId, cartData, setCartData } = useContext(AppContext);

  const submitOrder = async (data) => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data)
      // console.log(res.data);
      setOrderId(res.data.orderId)
      setCartData([]); //清空購物車資料
      navigate("/cart/payment");
    }catch (error){
      // console.log(error)
    }
  };

  const onSubmit = (data) => {
    const { paymentMethod, message, ...user } = data;
    const userData = {
      data: {
        user,
        message,
        paymentMethod
      }
    };
    submitOrder(userData);
    reset();
  };

  return (
    <>
    <section className="section-order">
      <div className="container p-6">
        <form  onSubmit={handleSubmit(onSubmit)} className="row g-3">
          {/* 付款方式 */}
          <div className="col-lg-4">
            <div className="bg-white px-3 py-4 border rounded h-100">
              <div className="mb-4">
                <h3 className="mb-3">付款方式</h3>
                <div className="d-flex flex-column gap-3">
                  <label className="d-flex align-items-center">
                    <input {...register("paymentMethod", { required: "請選擇付款方式" })} type="radio" value="creditcard" className="me-2" />
                    信用卡
                  </label>
                  <label className="d-flex align-items-center">
                    <input {...register("paymentMethod")} type="radio" value="atm" className="me-2" />
                    ATM轉帳
                  </label>
                </div>
                {errors?.paymentMethod && <p className="text-danger my-2">{errors.paymentMethod.message}</p>}
              </div>

              {/* 信用卡付款欄位 */}
              {paymentMethod === "creditcard" && (
                <div className="border p-3 mb-3">
                  <h5>信用卡資訊</h5>
                  <div className="mb-2">
                    <label className="form-label">信用卡號</label>
                    <input type="text" className="form-control" {...register("creditCardNumber")} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">持卡人姓名</label>
                    <input type="text" className="form-control" {...register("cardHolder")} />
                  </div>
                  <div className="row">
                    <div className="col">
                      <label className="form-label">有效期限</label>
                      <input type="text" className="form-control" placeholder="MM/YY" {...register("expiryDate")} />
                    </div>
                    <div className="col">
                      <label className="form-label">CVC</label>
                      <input type="text" className="form-control" {...register("cvc")} />
                    </div>
                  </div>
                </div>
              )}

              {/* ATM付款欄位*/}
              {paymentMethod === "atm" && (
                <div className="border p-3 mb-3">
                <h5>ATM 轉帳資訊</h5>
                <p>銀行代碼：<strong>123</strong></p>
                <p>帳戶號碼：<strong>9876543210</strong></p>
              </div>
              )}
            </div>
          </div>

          {/* 訂單表單 */}
          <div className="col-lg-8">
            <div className="bg-white px-3 py-4 border rounded">
                <h3 className="mb-3">訂單資料</h3>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-bold mb-lg-2 mb-1">
                      Email
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email 欄位必填',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Email 格式錯誤'
                        }
                      })}
                      id="email" type="email" className={`form-control border-radius-8 py-2 px-3 ${errors.email && 'is-invalid'}`} placeholder="請輸入Email" />
                      {errors?.email && <p className="text-danger my-2">{errors.email.message}</p>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label fw-bold mb-lg-2 mb-1">
                      姓名
                    </label>
                    <input
                      {...register('name', {
                        required: '姓名 欄位必填'
                      })}
                      id="name" type="text" className={`form-control border-radius-8 py-2 px-3 ${errors.name && 'is-invalid'}`} placeholder="請輸入姓名" />
                      {errors?.name && <p className="text-danger my-2">{errors.name.message}</p>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="tel" className="form-label fw-bold mb-lg-2 mb-1">
                      電話
                    </label>
                    <input
                      {...register('tel', {
                        required: '電話 欄位必填',
                        pattern: {
                          value: /^(0[2-8]\d{7}|09\d{8})$/,
                          message: '電話 格式錯誤'
                        }
                      })}
                      id="tel" type="tel" className={`form-control border-radius-8 py-2 px-3 ${errors.tel && 'is-invalid'}`} placeholder="請輸入電話" />
                      {errors?.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label fw-bold mb-lg-2 mb-1">
                      地址
                    </label>
                    <input
                      {...register('address', {
                        required: '地址 欄位必填'
                      })}
                      id="address" type="text" className={`form-control border-radius-8 py-2 px-3 ${errors.address && 'is-invalid'}`} placeholder="請輸入地址" />
                      {errors?.address && <p className="text-danger my-2">{errors.address.message}</p>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="message" className="form-label fw-bold mb-lg-2 mb-1">
                      留言
                    </label>
                    <textarea
                      {...register('message')}
                      id="message" name="message" className="form-control" cols="30" rows="4" placeholder="請輸入留言"></textarea>
                  </div>
                </div>

                {/* 進行下一步的按鈕 */}
                <div className="text-end mt-3">
                  <button type="submit" className="btn btn-orange-dark px-4 py-2" disabled={cartData.length === 0}>
                    送出訂單
                  </button>
                </div>
            </div>
          </div>
        
        </form>
      </div>
    </section>
    </>
  );
}