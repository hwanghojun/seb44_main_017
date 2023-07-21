import axios from "axios";
import ProductInfo from "./ProductInfo";
import { getToken } from "@/utils/token";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/constants/constants";
import { IMG_URL } from "@/constants/constants";
import { ProductCommentTypes } from "@/types/shared";

export type ProductType = {
  productId: number;
  name: string;
  title: null;
  content: string;
  price: number;
  category: string;
  memberId: number;
  productLike: boolean | null;
  imageLink: string;
  issell: boolean;
  createdAt: string;
  modifiedAt: string;
  conditionValue: number | null;
  pointValue: number | null;
  view: number;
  comments: [];
};

export const ProductInfoPage = () => {
  const { productsID } = useParams();
  const [data, setData] = useState<ProductType>();
  const [commentData, setCommentData] = useState<ProductCommentTypes[]>([]);
  const [complete, setComplete] = useState(false);
  const [authorization, refresh] = getToken();
  const navigate = useNavigate();

  const addToCart = async () => {
    const { data, status } = await axios.post(
      BASE_URL + `/orderproducts/${productsID}`,
      {},
      {
        headers: {
          Authorization: authorization,
          Refresh: refresh,
        },
      }
    );

    if ((data && status === 200) || 201) {
      alert("장바구니에 추가하였습니다.");
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${productsID}`);
      console.log(response.data);
      setData(response.data.data);
      setCommentData(response.data.data.comments);
      setComplete(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
  }, [, complete]);

  const deletePost = async () => {
    try {
      const delRes = await axios.delete(`${BASE_URL}/products/${productsID}`, {
        headers: {
          Authorization: `${authorization}`,
          Refresh: `${refresh}`,
        },
      });
      console.log(delRes.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeletePost = () => {
    const confirmDelete = window.confirm("게시물을 삭제하시겠습니까?");
    if (confirmDelete) {
      deletePost();
      alert("삭제가 완료되었습니다.");
      navigate("/productlist");
    }
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/kakaoPay/${productsID}`,
        {
          postnum: "06276",
          address: "OO로 22번길",
          reciver: "구매자",
          reciverphone: "010-1234-1234",
          pointspend: 0,
        },
        {
          headers: {
            Authorization: `${authorization}`,
            Refresh: `${refresh}`,
          },
        }
      );
      console.log(res.data);
      window.open(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {data && (
        <ProductInfo
          key={data.productId}
          name={data.name}
          content={data.content}
          price={data.price}
          category={data.category}
          imageLink={IMG_URL + "/" + data.imageLink}
          handlePayment={handlePayment}
          handleDeletePost={handleDeletePost}
          comments={commentData}
          setComplete={setComplete}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};
