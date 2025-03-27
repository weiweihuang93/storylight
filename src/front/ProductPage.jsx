import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductPage(){

  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const { cartData, setCartData, favorites, toggleFavorite } = useContext(AppContext);

  useEffect(() => {
    const getProductId = async() => {
      try{
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
        // console.log(res);
        setProduct(res.data.product);
      }catch(err){
        console.log(err);
      }
    }
    getProductId();
  }, [id]);

  const addCart = async(product_id) => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        "data": {
          "product_id": product_id,
          "qty": 1
        }
      });
      // console.log('addCart', res);
      getCart();
    }catch(err){
      console.log(err);
    }
  };

  const getCart = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      // console.log(res.data.data.carts);
      // console.log('getCart', res);
      setCartData(res.data.data)
    }catch(err){
      // console.log(err);
    }
  };

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
                <Link to={`/category/${product.category}`}>{product.category}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-lg-4">
              {/* 產品圖片區 */}
              <div className="product-info h-100">
                <div className="product-img text-center">
                  <img src={product.imageUrl} alt={product.title} />
                  <button onClick={() => toggleFavorite(product.id)} className={`position-absolute border-0 favorite-btn ${favorites[product.id] ? 'favorite-active' : ''}`}>
                    <span className={`material-symbols-outlined ${favorites[product.id] ? 'icon-fill' : ''}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">A</p>
                </div>
                <div className="product-price mb-2">
                  <del className="text-sm me-3">售價：{product.origin_price}</del>
                  <p className="fs-5 text-danger fw-bold">
                    <span className="material-symbols-outlined text-primary me-2">paid</span>{product.price}
                  </p>
                </div>
                <button onClick={() => addCart(product.id)} className={`btn w-100 mt-auto ${isInCart ? "btn-gray-600" : " btn-warning"}`} type="button" disabled={isInCart}>
                  {isInCart ? "已加入購物車" : "加入購物車"}
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              {/* 產品介紹 */}
              <div className="product-info h-100">
                <h5 className="my-3 mt-lg-0">{product.title}</h5>
                <div className="bg-secondary-500 p-3 w-100 h-100">
                  <p className="text-pre-line">{product.content}</p>
                  <p className="text-pre-line">{product.description}</p>
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
                <li>ISBN：{product.isbn}</li>
                <li>作者：{product.author}</li>
                <li>出版社：{product.publisher}</li>
                <li>出版日期：{product.publishdate}</li>
                <li>適讀對象：{product.suitable}</li>
                <li>語言：{product.language}</li>
                <li>規格：{product.size}</li>
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
                <li>{product.conditionDescription ? "" : "無"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}