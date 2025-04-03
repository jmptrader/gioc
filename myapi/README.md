```bash
# EJECUTAR DOCKERFILE
docker build -t go-oracle-app .  

```bash
# EJECUTAR IMAGE
docker run -it -p 8080:8080 go-oracle-app