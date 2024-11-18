# PixelArt

Proyecto de Aula que implementa una aplicación de Pixel Art. Este proyecto cuenta con un **frontend** desarrollado en **Angular** y un **backend** implementado en **Java** con Spring Boot.

## Tabla de Contenidos

1. [Características](#características)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Base de Datos](#base-de-datos)
3. [Instalación](#instalación)
   - [Prerequisitos](#prerequisitos)
   - [Clonar el Repositorio](#clonar-el-repositorio)
4. [Configuración del Backend](#configuración-del-backend)
   - [Instalar Dependencias](#instalar-dependencias)
   - [Ejecutar la Aplicación Java](#ejecutar-la-aplicación-java)
5. [Configuración del Frontend](#configuración-del-frontend)
   - [Instalar Dependencias](#instalar-dependencias-1)
   - [Ejecutar la Aplicación Angular](#ejecutar-la-aplicación-angular)
6. [Contribuciones](#contribuciones)
7. [Licencia](#licencia)

## Características

- Crear, editar y eliminar imágenes de pixel art.
- Visualizar una galería de obras de arte.
- Interacción entre el frontend y el backend a través de API REST.

## Tecnologías Utilizadas

### Frontend
- [Angular](https://angular.io/) - Framework para construir aplicaciones web.
- [Bootstrap](https://getbootstrap.com/) - Framework de CSS para diseño responsivo.

### Backend
- [Java](https://www.java.com/) - Lenguaje de programación.
- [Spring Boot](https://spring.io/projects/spring-boot) - Framework para crear aplicaciones web en Java.
- [Hibernate](https://hibernate.org/) - Framework para la gestión de bases de datos.

### Base de Datos
- [MySQL](https://www.mysql.com/) - Sistema de gestión de bases de datos relacional.

## Instalación

### Prerequisitos

Asegúrate de tener instalados los siguientes programas en tu máquina:

- [Node.js](https://nodejs.org/) (incluye npm)
- [Java JDK](https://www.oracle.com/co/java/technologies/downloads/#java21)
- [Maven](https://maven.apache.org/)

### Clonar el Repositorio

```bash
git clone https://github.com/tu_usuario/pixelart.git
cd pixelart
```

## Configuración del Backend


```bash
cd backend
```

### Instalar dependencias
```bash
mvn clean install
```

### Ejecutar la Aplicación Java
```bash
mvn spring-boot:run
```

## Configuración del Frontend

```bash
cd ../frontend
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar la Aplicación Angular

```bash
npm run start
```
