#! /bin/bash

openssl req \
 -new -sha256 -nodes \
 -out ./certs/localhost.csr \
 -newkey rsa:2048 -keyout ./certs/localhost.key \
 -subj "/C=AU/ST=WA/L=City/O=Organization/OU=OrganizationUnit/CN=localhost/emailAddress=demo@example.com"

openssl x509 \
 -req \
 -in ./certs/localhost.csr \
 -CA ./certs/orbit-db-http-api.pem -CAkey ./certs/orbit-db-http-api.key -CAcreateserial \
 -out ./certs/localhost.crt \
 -days 500 \
 -sha256 \
 -extfile <(echo " \
    [ v3_ca ]\n \
    authorityKeyIdentifier=keyid,issuer\n \
    basicConstraints=CA:FALSE\n \
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment\n \
    subjectAltName=DNS:localhost \
   ")
