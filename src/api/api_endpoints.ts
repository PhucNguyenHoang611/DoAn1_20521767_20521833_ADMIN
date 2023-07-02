export const getAccessToken = (token: string) => ({
    headers: {
        Authorization: "Bearer " + token
    }
});

// Current logged in user
export const CURRENT_USER = "/staffs/getCurrentStaff";

// Login
export const LOGIN = "/staffs/loginStaff";

export const getLoginBody = (email: string, password: string) => ({
    staffEmail: email,
    staffPassword: password
});

// Staff
export const GET_ALL_STAFFS = "/staffs/getAllStaffs";

export const GET_STAFF = (id: string) => `/staffs/getStaffById/${id}`;

export const CREATE_STAFF = "/staffs/registerStaff";

export const UPDATE_STAFF = (id: string) => `/staffs/updateStaff/${id}`;

export const CHANGE_STAFF_STATUS = (id: string) => `/staffs/activeOrInactiveStaff/${id}`;

export const CHANGE_STAFF_PASSWORD = (id: string) => `/staffs/changeStaffPassword/${id}`;

export const getStaffId = (id: string) => ({
    params: {
        staffId: id
    }
});

export const getStaffBodyForCreate = (staffPassword: string, staffFirstName: string, staffLastName: string, staffEmail: string, staffPhone: string, staffGender: string, privilege: number) => ({
    staffPassword: staffPassword,
    staffFirstName: staffFirstName,
    staffLastName: staffLastName,
    staffEmail: staffEmail,
    staffPhone: staffPhone,
    staffGender: staffGender,
    privilege: privilege
});

export const getStaffBodyForUpdate = (staffFirstName: string, staffLastName: string, staffEmail: string, staffPhone: string, staffGender: string, privilege: number) => ({
    staffFirstName: staffFirstName,
    staffLastName: staffLastName,
    staffEmail: staffEmail,
    staffPhone: staffPhone,
    staffGender: staffGender,
    privilege: privilege
});

export const getStaffPasswordBody = (staffOldPassword: string, staffNewPassword: string) => ({
    staffOldPassword: staffOldPassword,
    staffNewPassword: staffNewPassword
});

// Customer
export const GET_ALL_CUSTOMERS = "/customers/getAllCustomers";

export const GET_CUSTOMER = (id: string) => `/customers/getCustomerById/${id}`;

// Customer Address
export const GET_CUSTOMER_ADDRESS = (id: string) => `/addresses/getAddressById/${id}`;

export const GET_CUSTOMER_DEFAULT_ADDRESS = (id: string) => `/addresses/getCustomerDefaultAddress/${id}`;

// Product
export const GET_ALL_PRODUCTS = "/products/getAllProducts";

export const GET_PRODUCT = (id: string) => `/products/getProductById/${id}`;

export const CREATE_PRODUCT = "/products/createProduct";

export const UPDATE_PRODUCT = (id: string) => `/products/updateProduct/${id}`;

export const DELETE_PRODUCT = (id: string) => `/products/deleteProduct/${id}`;

export const ACTIVE_INACTIVE_PRODUCT = (id: string) => `/products/activeOrInactiveProduct/${id}`;

export const getProductId = (id: string) => ({
    params: {
        productId: id
    }
});

export const getProductBody = (name: string, description: string, price: string, category: string, subcategory: string, supplier: string) => ({
    productName: name,
    productDescription: description,
    productPrice: price,
    productCategoryId: category,
    productSubcategoryId: subcategory,
    productSupplierId: supplier
});

// Product Image
export const GET_ALL_PRODUCT_IMAGES = (id: string) => `/products/getAllProductImagesByColor/${id}`;

export const GET_ALL_PRODUCT_IMAGES_BY_COLOR = (id: string, productColorId: string) => `/products/getAllProductImagesByColor/${id}/${productColorId}`;

export const SAVE_PRODUCT_IMAGE = (id: string) => `/products/saveProductImage/${id}`;

export const DELETE_PRODUCT_IMAGE = (id: string) => `/products/deleteProductImage/${id}`;


// Product Color
export const GET_ALL_PRODUCT_COLORS = (id: string) => `/products/getAllProductColors/${id}`;

export const GET_PRODUCT_COLOR = (id: string) => `/products/getProductColorById/${id}`;

export const ADD_PRODUCT_COLOR = (id: string) => `/products/addProductColor/${id}`;

export const getProductColorBody = (colorId: string) => ({
    colorId: colorId
});

// Product Dimension
export const GET_DIMENSION = (id: string) => `/products/getProductDimension/${id}`;

export const ADD_DIMENSION = (id: string) => `/products/addProductDimension/${id}`;

export const UPDATE_DIMENSION = (id: string) => `/products/updateProductDimension/${id}`;

export const getDimensionBody = (length: string, width: string, height: string, weight: string) => ({
    productLength: length,
    productWidth: width,
    productHeight: height,
    productWeight: weight
});

// Category
export const GET_ALL_CATEGORIES = "/categories/getAllCategories";

export const GET_CATEGORY = (id: string) => `/categories/getCategoryById/${id}`;

export const getCategoryId = (id: string) => ({
    params: {
        categoryId: id
    }
});

// Subcategory
export const GET_ALL_SUBCATEGORIES = "/subcategories/getAllSubcategories";

export const GET_SUBCATEGORY = (id: string) => `/subcategories/getSubcategoryById/${id}`;

export const getSubcategoryId = (id: string) => ({
    params: {
        subcategoryId: id
    }
});

// Supplier
export const GET_ALL_SUPPLIERS = "/suppliers/getAllSuppliers";

export const GET_SUPPLIER = (id: string) => `/suppliers/getSupplierById/${id}`;

export const getSupplierId = (id: string) => ({
    params: {
        supplierId: id
    }
});

// Color
export const GET_ALL_COLORS = "/colors/getAllColors";

export const GET_COLOR = (id: string) => `/colors/getColorById/${id}`;

export const getColorId = (id: string) => ({
    params: {
        colorId: id
    }
});

// Discount
export const GET_ALL_DISCOUNTS = "/discounts/getAllDiscounts";

export const GET_DISCOUNT = (id: string) => `/discounts/getDiscountById/${id}`;

export const CREATE_DISCOUNT = "/discounts/createDiscount";

export const UPDATE_DISCOUNT = (id: string) => `/discounts/updateDiscount/${id}`;

export const DELETE_DISCOUNT = (id: string) => `/discounts/deleteDiscount/${id}`;

export const RESET_DISCOUNT = (id: string) => `/discounts/resetDiscount/${id}`;

export const GET_ALL_PRODUCTS_FOR_DISCOUNT = (id: string) => `/discounts/getAllProductsForDiscount/${id}`;

export const APPLY_DISCOUNT_FOR_PRODUCT = (productId: string, discountId: string) => `/discounts/applyDiscountForProduct/${productId}/${discountId}`;

export const getDiscountBody = (discountName: string, discountDescription: string, discountPercent: number, discountStartDate: Date, discountEndDate: Date) => ({
    discountName: discountName,
    discountDescription: discountDescription,
    discountPercent: discountPercent,
    discountStartDate: discountStartDate,
    discountEndDate: discountEndDate
});

// Import
export const GET_ALL_IMPORTS = "/imports/getAllImports";

export const CREATE_IMPORT = "/imports/createImport";

export const GET_IMPORT = (id: string) => `/imports/getImportById/${id}`;

export const getImportBody = (staffId: string, importDate: Date) => ({
    staffId: staffId,
    importDate: importDate
});

export const CONFIRM_IMPORT = (id: string) => `/imports/confirmImport/${id}`;

export const CANCEL_IMPORT = (id: string) => `/imports/cancelImport/${id}`;

// Import Details
export const GET_DETAILS_FOR_IMPORT = (id: string) => `/imports/getDetailsForImport/${id}`;

export const CREATE_IMPORT_DETAILS = "/imports/createImportDetail";

export const getImportDetailsBody = (importId: string, productId: string, supplierId: string, productColorId: string, productQuantity: number) => ({
    importId: importId,
    productId: productId,
    supplierId: supplierId,
    productColorId: productColorId,
    productQuantity: productQuantity
});

// Order
export const GET_ALL_ORDERS = "/orders/getAllOrders";

export const GET_ORDER = (id: string) => `/orders/getOrderById/${id}`;

export const GET_ORDER_ITEMS_FOR_ORDERS = (id: string) => `/orders/getOrderItemsForOrder/${id}`

export const UPDATE_ORDER_STATUS = (id: string) => `/orders/updateOrderStatus/${id}`;

export const COMPLETE_ORDER = (id: string) => `/orders/completeOrder/${id}`;

export const getUpdateOrderStatusBody = (staffId: string, orderStatus: string, cancelReason: string) => ({
    staffId: staffId,
    orderStatus: orderStatus,
    cancelReason: cancelReason
});

export const getCompleteOrderBody = (orderCompleteDay: Date) => ({
    orderCompleteDay: orderCompleteDay
});

// Payment

export const GET_PAYMENT = (id: string) => `/payments/getPaymentById/${id}`;

// Attachment
export const PREVIEW_ATTACHMENT = (id: string) => `/attachments/previewAttachment/${id}`;