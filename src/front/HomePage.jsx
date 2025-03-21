import axios from "axios";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HomePage(){

  const [products, setProducts] = useState([]);
  const [bonusProducts, setBonusProducts] = useState([]);
  const [favorite, setFavorite] = useState({});

  useEffect(() => {
    getAllProduct();
    getBonusProduct();
  }, []);

  const getAllProduct = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
      // console.log('getAllProduct', res);
      const filterProducts = res.data.products.filter(product => product.category !== "滿額索取");
      // console.log(filterProducts)
      // setProducts(res.data.products);
      const filter10Products = filterProducts.slice(0, 10); // 只取前 10 筆資料
      setProducts(filter10Products);
    }catch(err){
      console.log(err);
    }
  };

  const getBonusProduct = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`, {
        params: { category: "滿額索取" }
      });
      // console.log('getBonusProduct', res);
      // setProducts(res.data.products);
      const filter10Products = res.data.products.slice(0, 10); // 只取前 10 筆資料
      setBonusProducts(filter10Products);
    }catch(err){
      console.log(err);
    }
  };

  const handleFavorite = (productId) => {
    setFavorite((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }))
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
    }catch(err){
      console.log(err);
    }
  };

  return(
    <>

    {/* <!-- 輪播圖 --> */}
    <header>
      <div className="container-fluid p-0">
        <div className="header-banner">
          <img className="header-img" src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="header-banner" />
          <div className="header-info">
            <h1 className="fs-2 mb-5">讓時光，<br />在舊書的翻閱中靜靜流轉...</h1>
            <h2 className="fs-2 text-md-end text-start">
              <span className="d-block d-md-inline">每一本書，</span>
              <span className="d-block d-md-inline">都是一段未完的故事，</span>
              <p>等待你的發現！</p>
            </h2>
          </div>
        </div>
      </div>
    </header>

    {/* <!-- 買書 / 徵求 --> */}
    <section className="section-option">
      <div className="bg py-6">
        <div className="container">
          <div className="row row-cols-lg-2 row-cols-1 gy-3">
            <div className="col">
              <a className="option-wrap rounded">
                <div className="option-info p-5">
                  <h2>
                    我要買書 
                  </h2>
                  <p className="text-muted">超過 10,000 本優質二手書，輕鬆找到你的愛書！</p>
                  <button className="btn btn-orange btn-lg">立即選購</button>
                </div>
                <div className="option-hover rounded">
                  <span className="fs-2 material-symbols-outlined text-white">shopping_cart</span>
                  <h2>立即選購</h2>
                </div>
              </a>
            </div>
            <div className="col">
              <a className="option-wrap rounded">
                <div className="option-info p-5">
                  <h2>
                    我要徵求
                  </h2>
                  <p className="text-muted">找不到想要的嗎？填寫表單，讓賣家主動聯繫你！</p>
                  <button className="btn btn-orange btn-lg">立即徵求</button>
                </div>
                <div className="option-hover rounded">
                  <span className="fs-2 material-symbols-outlined text-white">assignment</span>
                  <h2>立即徵求</h2>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- 書籍分類 8大分類區 --> */}
    <section className="section-category">
      <div className="container py-lg-6 py-5">
        <h2 className="text-center mb-lg-5 mb-4">書籍分類</h2>
        <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1 gy-3">
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-a2.png" />
                  <img src="./images/category-a1.png" alt="category-a1" />
                </picture>
              </a>
              <h4>兒童繪本</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-b2.png" />
                  <img src="./images/category-b1.png" alt="category-b1" />
                </picture>
              </a>
              <h4>商業理財</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-c2.png" />
                  <img src="./images/category-c1.png" alt="category-c1" />
                </picture>
              </a>
              <h4>藝術設計</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-d2.png" />
                  <img src="./images/category-d1.png" alt="category-d1" />
                </picture>
              </a>
              <h4>科學自然</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-e2.png" />
                  <img src="./images/category-e1.png" alt="category-e1" />
                </picture>
              </a>
              <h4>人文歷史</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-f2.png" />
                  <img src="./images/category-f1.png" alt="category-f1" />
                </picture>
              </a>
              <h4>宗教命理</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-g2.png" />
                  <img src="./images/category-g1.png" alt="category-g1" />
                </picture>
              </a>
              <h4>大眾閱讀</h4>
            </div>
          </div>
          <div className="col">
            <div className="category-card">
              <a href="#">
                <picture>
                  <source media="(min-width: 992px)" srcSet="./images/category-h2.png" />
                  <img src="./images/category-h1.png" alt="category-h1" />
                </picture>
              </a>
              <h4>工具學習</h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- 新書上架 --> */}
    <section className="section-product">
      <div className="container py-lg-6 py-5">
        <h2 className="mb-lg-5 mb-4">新書上架</h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product-card">
                <div className="product-img-h22">
                  <img src={product.imageUrl} alt={product.title} />
                  <button onClick={() => handleFavorite(product.id)} className={`favorite-btn ${favorite[product.id] ? "active" : ""}`}>
                    <span className={`material-symbols-outlined ${favorite[product.id] ? "icon-fill" : ""}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">A</p>
                </div>
                <ul className="product-info p-2">
                  <li className="fw-bold title-clamp-2 h-3em">
                    {product.title}
                  </li>
                  <li className="text-truncate">適讀對象：{product.suitable}</li>
                  <div>
                    <p className="fs-5 text-danger fw-bold">
                      <span className="material-symbols-outlined text-primary me-2">paid</span>
                      {product.price}
                    </p>
                  </div>
                </ul>
                <button className="btn btn-orange-dark w-100 mb-2" type="button" >繼續閱讀</button>
                <button onClick={() => addCart(product.id)}className="btn btn-warning w-100" type="button">
                  加入購物車
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>

    {/* <!-- 滿額索取 --> */}
    <section className="section-bonusproduct">
      <div className="container py-lg-6 py-5">
        <h2 className="mb-lg-5 mb-4">新書上架</h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="swiper"
        >
          {bonusProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product-card bonus-wrap">
                <div className="product-img-h22">
                  <img src={product.imageUrl} alt={product.title} />
                  <button onClick={() => handleFavorite(product.id)} className={`favorite-btn ${favorite[product.id] ? "active" : ""}`}>
                    <span className={`material-symbols-outlined ${favorite[product.id] ? "icon-fill" : ""}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">A</p>
                </div>
                <ul className="product-info p-2">
                  <li className="fw-bold title-clamp-2 h-3em">
                    {product.title}
                  </li>
                  <li className="text-truncate">適讀對象：{product.suitable}</li>
                  <div>
                    <p className="fs-5 text-danger fw-bold">
                      <span className="material-symbols-outlined text-primary me-2">paid</span>
                      {product.price}
                    </p>
                  </div>
                </ul>
                <button className="btn btn-orange-dark w-100 mb-2" type="button" >繼續閱讀</button>
                <button onClick={() => addCart(product.id)} className="btn btn-warning w-100" type="button">
                  加入購物車
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>

    {/* <!-- 加入會員活動 --> */}
    <section className="section-membership">
      <div className="bg py-lg-6 py-5">
        <div className="container">
          <div className="membership-wrap">
            <h2 className="text-center mb-lg-5 mb-4">\ 專屬會員限定優惠 /</h2>
            <ul>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>會員積分回饋（每消費 1 元累積 1 點）。</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>輕鬆尋找心儀好書，讓好書輕鬆入手！</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>專屬優惠券，不定期折扣，讓你以更優惠的價格收藏好書。</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>年度精選禮物，每年為忠實會員準備一份特別的閱讀驚喜！</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>購物滿額可免費索取好書，讓閱讀更超值！</li>
            </ul> 
            <img className="membership-img1 d-none d-lg-block" src="https://opendoodles.s3-us-west-1.amazonaws.com/reading-side.svg" alt="membership-img1" />
            <img className="membership-img2 d-none d-lg-block" src="https://opendoodles.s3-us-west-1.amazonaws.com/sitting-reading.svg" alt="membership-img2" />
            <button className="btn btn-orange btn-lg mt-5">立即加入，開啟你的專屬閱讀旅程！</button>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- 店家介紹 --> */}
    <section className="section-about">
      <div className="container text-center py-lg-6 py-5">
        <h2 className="mb-lg-5 mb-4">關於我們｜書籍如何處理？</h2>
        <p className="fs-5 text-muted mb-5">我們細心處理每一本書，<span className="d-block d-lg-inline">確保你收到的書籍乾淨、完整！</span></p>

        <div className="row row-cols-lg-4 row-cols-sm-2 row-cols-1 g-3">
          <div className="col">
            <div className="about-wrap bg-secondary-400 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> encrypted </span> 安心
              </h3>
              <p>
                <span>每本書皆經過清潔與消毒，</span>
                <span className="d-md-block d-xl-inline">閱讀無負擔。</span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="about-wrap bg-secondary-100 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> book </span> 分級
              </h3>
              <p>
                <span>書況分級標籤透明清楚，</span>
                <span className="d-md-block d-xl-inline">讓你一目了然！</span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="about-wrap bg-secondary-300 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> public </span> 環保
              </h3>
              <p>
                <span>採用環保包裝減少浪費，</span>
                <span className="d-md-block d-xl-inline">共同愛護地球！</span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="about-wrap bg-secondary-200 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> delivery_truck_speed </span> 方便
              </h3>
              <p>
                <span>下單快速出貨，讓你輕鬆買，</span>
                <span className="d-md-block d-xl-inline">快速收書！</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- FAQ --> */}
    <section className="section-faq">
      <div className="bg py-lg-6 py-5">
        <div className="container">
          <h2 className="text-center mb-lg-5 mb-4">常見問題</h2>
          <div className="accordion mb-5" id="faqAccordion">
            {/* <!-- 問題 1 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                所有書籍都是現貨嗎？
                </div>
              </h3>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <p>是的！所有書籍皆為現貨銷售，下單後即可安排出貨。</p>
                </div>
              </div>
            </div>

            {/* <!-- 問題 2 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                書籍的保存狀況如何？
                </div>
              </h3>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <ul className="d-flex flex-column gap-3">
                    <li className="fw-bold">我們的二手書均經過消毒清潔、分類整理，並依據書籍狀況分類為：</li>
                    <li>A：極少翻閱，書況接近新書。</li>
                    <li>B：有使用痕跡，可能有自然泛黃、書斑、少量髒污，不影響閱讀。</li>
                    <li>C：可能含有筆記、劃線或重點標記。可能有書皮磨損、封面折痕、自然泛黃、書斑、髒污。但內容完整可讀。</li>
                    <li>D：可能年份較久遠，嚴重泛黃、書斑、髒污、封面或內頁磨損。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- 問題 3 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  如何付款與配送？
                </div>
              </h3>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <ul className="d-flex flex-column gap-3 mb-3">
                    <li className="fw-bold">付款方式：</li>
                    <li>銀行轉帳、貨到付款。</li>
                  </ul>
                  <ul className="d-flex flex-column gap-3">
                    <li className="fw-bold">下單後多久可以收到？</li>
                    <li>下單後 1～2 個工作日內 配達。</li>
                    <li className="fw-semibold">📌 「當日下單，隔一個工作日出貨」，實際配達時間依物流狀況為準。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- 問題 4 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                  運費如何計算？
                </div>
              </h3>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <ul className="d-flex flex-column gap-3">
                    <li className="fw-bold">常態免運費標準如下：</li>
                    <li>宅配：滿 1,500 元 免運，未達條件 運費 100 元。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- 問題 5 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                  買錯了，如何退換貨？
                </div>
              </h3>
              <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  請直接於平台留言，客服小編會盡速為您處理喔!
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-orange">查看更多FAQ</button>
          </div>
        </div>
      </div>
    </section>
    
    </>
  )
}