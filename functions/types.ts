export interface Credentials {
  userName: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  username: string;
  books: Array<{ isbn: string }>;
  userID: string;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  books: Array<{ isbn: string }>;
}

export interface ApiResponse {
  code: string | number;
  message: string;
}

export interface LoginResponse {
  token: string;
  expires: string;
  status: string;
  result: string;
}

// Book types
export interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

export interface BooksResponse {
  books: Book[];
}

export interface AddBooksPayload {
  userId: string;
  collectionOfIsbns: { isbn: string }[];
}

export interface AddBooksResponse {
  books: { isbn: string }[];
}

export interface RemoveBookResponse {
  userId: string;
  isbn: string;
  message: string;
}

// User data types
export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface UserRecord extends UserData {
  userID?: string;
}
