import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useParams } from "react-router";
import { AppContext } from "../context/AppContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const categories = ["全部商品", "親子童書", "商業理財", "藝術音樂", "人文科普", "心理勵志", "生活休閒", "文學小說", "工具學習", "滿額索取"];

export default function CategoryPage(){
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [favorite, setFavorite] = useState({});
  const { cartData, setCartData } = useContext(AppContext);

  const handleFavorite = (productId) => {
    setFavorite((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  useEffect(() => {
    if (!categoryName || categoryName === "全部商品") {
      getAllProduct();
    } else {
      getCategory(categoryName);
    }
  }, [categoryName]);

  const getAllProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
      // console.log('getAllProduct', res);
      const filterProducts = res.data.products.filter(product => product.category !== "運費專區");
      setProducts(filterProducts);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategory = async (category) => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`, {
        params: { category },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

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

  return(
    <>
    <section className="section-product">
      <div className="bg py-3">
        <div className="container-fluid">
          <div className="row gy-3">
            <div className="col-lg-3">
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
            </div>

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

              {products.map((product) => {

                const isInCart = cartData?.carts?.some((item) => item.product_id === product.id);

                return(
                <div 
                className={`product-card mb-3 ${product.category === "滿額索取" ? "bonus-wrap" : ""}`} 
                key={product.id}
              >
                  <div className="row">
                    {/* 產品圖片區 */}
                    <div className="col-5 col-lg-4">
                      <div className="product-img-h28">
                        <img src={product.imageUrl} alt={product.title} />
                        <button onClick={() => handleFavorite(product.id)} className={`favorite-btn ${favorite[product.id] ? "active" : ""}`}>
                          <span className={`material-symbols-outlined ${favorite[product.id] ? 'icon-fill' : ''}`}>
                          favorite
                          </span>
                        </button>
                        <p className="condition-tag">A</p>
                      </div>
                    </div>

                    {/* 產品內容區 */}
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
                        <button onClick={() => addCart(product.id)} className={`btn w-100 mt-auto ${isInCart ? "btn-gray-600" : " btn-warning"}`} type="button" disabled={isInCart}>
                          {isInCart ? "已加入購物車" : "加入購物車"}
                        </button>
                      </div>
                    </div>

                    {/* 產品描述區 */}
                    <div className="col-lg-4">
                      <div className="product-detail p-1 p-lg-1 p-3">
                        <p className="text-pre-line">{product.content}...</p>
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