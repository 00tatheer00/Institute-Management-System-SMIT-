import type { Event } from "@/lib/types";
import { events as initialEvents } from "@/lib/data/misc";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

const eventStore: Event[] = [...initialEvents];

const eventSearchFields: (keyof Event)[] = ["title", "description", "category", "location"];

export function getEvents(params: QueryParams = {}): PaginatedResult<Event> {
  return queryItems(eventStore, { pageSize: 12, ...params }, eventSearchFields);
}

export function getAllEvents(): Event[] {
  return eventStore;
}

export function getUpcomingEvents(): Event[] {
  return eventStore.filter((e) => e.status === "upcoming");
}

export function getEventById(id: string): Event | undefined {
  return eventStore.find((e) => e.id === id);
}

export function registerForEvent(
  eventId: string,
  participant: { name: string; email: string; phone: string }
): boolean {
  const ev = eventStore.find((e) => e.id === eventId);
  if (!ev || !ev.isRegistrationOpen) return false;

  ev.registeredCount += 1;
  if (ev.maxAttendees && ev.registeredCount >= ev.maxAttendees) {
    ev.isRegistrationOpen = false;
  }
  return true;
}

export function createEvent(data: {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  maxAttendees?: number;
}): Event {
  const newEvent: Event = {
    id: `event-${Date.now()}`,
    title: data.title,
    description: data.description,
    date: data.date,
    endDate: data.endDate,
    time: data.time,
    location: data.location,
    category: data.category,
    image: data.image || "/images/events/web-workshop.jpg",
    isRegistrationOpen: true,
    maxAttendees: data.maxAttendees || 100,
    registeredCount: 0,
    status: "upcoming",
  };

  eventStore.unshift(newEvent);
  return newEvent;
}
