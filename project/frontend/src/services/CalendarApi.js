import api from "@/ApiClient";
import moment from "moment";

export async function GetCalendarEventsByUserId(userId) {

    try {
        // const response = await api.get(`/calendar/get-calendar-events-by-user/${userId}`);
        // return response.data;
        const response = [
            {
                title: 'Event 1',
                start: moment("2025-01-08T00:00:00.000+00:00"),
                end: moment("2025-01-15T00:00:00.000+00:00"),
            },
            {
                title: 'Event 2',
                start: moment("2025-01-15T00:00:00.000+00:00"),
                end: moment("2025-01-22T00:00:00.000+00:00"),
            }
        ]

        return response;
    }
    catch (e) {
        console.error(e);
    }
}
