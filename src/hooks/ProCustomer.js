import { useState, useEffect } from "react";
import { UnauthorizedCustomers } from "../services/customer.service";

// 커스텀 훅: 학생 목록과 데이터 로딩 상태를 제공
function useProCustomer() {
   const [customerData, setCustomerData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchData = async () => {
      try {
         const data = await UnauthorizedCustomers(); // 서비스 함수 호출
         setCustomerData(data.data);
         setIsLoading(false);
      } catch (error) {
         setError(error);
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchData(); // 데이터 가져오는 함수 호출
   }, []); // 한 번만 호출하도록 빈 배열을 의존성 배열로 전달

   // refetch 함수 추가
   const refetch = () => {
      setIsLoading(true);
      setError(null);
      fetchData(); // 데이터 다시 가져오기
   };

   return { customerData, isLoading, error, refetch };
}

export default useProCustomer;
