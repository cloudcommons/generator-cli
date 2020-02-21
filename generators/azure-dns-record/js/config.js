module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {
        var cfg = {
            DNS_ZONE_RECORD: answers.recordName,
            DNS_ZONE_NAME: answers.zoneName,
            DNS_ZONE_RESOURCE_GROUP: answers.zoneResourceGroup,
            DNS_TTL: answers.ttl
        };

        if (!answers.isRecordReference) {
            cfg.DNS_RECORDS = [answers.record];
        }
        terraform.writeConfig(cfg, configFile);
    }
}