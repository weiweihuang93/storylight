import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductPage(){
  
  const dispatch = useDispatch();
  const { id } = useParams();
  const [productsData, setProductsData] = useState([]);
  const { cartData, addCart, favorites, toggleFavorite } = useContext(AppContext);

  useEffect(() => {
    const getProductId = async() => {
      try{
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
        setProductsData(res.data.product);
      }catch(err){
        dispatch(pushMessage({
          success: false,
          message: '載入商品資料發生錯誤，請稍後再試。'
        }))
      }
    }
    getProductId();
  }, [id]);
  
  const isInCart = cartData?.carts?.some((item) => item.product_id === id);
  
  return(
    <>
    <section className="section-product">
      <div className="bg py-3">          
        <div className="container">

          {/* 麵包屑導航 */}
          <nav aria-label="breadcrumb mt-5">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">首頁</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/category">全部商品</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                <Link to={`/category/${productsData.category}`}>{productsData.category}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {productsData.title}
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-lg-4">
              {/* 產品圖片區 */}
              <div className="product-info h-100">
                <div className="product-img text-center">
                  <img src={productsData.imageUrl} alt={productsData.title} />
                  <button onClick={() => toggleFavorite(productsData.id)} className={`position-absolute border-0 favorite-btn ${favorites[productsData.id] ? 'favorite-active' : ''}`}>
                    <span className={`material-symbols-outlined ${favorites[productsData.id] ? 'icon-fill' : ''}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">{productsData.condition}</p>
                </div>
                <div className="product-price mb-2">
                  <del className="text-sm me-3">售價：{productsData.origin_price}</del>
                  <p className="fs-5 text-danger fw-bold">
                    <span className="material-symbols-outlined text-primary me-2">paid</span>{productsData.price}
                  </p>
                </div>
                <button
                  onClick={() => addCart(productsData.id)}
                  className={`btn w-100 mt-auto ${
                    productsData.qty === 0 ? "btn-gray-600" : isInCart ? "btn-gray-600" : "btn-warning"
                  }`}
                  type="button"
                  disabled={isInCart || productsData.qty === 0}
                >
                {productsData.qty === 0 ? "已售完" : isInCart ? "已加入購物車" : "加入購物車"}
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              {/* 產品介紹 */}
              <div className="product-info h-100">
                <h5 className="my-3 mt-lg-0">{productsData.title}</h5>
                <div className="bg-secondary-500 p-3 w-100 h-100">
                  <p className="text-pre-line">{productsData.content}</p>
                  <p className="text-pre-line">{productsData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 商品描述 */}
          <div className="py-5">
            <div className="text-center">
              <h5 className="title-decoration mb-5">商品描述</h5>
            </div>
            <div className="product-detail mb-3">
              <h6 className="text-orange-dark mb-3">商品細節</h6>
              <ul>
                <li>ISBN：{productsData.isbn}</li>
                <li>作者：{productsData.author}</li>
                <li>出版社：{productsData.publisher}</li>
                <li>出版日期：{productsData.publishdate}</li>
                <li>適讀對象：{productsData.suitable}</li>
                <li>語言：{productsData.language}</li>
                <li>規格：{productsData.size}</li>
              </ul>
            </div>
            <div className="product-condition mb-3">
              <h6 className="text-orange-dark mb-3">書況說明</h6>
              <ul>
                <li className="fw-bold">我們的二手書均經過消毒清潔，並依據書籍狀況分類為：</li>
                <li>A：極少翻閱，書況接近新書。</li>
                <li>B：有使用痕跡，可能有自然泛黃、書斑、少量髒污，不影響閱讀。</li>
                <li>C：可能含有筆記、劃線或重點標記。可能有書皮磨損、封面折痕、自然泛黃、書斑、髒污。但內容完整可讀。</li>
                <li>D：可能年份較久遠，嚴重泛黃、書斑、髒污、封面或內頁磨損。</li>
              </ul>
            </div>
            <div className="product-condition">
              <h6 className="text-orange-dark mb-3">更多書況說明</h6>
              <ul>
                <li>{productsData.conditionDescription ? "" : "無"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}