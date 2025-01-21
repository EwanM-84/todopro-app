import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

// No need for CSS imports as they are included in the plugins

const eventCategories = [
  { id: 'quote', name: 'Quote', color: '#DAA520' },
  { id: 'installation', name: 'Installation', color: '#4CAF50' },
  { id: 'maintenance', name: 'Maintenance', color: '#2196F3' },
  { id: 'meeting', name: 'Meeting', color: '#9C27B0' },
  { id: 'other', name: 'Other', color: '#607D8B' },
];

const Calendar = () => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(eventCategories.map(cat => cat.id));
  const calendarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      category: 'quote',
    });
    setShowEventModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps.originalEvent);
    setShowEventModal(true);
  };

  const handleEventDrop = (dropInfo) => {
    const updatedEvents = events.map(event => {
      if (event.id === dropInfo.event.id) {
        return {
          ...event,
          start: dropInfo.event.startStr,
          end: dropInfo.event.endStr,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleSaveEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: eventData.id || Math.random().toString(36).substr(2, 9),
    };

    setEvents(prev => {
      if (eventData.id) {
        return prev.map(event => event.id === eventData.id ? newEvent : event);
      }
      return [...prev, newEvent];
    });
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event => 
    selectedCategories.includes(event.category)
  );

  const renderEventContent = (eventInfo) => {
    const category = eventCategories.find(cat => cat.id === eventInfo.event.extendedProps.category);
    return (
      <div className="flex items-center p-1">
        <div 
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: category?.color }}
        />
        <p className="text-sm truncate">{eventInfo.event.title}</p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {eventCategories.map(category => (
          <label key={category.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCategories(prev => [...prev, category.id]);
                } else {
                  setSelectedCategories(prev => prev.filter(id => id !== category.id));
                }
              }}
              className="mr-2"
            />
            <span 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </label>
        ))}
      </div>

      <div className="flex-grow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={filteredEvents}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="100%"
        />
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-[#DAA520]">
              {selectedEvent?.id ? 'Edit Event' : 'New Event'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSaveEvent({
                id: selectedEvent?.id,
                title: formData.get('title'),
                category: formData.get('category'),
                start: formData.get('start'),
                end: formData.get('end'),
                description: formData.get('description'),
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    name="title"
                    defaultValue={selectedEvent?.title}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={selectedEvent?.category || 'quote'}
                    className="w-full p-2 border rounded"
                  >
                    {eventCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start</label>
                  <input
                    type="datetime-local"
                    name="start"
                    defaultValue={selectedEvent?.start?.slice(0, 16)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End</label>
                  <input
                    type="datetime-local"
                    name="end"
                    defaultValue={selectedEvent?.end?.slice(0, 16)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedEvent?.description}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                {selectedEvent?.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#DAA520] text-white rounded hover:bg-[#B8860B]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
