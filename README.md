# PixelArt

Proyecto de Aula que implementa una aplicacion web de Pixel Art. Permite crear, editar y compartir arte pixelado, con funcionalidades de inteligencia artificial para generacion y animacion de imagenes. El proyecto cuenta con un **frontend** desarrollado en **Angular 19** y un **backend** implementado en **Java 21** con **Spring Boot 3**.

## Tabla de Contenidos

1. [Caracteristicas](#caracteristicas)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalacion](#instalacion)
5. [Configuracion del Backend](#configuracion-del-backend)
6. [Configuracion del Frontend](#configuracion-del-frontend)
7. [Endpoints de la API](#endpoints-de-la-api)
8. [Contribuciones](#contribuciones)

## Caracteristicas

- **Editor de Pixel Art**: Canvas interactivo con herramientas de pincel, borrador, relleno (bucket fill) y selector de color. Tamano de lienzo configurable.
- **Galeria**: Visualizacion de obras de arte con busqueda por titulo y filtros por categoria.
- **Generacion con IA**: Creacion de pixel art a partir de prompts de texto usando la API de PixelLab.
- **Edicion con IA**: Edicion de imagenes existentes mediante inteligencia artificial.
- **Animacion con IA**: Generacion de GIFs animados a partir de arte pixelado con descripciones de movimiento.
- **Autenticacion**: Registro e inicio de sesion de usuarios con tokens JWT.
- **Tema claro/oscuro**: Alternancia entre modo claro y oscuro con persistencia.
- **Gestion de contenido**: Crear, editar y eliminar obras con titulo, descripcion, categoria y etiquetas.
- **Diseno responsivo**: Interfaz adaptable con navegacion lateral para dispositivos moviles.

## Tecnologias Utilizadas

### Frontend

- [Angular 19](https://angular.dev/) - Framework para aplicaciones web (componentes standalone)
- [TypeScript 5.8](https://www.typescriptlang.org/) - Lenguaje de programacion
- [Tailwind CSS 3](https://tailwindcss.com/) - Framework de CSS utilitario
- [PrimeNG 19](https://primeng.org/) - Biblioteca de componentes UI
- [p5.js](https://p5js.org/) - Biblioteca de programacion creativa
- [RxJS 7](https://rxjs.dev/) - Programacion reactiva

### Backend

- [Java 21](https://www.java.com/) - Lenguaje de programacion
- [Spring Boot 3.3](https://spring.io/projects/spring-boot) - Framework para aplicaciones web
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa) / [Hibernate](https://hibernate.org/) - ORM y acceso a datos
- [JWT (jjwt)](https://github.com/jwtk/jjwt) - Autenticacion basada en tokens
- [PixelLab API](https://pixellab.ai/) - Generacion de imagenes con IA
- [animated-gif-lib](https://github.com/rtyley/animated-gif-lib-for-java) - Codificacion de GIFs animados

### Base de Datos

- [MySQL](https://www.mysql.com/) - Sistema de gestion de bases de datos relacional

## Estructura del Proyecto

```
PixelArt/
├── frontend/                # Aplicacion Angular 19
│   └── src/app/
│       ├── main/components/ # Componentes principales (draw, gallery, login, register, ai, home)
│       ├── shared/          # Header, footer, tema, servicios HTTP
│       ├── interfaces/      # Interfaces TypeScript
│       └── environment/     # Configuracion de entorno
│
├── backend/                 # Aplicacion Spring Boot 3
│   └── src/main/java/.../
│       ├── controllers/     # Controladores REST (User, PixelArt, AiImage)
│       ├── services/        # Logica de negocio
│       ├── models/          # Entidades JPA (User, PixelArt, Category, Tag)
│       ├── repositories/    # Acceso a datos (Spring Data JPA)
│       ├── dto/             # Objetos de transferencia de datos
│       ├── config/          # Configuracion (CORS, seguridad)
│       └── util/            # Utilidades (JWT)
│
└── README.md
```

## Instalacion

### Prerequisitos

- [Node.js](https://nodejs.org/) (incluye npm)
- [Java JDK 21](https://www.oracle.com/co/java/technologies/downloads/#java21)
- [Maven](https://maven.apache.org/)
- [MySQL](https://www.mysql.com/) (con una base de datos creada)

### Clonar el Repositorio

```bash
git clone https://github.com/juandavidperez/PixelArt.git
cd PixelArt
```

## Configuracion del Backend

```bash
cd backend
```

### Configurar la Base de Datos

Edita el archivo `src/main/resources/application.properties` con los datos de tu base de datos MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tu_base_de_datos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

El esquema se genera automaticamente gracias a `spring.jpa.hibernate.ddl-auto=update`.

### Configurar la API de PixelLab

En el mismo archivo `application.properties`, agrega tu clave de API de PixelLab:

```properties
pixellab.api.key=tu_api_key
```

### Instalar dependencias

```bash
mvn clean install
```

### Ejecutar la Aplicacion

```bash
mvn spring-boot:run
```

El backend se ejecuta en `http://localhost:4002`.

## Configuracion del Frontend

```bash
cd frontend
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar la Aplicacion

```bash
ng serve
```

La aplicacion se ejecuta en `http://localhost:4200` y se conecta al backend en el puerto 4002.

## Endpoints de la API

El backend expone los siguientes grupos de endpoints REST:

| Grupo | Base | Descripcion |
|-------|------|-------------|
| **Usuarios** | `/users` | Registro, login, consulta y gestion de usuarios |
| **Pixel Art** | `/art` | CRUD de obras de pixel art, categorias |
| **Imagenes IA** | `/api/images` | Generacion, edicion y animacion de imagenes con IA |

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
