package tn.kidora.spring.kidorabackoffice.services;

import tn.kidora.spring.kidorabackoffice.entities.Activity;

import java.util.List;

public interface ActivityService {
    List<Activity> getAllActivities();
     List<Activity> getActivitiesByEntity(String entityName);
}
