import React, { useState, useEffect } from "react";
import { getUserImage } from "../services/customer.service"; // 사용자 이미지 가져오는 서비스 함수 import

function Proview({ customerStoredImage }) {
   const [userImage, setUserImage] = useState(null); // 사용자 이미지를 저장할 상태

   useEffect(() => {
      // 이미지를 불러오는 함수 호출
      const fetchUserImage = async () => {
         try {
            const form = {}; // 필요한 폼 데이터 추가
            const imageData = await getUserImage(form, customerStoredImage); // 사용자 이미지 가져오기
            setUserImage(imageData); // 이미지 상태 업데이트
         } catch (error) {
            console.error("Error fetching user image:", error);
         }
      };

      fetchUserImage(); // 이미지를 불러오는 함수 호출

      // 여기서 필요한 폼 데이터를 form 객체에 추가해주세요.
   }, [customerStoredImage]);

   return (
      <div>
         {userImage ? (
            <img src={`?customerStoredImage=${userImage}`} />
         ) : (
            <div>Loading...</div> // 이미지가 로딩 중일 때 표시할 내용
         )}
      </div>
   );
}

export default Proview;
