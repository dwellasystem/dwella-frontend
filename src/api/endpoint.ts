import type { IAssignedUnitUrls } from "../interfaces/endpoints/IAssignedUnitUrls";
import type { IAuthUrls } from "../interfaces/endpoints/IAuthUrls";
import type { IInquiriesUrls } from "../interfaces/endpoints/IInquiriesUrls";
import type { IMonthlyBillingUrls } from "../interfaces/endpoints/IMonthlyBillingUrls";
import type { INoticesUrls } from "../interfaces/endpoints/INoticesUrls";
import type { IPaymentMethodsUrls } from "../interfaces/endpoints/IPaymentMethodsUrls";
import type { IPaymentUrls } from "../interfaces/endpoints/IPaymentUrls";
import type { IUnitUrls } from "../interfaces/endpoints/IUnitUrls";
import type { IUserUrls } from "../interfaces/endpoints/IUserUrls";


export const API_BASE_URL = "http://127.0.0.1:8000/api";


// Url endpoints for authentication to get token and refresh tokens
export const AUTH_URLS: IAuthUrls = {
  LOGIN: `${API_BASE_URL}/token/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
};


// Url endpoints for users. Create user, Retrieve user, Retrieve users, Update user, Delete user  
export const USER_URLS: IUserUrls = {
  GET_USERS: `users`,
  CREATE_USER: `register/`,
  GET_USER_BY_ID: (id:number | string) => `/user/${id}/`,
  UPDATE_USER_BY_ID: (id: number | string) => `/user/update/${id}/`,
  DELETE_USER_BY_ID: (id: number | string) => `/user/delete/${id}/`,
}


// Url endpoints for payments. Create payment, Retrieve payment, Retrieve payments, Update payment, Delete Payment
export const PAYMENT_URLS: IPaymentUrls = {
  GET_PAYMENTS: `${API_BASE_URL}/payments`,
  CREATE_PAYMENT: `${API_BASE_URL}/payment/`,
  GET_PAYMENT_BY_ID: (id: string) => `${API_BASE_URL}/payment/${id}/`,
  UPDATE_PAYMENT_BY_ID: (id: string) => `${API_BASE_URL}/payment/${id}/update/`,
  DELETE_PAYMENT_BY_ID: (id: string) => `${API_BASE_URL}/payment/${id}/delete/`,

  //Total pendings
  PENDING_PAYMENTS: `${API_BASE_URL}/payment/pendings`
}


// Url endpoints for payment methods. Create payment method, Retrieve payment method, Retrieve payment methods, Update payment method, Delete payment method
export const PAYMENT_METHODS_URLS: IPaymentMethodsUrls = {
  GET_PAYMENT_METHODS: `${API_BASE_URL}/payment-methods`,
  CREATE_PAYMENT_METHOD: `${API_BASE_URL}/payment-method/`,
  GET_PAYMENT_METHOD_BY_ID: (id: string) => `${API_BASE_URL}/payment-method/${id}/`,
  UPDATE_PAYMENT_METHOD_BY_ID: (id: string) => `${API_BASE_URL}/payment-method/${id}/update/`,
  DELETE_PAYMENT_METHOD_BY_ID: (id: string) => `${API_BASE_URL}/payment-method/${id}/delete/`
}


// Url endpoints for inquiries. Create inquiry, Retrieve inquiry, Retrieve inquiries, Update inquiry, Delete inquiry
export const INQUIRIES_URLS: IInquiriesUrls = {
  GET_INQUIRIES: `${API_BASE_URL}/inquiries`,
  CREATE_INQUIRY:`${API_BASE_URL}/inquiry/`,
  GET_INQUIRY_BY_ID: (id:number) => `${API_BASE_URL}/inquiry/${id}/`,
  UPDATE_INQUIRY_BY_ID: (id:number) => `${API_BASE_URL}/inquiry/${id}/update/`,
  DELETE_INQUIRY_BY_ID: (id: number) => `${API_BASE_URL}/inquiry/${id}/delete/`,
  OPEN_INQUIRIES: `${API_BASE_URL}/inquiry/open`
}


// Url endpoints for notices. Create notice, Retrieve notice, Retrieve notices, Update notice, Delete notice
export const NOTICES_URLS: INoticesUrls = {
  GET_NOTICES: `${API_BASE_URL}/notices`,
  CREATE_NOTICE: `${API_BASE_URL}/notice/`,
  GET_NOTICE_BY_ID: (id:number) => `${API_BASE_URL}/notice/${id}/`,
  UPDATE_NOTICE_BY_ID: (id:number) => `${API_BASE_URL}/notice/${id}/update/`,
  DELETE_NOTICE_BY_ID: (id:number) => `${API_BASE_URL}/notice/${id}/delete/`
}

// Url endpoints for units. Create unit, Retrieve unit, Retrieve units, Update unit, Delete unit
export const UNIT_URLS: IUnitUrls = {
  GET_UNITS: `${API_BASE_URL}/units`,
  CREATE_UNIT: `${API_BASE_URL}/unit/`,
  GET_UNIT_BY_ID: (id:string | number) => `${API_BASE_URL}/unit/${id}/`,
  UPDATE_UNIT_BY_ID: (id:string | number) => `${API_BASE_URL}/unit/${id}/update/`,
  DELETE_UNIT_BY_ID: (id:string | number) => `${API_BASE_URL}/unit/${id}/delete/`,
}

// Url endpoints for assigned units. Create assigned unit, Retrieve assigned unit, Retrieve assigned units, Update assigned unit, Delete assigned unit
export const ASSIGNED_UNIT_URLS: IAssignedUnitUrls = {
  GET_ASSIGNED_UNITS: `${API_BASE_URL}/assigned_units`,
  CREATE_ASSIGNED_UNIT: `${API_BASE_URL}/assigned_unit/`,
  GET_ASSIGNED_UNIT_BY_ID: (id:string | number) => `${API_BASE_URL}/assigned_unit/${id}/`,
  UPDATE_ASSIGNED_UNIT_BY_ID: (id:string | number) => `${API_BASE_URL}/assigned_unit/${id}/update/`,
  DELETE_ASSIGNED_UNIT_BY_ID: (id:string | number) => `${API_BASE_URL}/assigned_unit/${id}/delete/`
}


export const MONTHLY_BILLING_URLS: IMonthlyBillingUrls = {
    GET_BILL: `${API_BASE_URL}/bills/paginated`,
    CREATE_BILL: `${API_BASE_URL}/bills/paginated`,
    GET_BILL_BY_ID: (id:number | string) => `${API_BASE_URL}/bills/${id}/`,
    UPDATE_BILL_BY_ID: (id: number | string) => `${API_BASE_URL}/bills/${id}/`,
    DELETE_BILL_BY_ID: (id: number | string) => `${API_BASE_URL}/bills/${id}/`
}

