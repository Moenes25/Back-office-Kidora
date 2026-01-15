package tn.kidora.spring.kidorabackoffice.controllers.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.kidora.spring.kidorabackoffice.dto.Client.EventDto;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.EventService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;

@RequestMapping(Constants.APP_ROOT + Constants.CLIENT_EVENTS)
@RequiredArgsConstructor
@RestController
public class EventClientController {
    private  final EventService eventService;
    @PostMapping(Constants.CREATE_EVENT)
    public EventDto create(@RequestBody EventDto dto) {
        return eventService.create(dto);
    }
    @PutMapping(Constants.UPDATE_EVENT)
    public ResponseEntity<EventDto> updateEvent(@PathVariable String id, @RequestBody EventDto dto) {
        try {
            EventDto updatedEvent = eventService.update(id, dto);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }
    @GetMapping(Constants.EVENTS_BY_DAY)
    public List<EventDto> getEventsByDay() {

        return eventService.getEventsByDay();
    }
    @GetMapping(Constants.EVENTS_BY_WEEK)
    public List<EventDto> getEventsByCurrentWeek() {
        return eventService.getEventsByCurrentWeek();
    }
    @GetMapping(Constants.EVENTS_BY_MONTH)
    public List<EventDto> getEventsByCurrentMonth() {
        return eventService.getEventsByCurrentMonth();
    }

    @GetMapping(Constants.GET_EVENT_BY_ID)
    public ResponseEntity<EventDto> getEventById(@PathVariable String id) {
        try {
            EventDto event = eventService.getEventById(id);
            return ResponseEntity.ok(event);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @DeleteMapping(Constants.DELETE_EVENT)
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

