import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useParams } from "react-router";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const categories = ["全部商品", "親子童書", "商業理財", "藝術音樂", "人文科普", "心理勵志", "生活休閒", "文學小說", "工具學習", "滿額索取"];

export default function CategoryPage(){
  const { categoryName } = useParams();
  const [productsData, setProductsData] = useState([]);
  const { cartData, addCart, favorites, toggleFavorite } = useContext(AppContext);

  // 取得產品 過濾運費專區
  const getAllProduct = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
      console.log('getAllProduct', res.data.products);
      const filterCategoryProducts = res.data.products.filter((item) => item.category !== '運費專區');
      setProductsData(filterCategoryProducts);
    }catch(error){
      console.log('getAllProduct: 取得全部產品失敗', error);
    }
  };

  const getCategoryProduct = async(category) => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`, {
        params: { category },
      });
      console.log('getCategoryProduct', res.data.products);
      setProductsData(res.data.products);
    }catch(error){
      console.log('getCategoryProduct: 取得分類產品失敗', error);
    }
  };

  useEffect(() => {
    if (!categoryName || categoryName === "全部商品") {
      getAllProduct();
    } else {
      getCategoryProduct(categoryName);
    }
  }, [categoryName]);

  return(
    <>
    <section className="section-product">
      <div className="bg py-3">
        <div className="container">
          <div className="row gy-3">

            {/* 左側分類欄 */}
            <aside className="col-lg-3">
              <h5 className="d-none d-lg-block bg-orange-dark text-white py-3 px-4">書籍分類</h5>
              <button
                className="d-lg-none btn btn-orange-dark rounded-0 w-100"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#categoryList"
                aria-expanded="false"
                aria-controls="categoryList"
              >
                顯示書籍分類
              </button>
              <div className="collapse d-lg-block" id="categoryList">
                <ul className="list-group rounded-0">
                  {categories.map((category, index) => (
                    <li key={index}>
                    <NavLink
                      to={`/category/${category}`} className={({ isActive }) => 
                        `list-group-item list-group-item-action py-3 px-4 fw-semibold ${isActive ? 'active' : ''}`
                      }
                    >
                      {category}
                    </NavLink>
                  </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* 產品列表區塊 */}
            <div className="col-lg-9">
              
              {/* 麵包屑導航 */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">首頁</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/category">全部商品</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {categoryName === "全部商品" ? "" : categoryName }
                  </li>
                </ol>
              </nav>

              {/* 產品卡片 */}
              {productsData.map((product) => {
                const isInCart = cartData?.carts?.some((item) => item.product_id === product.id);

                return(
                <div 
                className={`product-card mb-3 ${product.category === "滿額索取" ? "bonus-wrap" : ""}`} 
                key={product.id}
              >
                  <div className="row">
                    <div className="col-5 col-lg-4">
                      <div className="product-img-h28">
                        <img src={product.imageUrl} alt={product.title} />
                        <button onClick={() => toggleFavorite(product.id)} className={`favorite-btn ${favorites[product.id] ? "active" : ""}`}>
                          <span className={`material-symbols-outlined ${favorites[product.id] ? 'icon-fill' : ''}`}>
                          favorite
                          </span>
                        </button>
                        <p className="condition-tag">{product.condition}</p>
                      </div>
                    </div>

                    
                    <div className="col-7 col-lg-4 border-lg-end">
                      <div className="product-detail p-1">
                        <h5 className="title-clamp-2">{product.title}</h5>
                        <ul className="py-2">
                          <li>作者：{product.author}</li>
                          <li>出版社：{product.publisher}</li>
                          <li>適讀對象：{product.suitable}</li>
                          <div className="product-price mb-2">
                            <del className="text-sm me-3">售價：{product.origin_price}</del>
                            <p className="fs-5 text-danger fw-bold">
                              <span className="material-symbols-outlined text-primary me-2">paid</span>{product.price}
                            </p>
                          </div>
                        </ul>
                        <button
                          onClick={() => addCart(product.id)}
                          className={`btn w-100 mt-auto ${
                            product.qty === 0 ? "btn-gray-600" : isInCart ? "btn-gray-600" : "btn-warning"
                          }`}
                          type="button"
                          disabled={isInCart || product.qty === 0}
                        >
                        {product.qty === 0 ? "已售完" : isInCart ? "已加入購物車" : "加入購物車"}
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-lg-4">
                      <div className="product-detail p-1 p-lg-1 p-3">
                        <p className="line-clamp-lg-8 h-lg-12em text-pre-line">{product.content}...</p>
                        <Link
                          className="btn btn-outline-orange-dark w-100 mt-lg-0 mt-3"
                          type="button"
                          to={`/category/${categoryName}/${product.id}`}
                        >
                          繼續閱讀
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 售完遮罩 */}
                  {product.qty === 0 && (
                    <div className="sold-out-overlay">
                      <p className="sold-out-text">售完</p>
                    </div>
                  )}
                </div>
              )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}