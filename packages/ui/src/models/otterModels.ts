export interface OtterToken {
    accessToken: string;
    expiresIn: number;
    scope: string;
    tokenType: string;
}

export interface Organization {
    id: string;
    name: string;
}

export interface OtterBrand {
    id: string;
    name: string;
}

export interface OtterStore {
    id: string;
    name: string;
}

export interface OtterLocation {
    latitude: number;
    longitude: number;
}

export interface OtterAddress {
    fullAddress: string;
    postalCode: string;
    city: string;
    state: string;
    countryCode: string;
    addressLines: string[];
    location: OtterLocation;
    linesOfAddress: string[];
}

export interface PaginatedResult<T> {
    items: T[];
    offsetToken: string;
}

export interface OtterConnection {
    storeId: string;
}

export interface OtterCreateConnectionRequest {
    storeId: string;
}

export interface OtterConnectionSubmissionResponse {
    message: string;
    storeId: string;
    connected: boolean;
}