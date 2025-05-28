import api from "@/ApiClient";

export async function GetCalendarEventsByUserId(userId) {

    try {
        const response = await api.get(`/calendar/get-events/${userId}`);
        const data = response.data.map((courseWithEvents) => {
            const events = courseWithEvents.events.map(({ title, start, end }) => ({
                title: title, start: new Date(start), end: new Date(end)
            })
            );

            // events = events.filter(evt => evt.end > currentDate);

            return { ...courseWithEvents, events: events };

        })

        return data;
    }
    catch (e) {
        console.error(e);
    }
}
