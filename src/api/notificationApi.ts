import { fetchWithAuth } from "../auth/fetchWIthAuth";


export const getNotifications = async () => {
    const response = await fetchWithAuth("/api/notification");

    return response;
};