import api from "@/ApiClient";

export async function GetCalendarEventsByUserId(userId) {

    try {
        const response = await api.get(`/calendar/get-events/${userId}`);
        const data = response.data.map(({ start, end, ...rest }) => (
            {
                ...rest,
                start: new Date(start),
                end: new Date(end)
            }

        ))

        // data = data.filter(evt => evt.end > currentDate);
        return data;
    }
    catch (e) {
        console.error(e);
    }
}
