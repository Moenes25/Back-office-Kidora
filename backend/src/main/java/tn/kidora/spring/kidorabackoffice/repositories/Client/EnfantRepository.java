package tn.kidora.spring.kidorabackoffice.repositories.Client;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;

import java.util.List;

public interface EnfantRepository extends MongoRepository<Enfants, String> {
    List<Enfants> findByParentId(String parentId);
  //  long countByParent_Etablissement_IdEtablissment(String etablissementId);
  @Query(value="{ 'etablissement.$id' : ?0 }", count=true)
  Long countByIdEtablissement(ObjectId etablissementId);



}
