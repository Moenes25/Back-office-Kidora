package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import tn.kidora.spring.kidorabackoffice.dto.Client.ClientUpdateDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;

import java.util.List;

public interface ClientService {

    void deleteClient(String clientId);
    Users updateProfile(String id, ClientUpdateDto dto);
    List<Users> getAllClients();
    List<Users> getParents();
    List<Users> getEducateurs();

    long getTotalParents();
    Long getNombreParentsParEtablissement(String idEtablissement);
    Long getNombreEducateursParEtablissement(String idEtablissement);

    Users getClientById(String id);

}
