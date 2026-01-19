package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.EmailService;
import tn.kidora.spring.kidorabackoffice.services.OptService;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OptServiceImpl implements OptService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public void generateAndSendOtp(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("Utilisateur introuvable");

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpExpiration(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendEmail(
                email,
                "Réinitialisation de mot de passe - Code OTP",
                "Bonjour " + user.getNom() + ",\n\nVotre code OTP est : " + otp +
                        "\nIl expire dans 5 minutes.\n\nL'équipe Kidora."
        );
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("Utilisateur introuvable");

        boolean valid = user.getOtp() != null &&
                user.getOtp().equals(otp) &&
                user.getOtpExpiration() != null &&
                user.getOtpExpiration().isAfter(LocalDateTime.now());

        if (valid) {
            user.setOtp(null);
            user.setOtpExpiration(null);
            userRepository.save(user);
        }

        return valid;
    }
}
