global
  daemon
  maxconn 256

defaults
  mode http
  timeout connect 5000ms
  timeout client 50000ms
  timeout server 50000ms
  stats enable
  stats uri /monitor
  stats auth root:123456

frontend http-in
  bind *:80
  acl is_app hdr(host) -i www.seeyourair.com
  acl is_api hdr(host) -i api.seeyourair.com
  use_backend web-app if is_app
  use_backend manager_api if is_api
  default_backend web-app

backend web-app
  server webapp 127.0.0.1:8888

backend manager_api
  balance roundrobin
  server manager_api1 127.0.0.1:8080 check
  server manager_api2 127.0.0.1:8081 check