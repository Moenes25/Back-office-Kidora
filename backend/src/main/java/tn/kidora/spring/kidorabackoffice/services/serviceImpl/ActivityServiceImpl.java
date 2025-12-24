package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.entities.Activity;
import tn.kidora.spring.kidorabackoffice.repositories.ActivityRepository;
import tn.kidora.spring.kidorabackoffice.services.ActivityService;

import java.util.List;
@AllArgsConstructor
@Service
public class ActivityServiceImpl implements ActivityService {
    private ActivityRepository activityRepository;
    @Override
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @Override
    public List<Activity> getActivitiesByEntity(String entityName) {
        return List.of();

}}
