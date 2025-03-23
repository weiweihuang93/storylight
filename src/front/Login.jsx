import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";

export default function Login(){

  const navigate = useNavigate();
  const { login, setLogin } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onBlur" });

  const onSubmit = () => {
    setLogin(true);
  };

  useEffect(() => {
    if(login){
      alert("登入成功");
      navigate("/cart");
    }
  }, [login]);

  return(
    <>
    <main className="section-login">
      <div className="bg vh-100">
        <div className="container-lg">
          <div className="mb-5 mb-lg-3">
            <a href="#"><img className="logo" src="./images/logo.png" alt="logo" /></a>
          </div>
          <div className="row justify-content-center g-0">
            <div className="col-lg-6 d-lg-block d-none">
              <div className="login-img p-0 border border-orange-dark rounded">
                <img className="w-100 h-100" src="https://images.unsplash.com/photo-1576872381149-7847515ce5d8?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="login-img" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="login-info bg py-5 px-3 border border-orange-dark rounded">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h4 className="text-orange-dark mb-4">會員登入</h4>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-bold mb-lg-2">會員帳號</label>
                    <input
                      {...register('name', {
                        required: '姓名 欄位必填'
                      })}
                      type="text" id="name" className="form-control bg-gray border-radius border-0 py-2 px-3" placeholder="請輸入會員帳號" />
                      {errors?.name && <p className="text-danger my-2">{errors.name.message}</p>}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-bold mb-lg-2">會員密碼</label>
                    <input
                      {...register('password', { 
                        required: '密碼 欄位必填', 
                        minLength: { value: 6, message: "密碼至少 6 個字元" } 
                      })}
                      type="password" id="password" className="form-control bg-gray border-radius border-0 py-2 px-3" placeholder="請輸入會員密碼" />
                      {errors?.password && <p className="text-danger my-2">{errors.password.message}</p>}
                  </div>
                  <div className="mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="defaultCheck" value="" />
                      <label className="form-check-label" htmlFor="defaultCheck">保持登入</label>
                    </div>
                  </div>
                  <button className="btn btn-orange-dark w-100 py-3 mb-4" type="submit">立即登入</button>
                  <div className="d-flex justify-content-center gap-2">
                    <p>新朋友嗎？</p>
                    <Link to="/register" className="link-accent-200" aria-current="page">點此註冊</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}