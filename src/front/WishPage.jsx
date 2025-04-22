import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export default function WishPage() {

  const dispatch = useDispatch();
  
  const [requests, setRequests] = useState([
    { id: 1, title: "深入淺出 JavaScript", author: "Kyle Simpson", date: "2025/03/26" },
    { id: 2, title: "設計模式解析", author: "Erich Gamma", date: "2025/03/08" },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm({ mode: "onBlur" });

  const onSubmit = (data) => {
    const newWish = {
      id: requests.length + 1,
      title: data.title,
      author: data.author,
      date: new Date().toLocaleDateString()
    };
    setRequests([...requests, newWish]);
    dispatch(pushMessage({
      success: true,
      message: '您的願望已提交！'
    }))
    reset();
  };

  const handleFromISBN = async() => {
    const isbn = watch("isbn");
    if (!isbn){
      dispatch(pushMessage({
        success: false,
        message: '請先輸入ISBN'
      }));
      return;
    }
    try{
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`)
      const apiBook = res.data.items?.[0];
      if (!apiBook){
        dispatch(pushMessage({
          success: false,
          message: '查無資料，請確認 ISBN 是否正確'
        }));
      return;
      }

      setValue('title', apiBook.volumeInfo.title || '');
      setValue('author', apiBook.volumeInfo.authors[0] || '');
      setValue('publisher', apiBook.volumeInfo.publisher || '');
      dispatch(pushMessage({
        success: true,
        message: `找到 ${res.data.totalItems} 筆資料，已成功套用`
      }));
    
    }
    catch(error){
      dispatch(pushMessage({
        success: false,
        message: '搜尋時發生錯誤，請稍後再試'
      }));
    }
  }

  return (
    <>
    <div className="container py-3">
      {/* 麵包屑導航 */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">首頁</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            許願池
          </li>
        </ol>
      </nav>

      {/* 徵求書籍表單 */}
      <section className="section-request mb-5">
        <div className="bg-secondary-600 py-lg-6 p-5 rounded shadow">
          <div className="container">
            <h2 className="text-center mb-lg-5 mb-4">許願池</h2>
            <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="col-md-6">
                <label htmlFor="title" className="form-label fw-bold mb-lg-2 mb-1">書名</label>
                <input 
                  {...register("title", { 
                    required: "請輸入書名", 
                    minLength: { value: 2, message: "書名最少2個字" }, 
                    maxLength: { value: 30, message: "書名最多20個字" } 
                  })} 
                  id="title" type="text" className="form-control" placeholder="請輸入書名" required />
                  {errors?.title && <p className="text-danger my-2">{errors.title.message}</p>}
              </div>
              <div className="col-md-6">
                <label htmlFor="isbn" className="form-label fw-bold mb-lg-2 mb-1">ISBN</label>
                <div className="input-group">
                  <input
                    {...register("isbn", { 
                      required: "請輸入ISBN", 
                      pattern: { value: /^(97(8|9))?\d{9}(\d|X)$/, message: "請輸入正確的ISBN格式" }
                    })} 
                    id="isbn" type="text" className="form-control" placeholder="請輸入ISBN書碼" />
                  <button
                    className="btn btn-orange"
                    type="button"
                    onClick={handleFromISBN}
                    >
                    搜尋
                  </button>
                </div>
                {errors?.isbn && <p className="text-danger my-2">{errors.isbn.message}</p>}
              </div>
              <div className="col-md-6">
                <label htmlFor="author" className="form-label fw-bold mb-lg-2 mb-1">作者</label>
                <input
                  {...register("author", { 
                    required: "請輸入作者", 
                    minLength: { value: 2, message: "作者最少2個字" }, 
                    maxLength: { value: 10, message: "作者最多10個字" } 
                  })} 
                  id="author" type="text" className="form-control" placeholder="請輸入作者" />
                  {errors?.author && <p className="text-danger my-2">{errors.author.message}</p>}
              </div>
              <div className="col-md-6">
                <label htmlFor="publisher" className="form-label fw-bold mb-lg-2 mb-1">出版社</label>
                <input
                  {...register("publisher", { 
                    required: "請輸入出版社", 
                    minLength: { value: 2, message: "出版社最少2個字" }, 
                    maxLength: { value: 10, message: "出版社最多10個字" } 
                  })} 
                  id="publisher" type="text" className="form-control" placeholder="請輸入出版社" />
                  {errors?.publisher && <p className="text-danger my-2">{errors.publisher.message}</p>}
              </div>
              <div className="col-md-6">
                <label htmlFor="price" className="form-label fw-bold mb-lg-2 mb-1">期望價格</label>
                <input
                  {...register("price", { 
                    required: "請輸入期望價格", 
                    pattern: { value: /^[0-9]+$/, message: "價格只能輸入數字" }, 
                    min: { value: 100, message: "最低價格為100元" }, 
                    max: { value: 9999, message: "最高價格為9999元" }
                  })} 
                  id="price" type="number" className="form-control" placeholder="請輸入期望價格" />
                  {errors?.price && <p className="text-danger my-2">{errors.price.message}</p>}
              </div>
              <div className="col-12">
                <label className="form-label fw-bold mb-lg-2 mb-1">備註</label>
                <textarea className="form-control" rows="3" placeholder="填寫更多細節，如是否接受劃線書況等"></textarea>
              </div>
              <div className="col-12 text-end">
                <button
                  disabled={!isValid}
                  type="submit" className="btn btn-orange-dark">提交徵求
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 近期徵求列表 */}
      <section className="section-recent mb-5">
        <div className="bg-wrap py-lg-6 p-5 rounded shadow">
          <div className="container">
            <h2 className="text-center mb-4">近期徵求</h2>
            <div className="row g-4">
              {requests.map((req) => (
                <div key={req.id} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{req.title}</h5>
                      <p className="card-text text-muted mb-2">作者: {req.author}</p>
                      <p className="text-end text-secondary small">{req.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}