import customerApi from "src/api/customer";

// unauthorizedCustomers 데이터를 가져오는 함수
export const UnauthorizedCustomers = async form => {
   try {
      const data = await customerApi.unauthcustomer(form);
      return data;
   } catch (error) {
      console.error("Error fetching unauthorized customers:", error);
      throw error;
   }
};

// 사용자 이미지를 가져오는 함수
export const getUserImage = async (form, customerStoredImage) => {
   try {
      const imageData = await customerApi.view(form, customerStoredImage);
      return imageData;
   } catch (error) {
      console.error("Error fetching user image:", error);
      throw error;
   }
};

export const certify = async form => {
   try {
      const data = await customerApi.certify(form);
      return data;
   } catch (error) {
      throw error;
   }
};
