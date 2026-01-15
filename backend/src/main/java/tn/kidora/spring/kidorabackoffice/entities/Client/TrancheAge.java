package tn.kidora.spring.kidorabackoffice.entities.Client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TrancheAge {
    UN_DEUX_ANS("1-2 ans (Tout-petits)"),
    DEUX_TROIS_ANS("2-3 ans (Petits)"),
    TROIS_QUATRE_ANS("3-4 ans (Moyens)"),
    QUATRE_CINQ_ANS("4-5 ans (Grands)"),
    CINQ_SIX_ANS("5-6 ans (Pré-scolaire)");

    private final String label;

    TrancheAge(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
    @JsonCreator
    public static TrancheAge fromLabel(String label) {
        for (TrancheAge t : TrancheAge.values()) {
            if (t.label.equals(label)) {
                return t;
            }
        }
        throw new IllegalArgumentException("TrancheAge inconnu: " + label);
    }
}
