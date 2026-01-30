package tn.kidora.spring.kidorabackoffice.utils;

public class Constants {

    public static final String APP_ROOT = "/api";
    public static final String AUTH = "/auth";
    public static final String USER = "/user";
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";
    public static final String ALL = "/all";
    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";
    public static final String ETABLISSEMENT = "/etablissement";
    public static final String ADMIN_GENERAL = "admin_general";
    public static final String BY_TYPE = "/byType";
    public static final String By_REGION = "/byRegion";
    public static final String ID = "/{id}";
    public static final String ACTIVE = "/active";
    public static final String TOOGLE_STATUS = "/toggle_status";
    public static final String ABONNEMENT = "/abonnement";
    public static final String BY_ETABLISSEMENT = "/byetablissement";
    public static final String BY_STATUS= "/bystatus";
    public static final String CEMOIS = "/cemois";
    public static final String ECOLE_ACTIVE="/ecoleactive";
    public static final String CRECHE_ACTIVE="/crecheactive";
    public static final String GARDERIE_ACTIVE="/garderieactive";
    public static final String CROISSANCE = "/croissance";
    public static final String REPARTITION_ANNUELLE = "/repartition-annuelle";
    public static final String EVENEMENT = "/evenement";
    public static final String EVENEMENT_BY_DATE = "/evenement/byDate/{date}";
    public static final String EVENEMENT_UPDATE = "/evenement/update/{id}";
    public static final String EVENEMENT_DELETE = "/evenement/delete/{id}";
    public static final String EVENEMENT_COUNT_BY_TYPE = "/evenement/countByType";

    public static final String EN_ESSAYE = "/en-essaye";
    public static final String EN_RETARD = "/en-retard";

    public static final String UPDATE_PROFILE = "/update-profile";
    public static final String DELETE_USER = "/delete-user/{id}";

    public static final String INACTIVE_NBR_JRS = "/inactivate-nbr-jrs";

    public static final String ROLES = "/roles";
    public static final String SUPERADMIN_UPDATE_PASSWORD = "/superadmin/update-password";
    public static final String UserByREGION = "/byRegion";
    public static final String ACTIVITY = "/activity";
    public static final String ALLACTIVITY = "/all";
    public static final String CLIENT = "/client";
    public static final String CLIENT_REGISTER = "/register";
    public static final String CLIENT_LOGIN = "/login";
    public static final String AJOUTER_ENFANT = "/ajouter";
    public static final String DELETE_ENFANT="/delet-enfnat";
    public static final String GETALLENFANT="/AllEnfant";
    public static final String UPDATE_ENFANT="/UpdateEnfant";
    public static final String GET_ANFANT_BYID_PARENT="/BYIdPrent";
    public static final String DELETE_CLIENT = "/delete-client";
    public static final String update_CLIENT = "/update-client";
    public static final String ALL_CLIENTS = "/all";
    public static final String ALL_PARENTS = "/parents";
    public static final String ALL_EDUCATEURS = "/educateurs";
    public static final String AJOUTER_CLASSE = "/ajouter";
    public static final String GET_ALL_CLASSES = "/all";
    public static final String COUNT_ENFANT = "/count";
    public static final String TOTAL_PARENTS = "/parents/total";
    public static final String NOMBRE_PARENTS = "/{id}/nombre-parents";
    public static final String NOMBRE_EDUCATEURS = "/{id}/nombre-educateurs";
    public static final String NOMBRE_ENFANTS = "/{id}/nombre-enfants";


    // -------------------- ANALYTICS --------------------
    public static final String ANALYTICS = "/analytics";
    public static final String ANALYTICS_DASHBOARD = "/dashboard";
    public static final String ANALYTICS_ETABS_AVEC_ABON = "/etablissements/avec-abonnement";
    public static final String ANALYTICS_ETABS_SANS_ABON = "/etablissements/sans-abonnement";
    public static final String ANALYTICS_REPARTITION_TYPE = "/repartition/type";
    public static final String ANALYTICS_REPARTITION_STATUT = "/repartition/statut";
    public static final String ANALYTICS_EVOLUTION_MENSUELLE = "/evolution-mensuelle";


    //----------------------Factures------------------------
    public static final String FACTURE = "/factures";
    public static final String ADD_FACTURE = "/add/facture";
    public static final String FACTURE_TOTAL = "/total";
    public static final String FACTURE_TOTAL_PAYEES = "/total/payees";
    public static final String FACTURE_TOTAL_IMPAYEES = "/total/impayees";
    public static final String FACTURE_ALL = "/all";
    public static final String FACTURE_BY_ID = "/{id}";
    public static final String FACTURE_SEND_EMAIL = "/{id}/send-email";
    // ---------------------- CLIENT EVENTS ------------------------
    public static final String CLIENT_EVENTS = "/client/evenements";
    public static final String CREATE_EVENT = "/create";
    public static final String EVENTS_BY_DAY = "/events/today";
    public static final String UPDATE_EVENT = "/update/{id}";
    public static final String EVENTS_BY_WEEK = "/events/week";
    public static final String EVENTS_BY_MONTH = "/events/month";
    public static final String GET_EVENT_BY_ID = "/events/{id}";
    public static final String DELETE_EVENT = "/events/delete/{id}";




    public static final String EDUCATEUR_CLASSE="/educateur-classe";
    public static final String CLASSES = "/classes";
    public static final String EDUCATEURS= "/educateurs";
    public static final String ANFANTS_BY_CLASSE = "/enfants-by-classe";



    public static final String MARQUER_ABSENCE = "/marquer";
    public static final String NOMBRE_PRESENTS_AUJOURDHUI = "/presents/aujourdhui";
    public static final String NOMBRE_ABSENTS_AUJOURDHUI = "/absents/aujourdhui";





}
