import fetcher from "./fetcher";

// unauthorizedCustomers
const unauthcustomer = async form => {
   const { data } = await fetcher.get(
      "/api/v1/customers/unauthorizedCustomers",
      form
   );
   return data.data;
};

// image;
const view = async (form, customerStoredImage) => {
   const { data } = await fetcher.get(
      // eslint-disable-next-line no-template-curly-in-string
      "/api/v1/customers/image/view?customerStoredImage=${customerStoredImage}",
      form
   );
   return data.data;
};

// certify
const certify = async form => {
   const { data } = await fetcher.post(
      // eslint-disable-next-line no-template-curly-in-string
      "/api/v1/customers/certify",
      form
   );
   return data.data;
};

const customer = {
   unauthcustomer,
   view,
   // signin,
   // signup,
   certify,
};

export default customer;
