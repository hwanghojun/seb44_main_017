import defaultImage from "/images/cat.jpg";
import * as S from "./style";
import * as H from "../Header/styled";
import Logout from "../../assets/icons/Logout";
import product from "../../assets/product.svg";
import notice from "../../assets/notice.svg";
import clothes from "../../assets/clothes.svg";
import askQuestion from "../../assets/askQuestion.svg";
import magnifier from "../../assets/magnifier.svg";
import cart from "@/assets/cart.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Backdrop from "./Backdrop";
import LoginModal from "../Modal_login/LoginModal";
import SignupModal from "../Modal_signup/SignupModal";
import { delCookie, getId, getRoles, getToken } from "@/utils/token";
import axios from "axios";
import { BASE_URL, IMG_URL } from "@/constants/constants";
import { LoginUserInfo } from "@/types/shared";
import { useRecoilState } from "recoil";
import { userInfoState } from "@/recoil/atom";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMenu: () => void;
  headerRef: React.MutableRefObject<HTMLDivElement | HTMLButtonElement | null>;
}

const HamburgerDropdown = ({
  isOpen,
  setIsOpen,
  toggleMenu,
  headerRef,
}: Props) => {
  const portalElement = document.getElementById("modal") as HTMLElement;
  const navigate = useNavigate();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModallOpen, setSignupModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState<LoginUserInfo | null>(
    userInfoState
  );
  const role = getRoles();
  const memberId = getId();

  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (memberId) {
      const [authorization, refresh] = getToken();

      axios
        .get(BASE_URL + `/members/${memberId}`, {
          headers: {
            Authorization: authorization,
            Refresh: refresh,
          },
        })
        .then(res => setUserInfo({ ...res.data.data, role: role }));
    } else {
      setUserInfo(null);
    }
  }, [isOpen]);

  const logoutHandler = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      toggleMenu();
      delCookie();
      navigate("/");
    }
  };

  const handleClickOutside = (e: React.BaseSyntheticEvent | MouseEvent) => {
    if (
      !headerRef.current?.contains(e.target) &&
      !barRef.current?.contains(e.target)
    )
      toggleMenu();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {createPortal(
        <>
          {isOpen && <Backdrop />}
          {loginModalOpen && (
            <LoginModal closeModal={() => setLoginModalOpen(false)} />
          )}
          {signupModallOpen && (
            <SignupModal closeModal={() => setSignupModalOpen(false)} />
          )}
          <S.SideBar isOpen={isOpen} ref={barRef}>
            <S.Profile>
              {!userInfo ? (
                <>
                  <div className="auth_btn">
                    <H.LoginBtn
                      onClick={() => {
                        setLoginModalOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      LOGIN
                    </H.LoginBtn>
                    <H.SignupBtn
                      onClick={() => {
                        setSignupModalOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      SIGN UP
                    </H.SignupBtn>
                  </div>
                </>
              ) : (
                <>
                  {userInfo ? (
                    <img src={IMG_URL + "/" + userInfo.profile} />
                  ) : (
                    <img src={defaultImage} />
                  )}

                  <div className="profile_name">{userInfo?.name} 님</div>
                  <div></div>
                </>
              )}
            </S.Profile>
            {userInfo && (
              <>
                <S.MenuBox>
                  <S.Menu>
                    <li
                      onClick={() => {
                        navigate("/productlist");
                        toggleMenu();
                      }}
                    >
                      <img src={product} title="상품 보기" />
                      <h3 className="nav_text">상품 보기</h3>
                      <div className="nav_description">상품 보기</div>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/collection");
                        toggleMenu();
                      }}
                    >
                      <img src={clothes} title="수거 요청" />
                      <h3 className="nav_text">수거 요청</h3>
                      <div className="nav_description">수거 요청</div>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/notice");
                        toggleMenu();
                      }}
                    >
                      <img src={notice} title="공지사항" />
                      <h3 className="nav_text">공지사항</h3>
                      <div className="nav_description">공지사항</div>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/questions");
                        toggleMenu();
                      }}
                    >
                      <img src={askQuestion} title="Q&A" />
                      <h3 className="nav_text">Q & A</h3>
                      <div className="nav_description">Q&A</div>
                    </li>
                    {role === "user" ? (
                      <>
                        <li
                          onClick={() => {
                            navigate("/mypage");
                            toggleMenu();
                          }}
                        >
                          <img src={magnifier} title="마이페이지" />
                          <h3 className="nav_text">마이페이지</h3>
                          <div className="nav_description">마이페이지</div>
                        </li>
                        <li
                          onClick={() => {
                            navigate("/cart");
                            toggleMenu();
                          }}
                        >
                          <img src={cart} title="장바구니" />
                          <h3 className="nav_text">장바구니</h3>
                          <div className="nav_description">장바구니</div>
                        </li>
                      </>
                    ) : (
                      <li
                        onClick={() => {
                          navigate("/admin/products");
                          toggleMenu();
                        }}
                      >
                        <img src={magnifier} title="관리자페이지" />
                        <h3 className="nav_text">관리자페이지</h3>
                        <div className="nav_description">관리자페이지</div>
                      </li>
                    )}
                  </S.Menu>
                </S.MenuBox>
                <div className="logout-icon">
                  <Logout logoutHandler={logoutHandler} />
                </div>
              </>
            )}
          </S.SideBar>
        </>,
        portalElement
      )}
    </>
  );
};

export default HamburgerDropdown;
