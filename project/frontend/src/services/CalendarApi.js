import api from "@/ApiClient";

export async function GetCalendarEventsByUserId(userId) {

    try {
        const response = await api.get(`/calendar/get-events/${userId}`);
        console.log(response.data)
        const data = response.data.map((courseWithEvents) => {
            const events = courseWithEvents.events.map(({ start, end, color, ...rest }) => ({
                ...rest, courseColor: color, start: new Date(start), end: new Date(end)
            })
            );

            // events = events.filter(evt => evt.end > currentDate);

            return { ...courseWithEvents, events: events };

        })

        console.log("data", data);
        return data;
    }
    catch (e) {
        console.error(e);
    }
}
