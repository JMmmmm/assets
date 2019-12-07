export const subitemsAPI = (subCategory) => (
    `api/subitems/${subCategory}`
);

export const searchProductsAPI = (category, query) => (
    `api/search/${category}/${query}`
);

export const productInfoAPI = (productID) => (
    `api/product/${productID}`
);

// пока не юзается
export const subcategoryProductAPI = (subcategory) => (
    `api/category/${subcategory}`
);

export const searchCategoriesAPI = (category) => (
    `api/search/${category}`
);

export const getHomeInfo ='api/get-home-info';

export const loginAPI = "api/login";

export const getUserAPI = "api/get-user-info";

export const logoutAPI = "api/logout";

export const registerAPI = "api/register";

export const addToCartAPI = "api/addtocart";

export const removeFromCartAPI = `api/remove-from-cart`;

export const getUserCartAPI = "api/getusercart";

export const addToWishlistAPI = "api/addtowishlist";

export const removeFromWishlistAPI = (productID) => (
    `api/removefromwishlist/${productID}`
);

export const getUserWishlistAPI = "api/getuserwishlist";

export const wishlistToCartAPI = "api/wishlistcart";

export const checkoutinformationAPI = "api/checkoutinformation";

export const placeOrderAPI = "api/placeorder";

export const userordersAPI = "api/userorders";

export const orderDetailAPI = (order_id) => (
    `api/order/${order_id}`
);

export const validatePromoAPI = "api/validatepromo";

export const contactAPI = "api/contact";

export const getAllCategories = "api/get-all-categories";
