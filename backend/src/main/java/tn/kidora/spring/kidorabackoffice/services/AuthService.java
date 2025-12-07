package tn.kidora.spring.kidorabackoffice.services;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.Role;
import tn.kidora.spring.kidorabackoffice.entities.Status;
import tn.kidora.spring.kidorabackoffice.entities.User;

public interface AuthService {
    User register(RegisterDto dto);
    Map<String,Object> login(String email, String password);
    List<User> getAllUsersExceptSuperAdmin();
     User updateAdminProfile(String email, String nom, String tel, MultipartFile imageFile);
     void deleteUserById(Integer id);

}
