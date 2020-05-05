const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
export const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'XVRPTI7YAN2RDU2ZVSHT',
    secretAccessKey: 'm6n5aAM1P6hII1RgYzVZfKJyRkl5dnuz2PMCE/WaV6g'
});