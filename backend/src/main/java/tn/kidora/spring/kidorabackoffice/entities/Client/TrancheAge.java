package tn.kidora.spring.kidorabackoffice.entities.Client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TrancheAge {
    QUATRE_CINQ_ANS("4-5 ans"),
    CINQ_SIX_ANS("5-6 ans"),
    SIX_SEPT_ANS("6-7 ans"),
    HUIT_NEUF_ANS("8-9 ans"),
    DIX_ONZE_ANS("10-11 ans");


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
