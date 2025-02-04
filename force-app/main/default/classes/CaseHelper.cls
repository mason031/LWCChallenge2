public with sharing class CaseHelper {
    public CaseHelper() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getOpenCases(){
        try {
            List<Case> opencases = [SELECT Id, Subject, Reason, Origin, Priority, CaseNumber FROM Case WHERE Status != 'Closed'];
            System.debug(opencases);
            return opencases;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}