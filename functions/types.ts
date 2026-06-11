export interface Credentials {
    userName: string;
    password: string;
}

export interface BooksResponse {
    books: Book[];
}

export interface RegisterResponse extends BooksResponse {
    username: string;
    userID: string;
}

export interface UserProfileResponse extends BooksResponse {
    userId: string;
    username: string;
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

export interface AddBooksPayload {
    userId: string;
    collectionOfIsbns: { isbn: string }[];
}

export interface RemoveBookResponse {
    userId: string;
    isbn: string;
    message: string;
}

export interface UserData {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export interface BookCollection {
    userId: string, 
    isbn: string, 
    token: string
}