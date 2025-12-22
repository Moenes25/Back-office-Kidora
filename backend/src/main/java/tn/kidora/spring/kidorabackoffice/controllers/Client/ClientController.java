package tn.kidora.spring.kidorabackoffice.controllers.Client;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.kidora.spring.kidorabackoffice.dto.LoginDto;
import tn.kidora.spring.kidorabackoffice.dto.UserRegistreDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.services.AuthService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.Map;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping(Constants.APP_ROOT + Constants.CLIENT)
public class ClientController {

    private final  AuthService authService;

    @PostMapping(Constants.CLIENT_REGISTER)
    public Users registerClient(@RequestBody UserRegistreDto dto) {
        log.info("RegisterClient endpoint called with DTO: {}", dto);
        return authService.registerClient(dto);
    }
    @PostMapping(Constants.CLIENT_LOGIN)
    public ResponseEntity<Map<String,Object>> login(@RequestBody LoginDto dto){
        Map<String,Object> authData = authService.login(dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok(authData);

}}
