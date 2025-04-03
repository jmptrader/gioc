# Docker

```bash
# Construir Imagen
docker build -t go-oracle-app .  
```

```bash
# Construir Container
docker run -it -p 8080:8080 go-oracle-app
```