import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { Modal } from "bootstrap";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const categories = ["親子童書", "商業理財", "藝術音樂", "人文科普", "心理勵志", "生活休閒", "文學小說", "工具學習", "滿額索取", "運費專區"];

const defaultModalState = {
  imageUrl: "",
  title: "",
  maintitle: "",
  category: "",
  unit: "本",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
  isbn: "",
  language: "繁體中文",
  qty: "",
  author: "",
  publisher: "",
  publishdate: "",
  suitable: "成人(一般)",
  condition: "",
  conditionDescription: "",
  size: ""
}

export default function AdminProduct(){
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);
  const [modalMode, setModalMode] = useState('');
  const [tempProduct, setTempProduct] = useState(defaultModalState);


  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      getAllProduct();
      getProduct();
    }else{
      Navigate("/adminLogin");
    }
  }, []);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false
    });
  }, []);

  // useEffect(() => {
  //   if (productModalRef.current) {
  //     new Modal(productModalRef.current, {
  //       backdrop: false
  //     });
  //   }
  // }, [productModalRef.current]);

  const openModal = (mode, product) => {
    setModalMode(mode);
    switch (mode){
      case "create":
        setTempProduct({ ...defaultModalState });
        break;
      case "edit":
        setTempProduct({
          ...defaultModalState, // 先填充所有預設值，確保欄位存在
          ...product // 再覆蓋新的產品資料
        });
        break;
        
      default:
      break;
    }
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  }

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const getAllProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products/all`);
      // console.log('getAllProduct', res);
      setAllProducts(res.data.products);
    } catch (error) {
      console.log(error)
    }
  };

  const getProduct = async (page = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
      // console.log('getProduct', res);
    } catch (error) {
      console.log(error)
      alert('取得產品失敗');
    }
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    getProduct(page);
  }

  const editProduct = async (product_id) => {
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
          qty: Number(tempProduct.qty)
        }
      });
      closeModal();
    } catch (error) {
      console.log(error)
      alert('編輯產品失敗');
    }
  };

  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
      closeModal();
    } catch (error) {
      alert('新增產品失敗');
      console.log(error);
    }
  };

  const deleteProduct = async (product_id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${product_id}`);
      // console.log('deleteProduct', res);
      getAllProduct();
      getProduct();
    } catch (error) {
      console.log(error)
      alert('更新產品失敗');
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : editProduct;
    try {
      await apiCall();
      closeModal();
      getAllProduct();
      getProduct();
    } catch (error) {
      const errorMessage = error.response?.data?.message || '發生未知錯誤';
      alert(`新增產品失敗: ${errorMessage}`);
    }
  };

  const handleFileChange = async (e) => {
    const formData = new FormData();
    const fileInput = e.target;
    const file = e.target.files[0];
    formData.append('file-to-upload', file);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
      const uploadImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadImageUrl
      })
      fileInput.value = '';
    } catch (error) {
    }
  }

  return(
    <>
    <div className="container">
      <div className="row py-3 g-3">
        <div className="col-12">
          <h4>產品資訊</h4>
        </div>

        {/* 搜尋 & 分類篩選 */}
        <div className="col-md-6">
          <div className="d-flex">
            <input type="text" className="form-control" placeholder="搜尋" />
            <button className="btn btn-orange px-2 py-0">
              <span className="material-symbols-outlined icon-black"> search </span>
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <select className="form-select">
            <option disabled>請選擇分類</option>
            <option key="全部商品">全部商品</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* 商品數量 & 新增按鈕 */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <p>
              目前上架數量：
              <span className="fw-bold text-orange-dark">{allProducts ? Object.keys(allProducts).length : 0}</span>
            </p>
            <button
              onClick={() => openModal('create')}
              className="btn btn-orange"
              type="button">新增產品
            </button>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="col-12">
          <div className="product-header fw-bold text-center">
            <span className="product-name">產品名稱</span>
            <span className="product-price d-none d-md-block">售價</span>
            <span className="product-qty d-none d-md-block">數量</span>
            <span className="product-status d-none d-md-block">狀態</span>
            <span className="product-action">操作</span>
          </div>

          <div className="product-list">
            {products.map((product) => (
              <div className="product-item text-center" key={product.id}>
                <span className="product-name flex-grow-1">{product.title}</span>
                <span className="product-price d-none d-md-block">{product.price}</span>
                <span className="product-qty d-none d-md-block">{product.qty}</span>
                <span className={`product-status d-none d-md-block ${product.is_enabled ? "text-success fw-bold" : "text-danger fw-bold"}`}>
                  {product.is_enabled ? "已啟用" : "未啟用"}
                </span>
                <span className="product-action">
                  <div className="d-flex gap-2">
                    <button onClick={() => openModal('edit', product)} className="btn btn-outline-primary btn-sm">
                      編輯
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="btn btn-outline-danger btn-sm">
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
        <div id="productModal" ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
              <h5 className="modal-title">{modalMode === 'create' ? '新增產品': '編輯產品'}</h5>
                <button onClick={() => closeModal()} type="button" className="btn-close" aria-label="Close"></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-lg-4">
                    {/* 圖片上傳 */}
                    <div className="mb-5">
                      <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                      <input
                        onChange={handleFileChange}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="primary-image" className="form-label">
                        主圖
                      </label>
                      <div className="input-group">
                        <input
                          value={tempProduct.imageUrl}
                          onChange={handleModalInputChange}
                          name="imageUrl"
                          type="text"
                          id="primary-image"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                        />
                      </div>
                      <img
                        src={tempProduct.imageUrl}
                        alt={tempProduct.title}
                        className="img-fluid"
                      />
                    </div>

                    {/* 副圖 */}
                    <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index}>
                        <label htmlFor={`images-${index + 1}`} className="form-label">副圖 {index + 1}</label>
                        <input
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                          id={`images-${index + 1}`} type="text" className="form-control" placeholder={`圖片網址-${index + 1}`} />
                        {image && (
                          <img 
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"/>
                        )}
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="row g-4">
                      <div className="col-6">
                        <label htmlFor="title" className="form-label">
                          標題
                        </label>
                        <input
                          value={tempProduct.title}
                          onChange={handleModalInputChange}
                          name="title"
                          id="title"
                          type="text"
                          className="form-control"
                          placeholder="請輸入標題"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="maintitle" className="form-label">
                          簡短標題
                        </label>
                        <input
                          value={tempProduct.maintitle}
                          onChange={handleModalInputChange}
                          name="maintitle"
                          id="maintitle"
                          type="text"
                          className="form-control"
                          placeholder="請輸入簡短標題"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <select
                          value={tempProduct.category}
                          onChange={handleModalInputChange}
                          name="category"
                          id="category"
                          type="text"
                          className="form-control"
                          >
                          <option value="" disabled>
                            請選擇分類
                          </option>
                          {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          value={tempProduct.origin_price}
                          onChange={handleModalInputChange}
                          name="origin_price"
                          id="origin_price"
                          type="number"
                          className="form-control"
                          placeholder="請輸入原價"
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          value={tempProduct.price}
                          onChange={handleModalInputChange}
                          name="price"
                          id="price"
                          type="number"
                          className="form-control"
                          placeholder="請輸入售價"
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="qty" className="form-label">
                          數量
                        </label>
                        <input
                          value={tempProduct.qty}
                          onChange={handleModalInputChange}
                          name="qty"
                          id="qty"
                          type="number"
                          className="form-control"
                          placeholder="請輸入數量"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          value={tempProduct.unit}
                          onChange={handleModalInputChange}
                          name="unit"
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="author" className="form-label">
                          作者
                        </label>
                        <input
                          value={tempProduct.author}
                          onChange={handleModalInputChange}
                          name="author"
                          id="author"
                          type="text"
                          className="form-control"
                          placeholder="請輸入作者"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="publisher" className="form-label">
                          出版社
                        </label>
                        <input
                          value={tempProduct.publisher}
                          onChange={handleModalInputChange}
                          name="publisher"
                          id="publisher"
                          type="text"
                          className="form-control"
                          placeholder="請輸入出版社"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="publishdate" className="form-label">
                          出版日期 <span className="ms-2 text-danger">（西元年/月/日）</span>
                        </label>
                        <input
                          value={tempProduct.publishdate}
                          onChange={handleModalInputChange}
                          name="publishdate"
                          id="publishdate"
                          type="text"
                          className="form-control"
                          placeholder="請輸入出版日期"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="isbn" className="form-label">
                          ISBN
                        </label>
                        <input
                          value={tempProduct.isbn}
                          onChange={handleModalInputChange}
                          name="isbn"
                          id="isbn"
                          type="number"
                          className="form-control"
                          placeholder="請輸入ISBN"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="suitable" className="form-label">
                          識讀年齡
                        </label>
                        <input
                          value={tempProduct.suitable}
                          onChange={handleModalInputChange}
                          name="suitable"
                          id="suitable"
                          type="text"
                          className="form-control"
                          placeholder="請輸入識讀年齡"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="language" className="form-label">
                          語言
                        </label>
                        <input
                          value={tempProduct.language}
                          onChange={handleModalInputChange}
                          name="language"
                          id="language"
                          type="text"
                          className="form-control"
                          placeholder="請輸入語言"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="size" className="form-label">
                          規格
                        </label>
                        <input
                          value={tempProduct.size}
                          onChange={handleModalInputChange}
                          name="size"
                          id="size"
                          type="text"
                          className="form-control"
                          placeholder="請輸入平裝或精裝"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="condition" className="form-label">
                        書況標籤
                        </label>
                        <select
                          value={tempProduct.condition}
                          onChange={handleModalInputChange}
                          name="condition"
                          id="condition"
                          className="form-select"
                        >
                          <option value="">請選擇書況</option>
                          <option value="A">A（極少翻閱，接近新書）</option>
                          <option value="B">B（輕微使用痕跡）</option>
                          <option value="C">C（可能含筆記、劃線）</option>
                          <option value="D">D（可能嚴重泛黃、書斑、磨損）</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="conditionDescription" className="form-label">
                          書況說明
                        </label>
                        <textarea
                          value={tempProduct.conditionDescription}
                          onChange={handleModalInputChange}
                          name="conditionDescription"
                          id="conditionDescription"
                          type="text"
                          className="form-control"
                          placeholder="請輸入書況說明"
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="description" className="form-label">
                          產品描述
                        </label>
                        <textarea
                          value={tempProduct.description}
                          onChange={handleModalInputChange}
                          name="description"
                          id="description"
                          className="form-control"
                          rows={4}
                          placeholder="請輸入產品描述"
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="content" className="form-label">
                          說明內容 <span className="ms-2 text-danger">（字數限制180字）</span>
                        </label>
                        <textarea
                          value={tempProduct.content}
                          onChange={handleModalInputChange}
                          name="content"
                          id="content"
                          className="form-control"
                          rows={4}
                          placeholder="請輸入說明內容"
                          maxLength={180}
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-check mt-4">
                      <input
                        checked={tempProduct.is_enabled}
                        onChange={handleModalInputChange}
                        name="is_enabled"
                        type="checkbox"
                        className="form-check-input"
                        id="isEnabled"
                      />
                      <label className="form-check-label" htmlFor="isEnabled">
                        是否啟用
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer border-top bg-light">
                <button onClick={() => closeModal()} type="button" className="btn btn-secondary">
                  取消
                </button>
                <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>

    </div>
      
    </div>
    </>
  )
}