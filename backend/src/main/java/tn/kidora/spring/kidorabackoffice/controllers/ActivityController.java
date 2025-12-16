package tn.kidora.spring.kidorabackoffice.controllers;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.kidora.spring.kidorabackoffice.entities.Activity;
import tn.kidora.spring.kidorabackoffice.services.ActivityService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;

@RestController
@RequestMapping(Constants.APP_ROOT + Constants.ACTIVITY)
@AllArgsConstructor
@Slf4j
public class ActivityController {
    private ActivityService activityService;
    @GetMapping(Constants.ALLACTIVITY)
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }
}
