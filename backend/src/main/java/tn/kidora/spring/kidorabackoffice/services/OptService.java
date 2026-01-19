package tn.kidora.spring.kidorabackoffice.services;

public interface OptService {
    void generateAndSendOtp(String email);
    boolean verifyOtp(String email, String otp);
}
