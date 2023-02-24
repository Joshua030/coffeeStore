import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
  };

  const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplashApi.search.getPhotos({
      query: "coffee shop",
      page: 1,
      perPage: 40,
      // color: "green",
      // orientation: "portrait",
    });
    const unsplashPhotos=  photos.response?.results || [];
    return unsplashPhotos.map(({urls})=> urls["small"]);
  };
  
  export const fetchCoffeeStores = async (latLong = "43.653833032607096%2C-79.37896808855945",
  limit = 30) => {
    const photos = await getListOfCoffeeStorePhotos();
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_API_KEY,
      },
    };
  
    const response = await fetch(
      getUrlForCoffeeStores(
        latLong, "coffee", limit
      ),
      options
    );   
   
    const data = await response.json();
    return  data?.results?.map((result, idx) => {
      return {
        ...result,
        imgUrl: photos.length > 0 ? photos[idx] : null,
      };
    });
  };