package tn.kidora.spring.kidorabackoffice.services;

import java.util.Map;

import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.User;

public interface AuthService {
    User register(RegisterDto dto);
    public Map<String,Object> login(String email, String password);
}
