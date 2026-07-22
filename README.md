final 

# 1. Observability & Troubleshooting 
[2026-05-06T10:01:11.102Z] [INFO] [api-gateway] RequestID=8fd12a1 GET /api/orders?page=1 
[2026-05-06T10:01:11.130Z] [INFO] [auth-service] JWT validation success user_id=182 
[2026-05-06T10:01:11.145Z] [INFO] [orders-service] Fetching orders user_id=182 
[2026-05-06T10:01:11.201Z] [WARN] [orders-service] Slow query detected execution_time=2400ms 
[2026-05-06T10:01:13.712Z] [ERROR] [db-primary] Connection timeout host=10.10.2.14 port=5432 
[2026-05-06T10:01:13.714Z] [INFO] [orders-service] Retry attempt=1 
[2026-05-06T10:01:14.002Z] [ERROR] [redis-cache] Connection refused host=10.10.2.20 port=6379 
[2026-05-06T10:01:14.120Z] [WARN] [orders-service] Falling back to database query 
[2026-05-06T10:01:16.450Z] [ERROR] [db-primary] Deadlock detected transaction_id=TRX991 
[2026-05-06T10:01:17.112Z] [INFO] [orders-service] Retry attempt=2 
[2026-05-06T10:01:19.300Z] [ERROR] [orders-service] Failed fetching orders reason="Database unavailable" 
[2026-05-06T10:01:19.301Z] [INFO] [api-gateway] Response status=500 response_time=8199ms 
[2026-05-06T10:01:20.002Z] [ALERT] [monitoring] High error rate detected endpoint=/api/orders threshold=3 
[2026-05-06T10:01:21.114Z] [INFO] [kubernetes] Pod restart initiated pod=orders-service-77fd 
Tasks: 
1. Identify possible root causes (minimum 3) 
2. Explain troubleshooting steps 
3. Explain how you would investigate slow response and database timeout 
4. Create alert rules for: - High error rate - Slow response - Database failure 
5. Suggest improvements for: - Reliability - Observability - Scalability - Security 
6. Explain monitoring tools you would use in production


# 2. System & Infrastructure 
Website is down (timeout), but the server is still running. 
Tasks: 
Explain step-by-step troubleshooting including commands and reasons: - Check service - Check ports - Check resources - Check logs - Check reverse proxy/load balancer - Check firewall/network issue - Check database connectivity 
Provide Linux commands you would use and explain why.



# Answer

## 1. 
- Monitor the database to check for deadlocks or slow queries where transaction conflicts. Is this caused by the database queries themselves, or is it a network issue with the database connection?
- Check whether the Redis service is active or disabled
- verify the port, connectivity, and firewall to see if anything is blocking access
 

2. .
- .
- systemctl status redis
- ss -tulpn / netstat -tulpn

3 
slow response :
Identify the bottleneck: is it in the database queries, Redis, or the network?
Database timeout:
Check the database logs for lock contention."


4.
High error rate:
IF error_rate(endpoint=/api/orders) > 5% FOR 5m THEN ALERT

Slow response:
IF p95_response_time(endpoint=/api/orders) > 2000ms FOR 5m THEN ALERT

Database failure:

5.
Reliability:
Tambahkan read replicas untuk PostgreSQL.

Observability:
- ..

Scalability:
DB sharding or partitioning for high load.

Security:
Role-based access control di DB.
Secret management

6. Monitoring
APM -> elastic APM

Metric -> prometheus + grafana for cpu memory disk

log -> ELK Stack

Alerting -> Grafana

Infra Monitoring -> Zabbix


## 2. 
A. Check Service
- systemctl status <application> -> check service is active/disable
  
B. check ports
- ss -tulpn / netstat -tulpn (makesure service is bind)

C. check resource
- df -h, top, htop, uptime, free -h (check disk usage, monitoring cpu + memory + disk, check memory free)

D. check logs
- tail -f <logs>, journalctl -x, cat <log>, less. (check live log, all log, less log)

E. check reverse proxy/load balancer
- systemctl status nginx, nginx -t (test config), systemctl reload nginx, cat /etc/nginx/nginx.config, curl localhost:8080 (or port app) -> check nginx service, test nginx conifg, reload nginx, check listen port nginx

F. firewall/connection
- ufw status, ping -> check firewall status, check connection 

G. database
- mysql -h dbserver -u user -p -> Connection to database test
