export interface Filters {
  status: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  keyword: string;
}

export interface FormState {
  title: string;
  description: string;
  type: string;
  propertyDealType: string;
  price: string;
  city: string;
  status: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
}

export interface UserData {
  firstName: string;
  secondName: string;
  email: string;
}

export interface Passwords {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
}

export interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmationPassword?: string;
}

interface PropertyImage {
  imageUrl: string;
}

export const statusMap = {
  AVAILABLE: "Доступно",
  BOOKED: "Забронировано",
  SOLD: "Продано",
  IN_PROCESS: "В процессе",
};

export const typeMap = {
  APARTMENT: "Квартира",
  HOUSE: "Дом",
  CONDO: "Кондо",
  VILLA: "Вилла",
};

export const propertyDealTypeMap = {
  SALE: "Продажа",
  RENT: "Аренда",
};

export interface Property {
  id: number;
  title: string;
  description: string;
  type: keyof typeof typeMap;
  propertyDealType: keyof typeof propertyDealTypeMap;
  status: keyof typeof statusMap;
  price: number;
  city: string;
  createdAt: string;
  images: PropertyImage[];
}

export interface RegisterForm {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
}

export interface ValidationErrors {
  firstName?: string;
  secondName?: string;
  email?: string;
  password?: string;
}