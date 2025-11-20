package tn.kidora.spring.kidorabackoffice.config;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtils { 

@Value("${app.secret-key}")
private String secretKey;

@Value("${app.jwt-expiration-time}")
private long jwtExpirationTime;


public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("username", username);
    return createToken(claims,username);
}


private String createToken(Map<String,Object> claims, String username) {
   return Jwts.builder()
            .setClaims(claims)
            .setSubject(username)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationTime))
            .signWith(getSignKey(),SignatureAlgorithm.HS256)
            .compact();
            
}


private Key getSignKey() {
    byte[] keyBytes = secretKey.getBytes();
    return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    
}
public Boolean validateToken(String token, UserDetails userDetails) {
    String username = extarctUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}
public String extarctUsername(String token) {
  return extractClaims(token,Claims::getSubject);
}

private <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
    
}


private Claims extractAllClaims(String token) {
  return Jwts.parser()
            .setSigningKey(getSignKey())
            .parseClaimsJws(token)
            .getBody();
}


private boolean isTokenExpired(String token) {
    return extractExpirationDate(token).before(new Date());
   
}
private Date extractExpirationDate(String token) {
    return extractClaims(token, Claims::getExpiration);
}


}
