import { OrderItem } from "..";

export interface GuestDetails {
    first_name: string;
    last_name: string;
    phoneNumber: string;
    shareId: string;
}

export function parseGuestDetails(input: OrderItem | string): GuestDetails {
    let guestId: string;
    if (typeof input === 'string') {
        guestId = input;
    } else {
        guestId = input?.share_guest_id ?? 'Unknown';
    }

    if (!guestId || guestId === 'Unknown') return { first_name: 'Unknown', last_name: 'Unknown', phoneNumber: 'Unknown', shareId: 'Unknown' };

    const parts = guestId.split('_guest_');
    if (parts.length < 2) return { first_name: 'Unknown', last_name: 'Unknown', phoneNumber: 'Unknown', shareId: 'Unknown' };

    const nameParts = parts[0].split('_');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' '); // Join the remaining parts as the last name
    const [shareId, phoneNumber] = parts[1].split('_');

    return { first_name, last_name, phoneNumber, shareId };
}