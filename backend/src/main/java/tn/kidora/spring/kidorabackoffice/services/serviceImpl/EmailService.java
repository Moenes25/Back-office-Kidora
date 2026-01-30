package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("arwadridi624@gmail.com"); // même email
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachmentBytes, String fileName) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true = email multipart (avec pièce jointe)

        helper.setFrom("arwadridi624@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment(fileName, new ByteArrayResource(attachmentBytes)); // PDF attaché

        mailSender.send(message);
    }
}
