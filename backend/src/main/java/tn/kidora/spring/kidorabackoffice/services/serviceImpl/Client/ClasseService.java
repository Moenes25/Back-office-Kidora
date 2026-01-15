package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseResponseDto;

import java.util.List;

public interface ClasseService {
     ClasseResponseDto ajouterClasse(ClasseRequestDto dto);
     List<ClasseResponseDto> getAllClasses();
}
