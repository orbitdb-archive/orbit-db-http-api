root-cert:
	openssl genrsa -des3 -out certs/orbit-db-http-api.key 2048
	openssl req -x509 \
		-new -nodes \
		-key certs/orbit-db-http-api.key \
		-sha256 \
		-days 1024 \
		-out certs/orbit-db-http-api.pem
	mkdir /usr/local/share/ca-certificates/extra
	cp certs/orbit-db-http-api.pem /usr/local/share/ca-certificates/extra/orbit-db-http-api.crt
	update-ca-certificates

uninstall-root-cert:
	rm -rf /usr/local/share/ca-certificates/extra/orbit-db-http-api.crt
	rmdir --ignore-fail-on-non-empty /usr/local/share/ca-certificates/extra
	update-ca-certificates
