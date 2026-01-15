package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClasseRepository;
import tn.kidora.spring.kidorabackoffice.utils.mapper.Client.ClasseMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClasseServiceImpl implements  ClasseService{
    private final ClasseRepository classesRepo;
    @Override
    public ClasseResponseDto ajouterClasse(ClasseRequestDto dto) {
        Classes entity = ClasseMapper.toEntity(dto);
        Classes saved = classesRepo.save(entity);
        return ClasseMapper.toDto(saved);
    }

    @Override
    public List<ClasseResponseDto> getAllClasses() {
        return classesRepo.findAll()
                .stream()
                .map(ClasseMapper::toDto)
                .collect(Collectors.toList());
    }

}
