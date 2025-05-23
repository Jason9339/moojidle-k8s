import api from "@/ApiClient";

export async function GetCalendarEventsByUserId(userId) {

    try {
        const response = await api.get(`/calendar/get-events/${userId}`);
        return response.data.map((event) => (
            { ...event, start: new Date(event.start), end: new Date(event.end) }
        ))

    }
    catch (e) {
        console.error(e);
    }
}
