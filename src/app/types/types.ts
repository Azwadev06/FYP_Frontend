export interface User {
    _id?: string
    username: string
    email: string
    firstName?: string
    lastName?: string
    createdAt?: Date
}

export interface Admin {
    _id?: string
    username: string
}

export interface LoginData {
    statusCode: number
    message: string
    success: string
    data: {
        accessToken: string
        refreshToken: string
        user: User
    }
}



export interface AdminLoginData {
    statusCode: number
    message: string
    success: string
    data: {
        accessToken: string
        refreshToken: string
        admin: Admin
    }
}



export interface LogoutData {
    statusCode: number
    message: string
    success: string
    data: {}
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    success: boolean;
}



export interface Place {
    business_status: string;
    formatted_address: string;
    icon: string;
    name: string;
    opening_hours: {
        open_now: boolean;
        weekday_text: string[]

    }
    place_id: string;
    rating: number;
    types: string[];
    user_ratings_total: number
    photos: PlacePhoto[]

    website?: string;
    url?: string;
    reviews: Review[];
    international_phone_number?: string;
    formatted_phone_number?: string;

    takeout?: boolean;
    serves_vegetarian_food?: boolean;
    serves_lunch?: boolean;
    serves_dinner?: boolean;
    serves_brunch?: boolean;
    serves_breakfast?: boolean;
    dine_in?: boolean;
    delivery?: boolean;
    cuisine?: string
}

export interface PlacePhoto {
    height: number;
    width: number;
    html_attributions: string[];
    photo_reference: string;
}

export interface Review {
    _id?: string;
    author_name: string;
    author_url?: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description?: string;
    text: string;
    createdAt?: string
}
