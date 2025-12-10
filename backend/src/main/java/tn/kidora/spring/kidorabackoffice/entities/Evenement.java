// package tn.kidora.spring.kidorabackoffice.entities;

// import jakarta.persistence.*;
// import lombok.*;
// import lombok.experimental.FieldDefaults;

// import java.time.LocalDate;
// import java.time.LocalTime;

// @Entity
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// @FieldDefaults(level = AccessLevel.PRIVATE)
// public class Evenement {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     Long idEvenement;

//     String titre;
//     String description;

//     LocalDate date;
//     LocalTime heureDebut;
//     LocalTime heureFin;
//     @Enumerated(EnumType.STRING)
//     Type_Etablissement type;

//     @ManyToOne
//     @JoinColumn(name = "idEtablissment")
//     Etablissement etablissement;

// }
