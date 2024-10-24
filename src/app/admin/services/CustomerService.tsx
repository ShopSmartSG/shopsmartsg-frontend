import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_GETALLMERCHANT_API_URL;


export const getStaticProps = async () => {
  try {
    const response = await axios.get(`${apiUrl}`);
    const data = await response.data;
    return {
      props: {
        merchants: data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        merchants: [],
      },
    };
  }
};
