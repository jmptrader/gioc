# Usa la imagen base de Alpine
FROM arm64v8/alpine:latest

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias
RUN apk update && apk add --no-cache \
    bash \
    wget \
    curl \
    gcc \
    g++ \
    make \
    libc-dev \
    git \
    unzip \
    libaio \
    libc6-compat

# Descargar e instalar Go 1.24.2
RUN wget https://dl.google.com/go/go1.24.2.linux-arm64.tar.gz -P /tmp && \
    tar -C /usr/local -xzf /tmp/go1.24.2.linux-arm64.tar.gz && \
    rm /tmp/go1.24.2.linux-arm64.tar.gz

# Descargar e instalar Oracle Instant Client 19.26 para ARM64
RUN wget https://download.oracle.com/otn_software/linux/instantclient/1926000/instantclient-basic-linux.arm64-19.26.0.0.0dbru.zip -P /tmp && \
    unzip /tmp/instantclient-basic-linux.arm64-19.26.0.0.0dbru.zip -d /opt && \
    rm /tmp/instantclient-basic-linux.arm64-19.26.0.0.0dbru.zip

# Configurar las variables de entorno de Go
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH=/go
ENV GOROOT=/usr/local/go
ENV PATH=$PATH:$GOPATH/bin

# Configurar Oracle Instant Client
ENV LD_LIBRARY_PATH=/opt/instantclient_19_26
ENV OCI_LIB64=/opt/instantclient_19_26
ENV OCI_INCLUDE_DIR=/opt/instantclient_19_26/sdk/include

# Copiar el código fuente de Go al contenedor
COPY . .

# Descargar las dependencias de Go
RUN go mod tidy

# Compilar el código Go
RUN go build -o myapp .

# Exponer el puerto que tu aplicación Go usará
EXPOSE 8080

# Ejecutar la aplicación Go
CMD ["./myapp"]