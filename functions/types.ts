// Primitives
export interface Username {
  username: string;
}

export interface Password {
  password: string;
}

// Auth types
export interface Credentials extends Password {
  userName: string;
}

export interface RegisterPayload extends Credentials {
  firstName: string;
  lastName: string;
}

export interface UserId {
  userID: string;
}

export interface RegisterResponse extends UserId {
  username: string;
  books: Array<{ isbn: string }>;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  books: Array<{ isbn: string }>;
}

export interface DeleteResponse {
  code: number;
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
export interface UserData extends Username, Password {
  firstName: string;
  lastName: string;
}

export interface UserRecord extends UserData {
  userID?: string;
}
