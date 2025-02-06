public with sharing class CaseHelper {
    @AuraEnabled(cacheable=true)
    public static List<Case> getOpenCases(){
    
            List<Case> opencases = [SELECT Id, Subject, Reason, Origin, Priority, CaseNumber FROM Case WHERE Status != 'Closed'];
            System.debug(opencases);
            return opencases;
        
    }
}