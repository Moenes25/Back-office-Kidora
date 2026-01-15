package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.EventDto;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;
import tn.kidora.spring.kidorabackoffice.repositories.EvenementRepository;
import tn.kidora.spring.kidorabackoffice.utils.mapper.Client.EvenementClientMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements  EventService{
    private final EvenementRepository evenementRepository;
    @Override
    public EventDto create(EventDto dto) {
        Evenement entity = EvenementClientMapper.toEntity(dto);
        Evenement saved = evenementRepository.save(entity);
        return EvenementClientMapper.toDto(saved);
    }

    @Override
    public List<EventDto> getEventsByDay() {
        LocalDate today = LocalDate.now();
        return evenementRepository.findAll().stream()
                .filter(e -> e.getDateDebut() != null && e.getDateFin() != null
                        && !today.isBefore(e.getDateDebut())
                        && !today.isAfter(e.getDateFin()))
                .map(EvenementClientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public EventDto update(String id, EventDto dto) {
        Evenement existing = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id : " + id));

        existing.setTitre(dto.getTitre());
        existing.setDateDebut(dto.getDateDebut());
        existing.setDateFin(dto.getDateFin());
        existing.setCouleur(dto.getCouleur());
        Evenement updated = evenementRepository.save(existing);
        return EvenementClientMapper.toDto(updated);
    }

    @Override
    public List<EventDto> getEventsByCurrentWeek() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(java.time.DayOfWeek.SUNDAY);

        return evenementRepository.findAll().stream()
                .filter(e -> e.getDateDebut() != null && e.getDateFin() != null)
                .filter(e ->
                        !e.getDateFin().isBefore(startOfWeek) &&
                                !e.getDateDebut().isAfter(endOfWeek)
                )
                .map(EvenementClientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventDto> getEventsByCurrentMonth() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        return evenementRepository.findAll().stream()
                .filter(e -> e.getDateDebut() != null && e.getDateFin() != null)
                .filter(e ->
                        !e.getDateFin().isBefore(startOfMonth) &&
                                !e.getDateDebut().isAfter(endOfMonth)
                )
                .map(EvenementClientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public EventDto getEventById(String id) {
        Evenement event = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id : " + id));
        return EvenementClientMapper.toDto(event);
    }

    @Override
    public void deleteEvent(String id) {
        Evenement event = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable avec l'id : " + id));
        evenementRepository.delete(event);
    }
}
