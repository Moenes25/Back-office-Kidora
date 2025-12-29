package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import tn.kidora.spring.kidorabackoffice.entities.Activity;

public interface ActivityRepository extends MongoRepository<Activity, String> {
}
