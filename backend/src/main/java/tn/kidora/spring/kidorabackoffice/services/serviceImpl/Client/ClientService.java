package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import tn.kidora.spring.kidorabackoffice.dto.Client.ClientUpdateDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;

public interface ClientService {

    void deleteClient(String clientId);
    Users updateProfile(String id, ClientUpdateDto dto);
}
