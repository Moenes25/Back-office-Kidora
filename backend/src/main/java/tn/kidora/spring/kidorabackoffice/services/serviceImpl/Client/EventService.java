package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import tn.kidora.spring.kidorabackoffice.dto.Client.EventDto;

import java.util.List;

public interface EventService {
    EventDto create(EventDto dto);
    List<EventDto> getEventsByDay();
    EventDto update(String id, EventDto dto);
    List<EventDto> getEventsByCurrentWeek();
    List<EventDto> getEventsByCurrentMonth();
    EventDto getEventById(String id);
    void deleteEvent(String id);

}
