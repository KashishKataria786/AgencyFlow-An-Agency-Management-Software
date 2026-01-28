import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar.jsx";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarPage = () => {
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const role = user?.role;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
                setTasks(data);

                const calendarEvents = data.map(task => ({
                    id: task._id,
                    title: task.title,
                    start: new Date(task.dueDate || new Date()),
                    end: new Date(task.dueDate || new Date()),
                    allDay: true,
                    resource: task
                }));
                setEvents(calendarEvents);
            } catch (error) {
                console.error("Error fetching tasks for calendar:", error);
            }
        };
        fetchTasks();
    }, []);

    const handleSelectEvent = (event) => {
        const projectId = event.resource.projectId?._id || event.resource.projectId;
        navigate(`/${role}/projects/${projectId}`);
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backgroundColor = "#3b82f6"; // blue
        const priority = event.resource.priority;

        if (priority === "high") {
            backgroundColor = "#ef4444"; // red
        } else if (priority === "medium") {
            backgroundColor = "#f97316"; // orange
        }

        if (event.resource.status === 'done') {
            backgroundColor = "#10b981"; // green
        }

        return {
            style: {
                backgroundColor,
                borderRadius: "2px",
                opacity: 0.8,
                color: "white",
                border: "0px",
                fontSize: "0.8em",
                fontWeight: "bold",
                textTransform: "uppercase"
            }
        };
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar role={role} />
            <div className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto h-full flex flex-col">
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Mission Timeline</h1>
                        <p className="text-slate-500 text-sm font-semibold tracking-tighter">Temporal visualization of all assigned objectives.</p>
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: "100%", width: "100%" }}
                            onSelectEvent={handleSelectEvent}
                            eventPropGetter={eventStyleGetter}
                            popup
                            views={['month', 'week', 'day']}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
