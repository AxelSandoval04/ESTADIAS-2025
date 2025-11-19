# Diagramas del Sistema ISIELECT

Este documento contiene los diagramas técnicos que describen la arquitectura, flujos de interacción y estructura del sistema de gestión de proyectos y cotizaciones de ISIELECT.

---

## 1. Diagrama de Arquitectura Cliente-Servidor

Este diagrama ilustra la interacción entre las capas frontend, backend y base de datos, incluyendo los flujos de autenticación, capas de middleware y la separación entre rutas públicas y administrativas.

```mermaid
graph TB
    subgraph Cliente["Cliente - Navegador"]
        A[React SPA<br/>Vite + TypeScript]
        A1[Componentes Públicos<br/>Home, Projects, Contact]
        A2[Componentes Administrativos<br/>AdminPanel, Moderation]
        A3[Context API<br/>AuthContext + JWT]
        A --> A1
        A --> A2
        A --> A3
    end

    subgraph Servidor["Servidor - Backend"]
        B[Express API<br/>Node.js]
        B1[Middleware Autenticación<br/>JWT Verification]
        B2[Middleware Admin<br/>Role Check]
        B3[Middleware Upload<br/>Multer]
        B4[Controladores]
        B5[Modelos Mongoose]
        
        B --> B1
        B --> B2
        B --> B3
        B1 --> B4
        B2 --> B4
        B3 --> B4
        B4 --> B5
    end

    subgraph BaseDatos["Base de Datos"]
        C[(MongoDB Atlas)]
        C1[Users Collection]
        C2[Projects Collection]
        C3[Categories Collection]
        C4[Quotes Collection]
        C5[Reviews Collection]
        
        C --> C1
        C --> C2
        C --> C3
        C --> C4
        C --> C5
    end

    subgraph Rutas["Rutas API REST"]
        R1["/api/auth/*<br/>Login, Register"]
        R2["/api/projects/*<br/>CRUD Projects"]
        R3["/api/categories/*<br/>CRUD Categories"]
        R4["/api/quotes/*<br/>Submit, Reply"]
        R5["/api/reviews/*<br/>Submit, Moderate"]
    end

    A3 -->|HTTP + JWT Token| B1
    A1 -->|GET Public Data| R1
    A2 -->|POST/PUT/DELETE<br/>Admin Operations| R2
    
    R1 --> B4
    R2 --> B4
    R3 --> B4
    R4 --> B4
    R5 --> B4
    
    B5 -->|Mongoose ODM| C

    style A fill:#61dafb,stroke:#333,stroke-width:3px
    style B fill:#68a063,stroke:#333,stroke-width:3px
    style C fill:#4db33d,stroke:#333,stroke-width:3px
    style B1 fill:#ffd700,stroke:#333,stroke-width:2px
    style B2 fill:#ff6b6b,stroke:#333,stroke-width:2px
    style A3 fill:#90caf9,stroke:#333,stroke-width:2px
```

**Ventajas de esta arquitectura:**
- **Escalabilidad**: Separación clara entre capas permite escalar frontend y backend de forma independiente
- **Mantenibilidad**: Responsabilidades bien definidas facilitan depuración y actualizaciones
- **Seguridad**: Middleware de autenticación centralizado protege rutas administrativas
- **Flexibilidad**: API REST permite integrar clientes adicionales (móvil, desktop) en el futuro

---

## 2. Diagrama de Secuencia: Creación de Proyecto

Este diagrama describe paso a paso la interacción que ocurre cuando un administrador crea un nuevo proyecto en el sistema.

```mermaid
sequenceDiagram
    participant Admin as Administrador
    participant UI as React AdminPanel
    participant API as Express API
    participant AuthMW as Middleware Auth
    participant AdminMW as Middleware Admin
    participant Upload as Middleware Upload
    participant Controller as Project Controller
    participant Model as Project Model
    participant DB as MongoDB Atlas

    Admin->>UI: Completa formulario y adjunta imagen
    UI->>UI: Valida datos localmente (required fields)
    UI->>UI: Crea FormData con imagen
    
    UI->>API: POST /api/projects<br/>(FormData + JWT Header)
    
    API->>AuthMW: Verifica token JWT
    AuthMW->>AuthMW: Decodifica y valida token
    
    alt Token inválido o expirado
        AuthMW-->>UI: 401 Unauthorized
        UI->>Admin: Redirige a Login
    end
    
    AuthMW->>AdminMW: Token válido, verifica rol
    AdminMW->>AdminMW: Verifica user.role === 'admin'
    
    alt Usuario no es admin
        AdminMW-->>UI: 403 Forbidden
        UI->>Admin: Muestra error "Acceso denegado"
    end
    
    AdminMW->>Upload: Procesa multipart/form-data
    Upload->>Upload: Valida tipo y tamaño de imagen
    Upload->>Upload: Guarda archivo en /uploads
    
    Upload->>Controller: Pasa req.file y req.body
    Controller->>Controller: Valida datos (categoryId, title, description)
    Controller->>Controller: Construye objeto proyecto con mainImage
    
    Controller->>Model: create(projectData)
    Model->>DB: INSERT documento en Projects
    DB-->>Model: Documento creado con _id
    Model-->>Controller: Proyecto creado
    
    Controller->>Model: populate('categoryId createdBy')
    Model->>DB: JOIN con Categories y Users
    DB-->>Model: Datos populados
    Model-->>Controller: Proyecto completo
    
    Controller-->>API: 201 Created + proyecto JSON
    API-->>UI: Response con proyecto
    
    UI->>UI: Actualiza lista de proyectos
    UI->>Admin: Muestra toast "Proyecto creado exitosamente"
    UI->>Admin: Limpia formulario y preview
```

**Puntos clave de validación:**
1. **Autenticación**: Token JWT válido y no expirado
2. **Autorización**: Usuario con rol 'admin'
3. **Validación de archivo**: Imagen dentro de límites (10MB, tipo image/*)
4. **Validación de datos**: categoryId existe, campos requeridos presentes
5. **Respuesta poblada**: Incluye datos relacionados (categoría, autor) para el UI

---

## 3. Diagrama de Endpoints API

Este diagrama mapea todas las rutas HTTP, métodos, datos esperados y respuestas generadas por cada endpoint.

```mermaid
---
config:
  theme: default
  layout: elk
---
graph TD
    subgraph Auth["🔐 Authentication Endpoints"]
        AUTH1["POST /api/auth/register<br/>📝 Body: name, email, password<br/>✅ Response: user + token"]
        AUTH2["POST /api/auth/login<br/>📝 Body: email, password<br/>✅ Response: user + token"]
        AUTH3["GET /api/auth/me<br/>🔑 Headers: JWT<br/>✅ Response: user data"]
    end

    subgraph Proj["📁 Projects Endpoints"]
        PROJ1["GET /api/projects<br/>❓ Query: categoryId?<br/>✅ Response: projects array"]
        PROJ2["GET /api/projects/:id<br/>✅ Response: project detail"]
        PROJ3["POST /api/projects<br/>🔒 Auth: Admin<br/>📝 Body: FormData + image<br/>✅ Response: created project"]
        PROJ4["PUT /api/projects/:id<br/>🔒 Auth: Admin<br/>📝 Body: FormData + image?<br/>✅ Response: updated project"]
        PROJ5["DELETE /api/projects/:id<br/>🔒 Auth: Admin<br/>✅ Response: success message"]
        PROJ6["PATCH /api/projects/:id/deactivate<br/>🔒 Auth: Admin<br/>✅ Response: deactivated project"]
    end

    subgraph Cat["📂 Categories Endpoints"]
        CAT1["GET /api/categories<br/>✅ Response: categories array"]
        CAT2["POST /api/categories<br/>🔒 Auth: Admin<br/>📝 Body: title, description, icon, order<br/>✅ Response: created category"]
        CAT3["PUT /api/categories/:id<br/>🔒 Auth: Admin<br/>📝 Body: title, description, icon, order<br/>✅ Response: updated category"]
        CAT4["DELETE /api/categories/:id<br/>🔒 Auth: Admin<br/>✅ Response: success message"]
        CAT5["PATCH /api/categories/:id/deactivate<br/>🔒 Auth: Admin<br/>✅ Response: deactivated category"]
    end

    subgraph Quotes["💬 Quotes Endpoints"]
        QUOTE1["GET /api/quotes<br/>🔒 Auth: Admin<br/>✅ Response: all quotes array"]
        QUOTE2["POST /api/quotes<br/>👤 Auth: User<br/>📝 Body: phone, message<br/>✅ Response: created quote"]
        QUOTE3["PATCH /api/quotes/:id/reply<br/>🔒 Auth: Admin<br/>📝 Body: response<br/>✅ Response: updated quote"]
        QUOTE4["DELETE /api/quotes/:id<br/>🔒 Auth: Admin<br/>✅ Response: success message"]
    end

    subgraph Rev["⭐ Reviews Endpoints"]
        REV1["GET /api/reviews<br/>❓ Query: status=approved<br/>✅ Response: reviews array"]
        REV2["GET /api/reviews/pending<br/>🔒 Auth: Admin<br/>✅ Response: pending reviews"]
        REV3["POST /api/reviews<br/>👤 Auth: User<br/>📝 Body: projectId, rating, comment<br/>✅ Response: created review"]
        REV4["PATCH /api/reviews/:id/approve<br/>🔒 Auth: Admin<br/>✅ Response: approved review"]
        REV5["PATCH /api/reviews/:id/reject<br/>🔒 Auth: Admin<br/>✅ Response: rejected review"]
        REV6["DELETE /api/reviews/:id<br/>🔒 Auth: Admin<br/>✅ Response: success message"]
    end

    style AUTH1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style AUTH2 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style AUTH3 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style PROJ1 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style PROJ2 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style PROJ3 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style PROJ4 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style PROJ5 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style PROJ6 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style CAT1 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style CAT2 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style CAT3 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style CAT4 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style CAT5 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style QUOTE1 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style QUOTE2 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style QUOTE3 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style QUOTE4 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style REV1 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style REV2 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style REV3 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style REV4 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style REV5 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style REV6 fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

**Leyenda:**
- 🔵 **Azul**: Endpoints de autenticación
- 🟢 **Verde (sin color)**: Endpoints públicos GET
- 🔴 **Rojo**: Endpoints que requieren autenticación Admin

**Convenciones:**
- Todos los endpoints admin requieren header `Authorization: Bearer <token>`
- Los endpoints POST/PUT/PATCH esperan `Content-Type: application/json` o `multipart/form-data` (proyectos)
- Los errores siguen formato: `{ success: false, message: "..." }`
- Las respuestas exitosas siguen: `{ success: true, data: {...} }`

---

## 4. Wireframes y Mockups de Interfaces

### 4.1 Admin Panel - Pestaña de Proyectos

```
┌─────────────────────────────────────────────────────────────────┐
│  ISIELECT - Panel de Administración                    [Logout] │
├─────────────────────────────────────────────────────────────────┤
│  [Proyectos] [Cotizaciones] [Reseñas] [Categorías]             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Crear Nuevo Proyecto                                           │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Título*         [________________________]                  ││
│  │                                                              ││
│  │ Descripción*    [________________________]                  ││
│  │                 [________________________]                  ││
│  │                 [________________________]                  ││
│  │                                                              ││
│  │ Categoría*      [▼ Seleccionar categoría]                  ││
│  │                                                              ││
│  │ Imagen:         [ URL de imagen        ]                    ││
│  │           o     [ Subir archivo ▼ ]                         ││
│  │                                                              ││
│  │ Preview:        ┌──────────┐                                ││
│  │                 │  [IMG]   │                                ││
│  │                 └──────────┘                                ││
│  │                                                              ││
│  │                      [  Crear Proyecto  ]                   ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Proyectos Existentes                                           │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ [IMG] │ Proyecto Industrial CFE        │ Industrial    │ ✏️ 🗑️││
│  │ [IMG] │ Instalación Comercial Plaza    │ Comercial     │ ✏️ 🗑️││
│  │ [IMG] │ Casa Residencial Col. Centro   │ Residencial   │ ✏️ 🗑️││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Página Pública de Proyectos

```
┌─────────────────────────────────────────────────────────────────┐
│  [LOGO] ISIELECT      [Inicio] [Proyectos] [Reseñas] [Contacto]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│         Nuestros Proyectos                                      │
│         Conoce algunos de nuestros trabajos más destacados      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Filtrar por categoría:                                         │
│  [ 🏭 Todos ]  [ ⚡ Industrial ]  [ 🏢 Comercial ]  [ 🏠 Residencial ]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │   [IMG]    │  │   [IMG]    │  │   [IMG]    │               │
│  │            │  │            │  │            │               │
│  │ Proyecto 1 │  │ Proyecto 2 │  │ Proyecto 3 │               │
│  │ Industrial │  │ Comercial  │  │ Residencial│               │
│  │            │  │            │  │            │               │
│  │ Desc...    │  │ Desc...    │  │ Desc...    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │   [IMG]    │  │   [IMG]    │  │   [IMG]    │               │
│  │            │  │            │  │            │               │
│  │ Proyecto 4 │  │ Proyecto 5 │  │ Proyecto 6 │               │
│  │ Industrial │  │ Comercial  │  │ Industrial │               │
│  │            │  │            │  │            │               │
│  │ Desc...    │  │ Desc...    │  │ Desc...    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Interfaz de Envío de Reseña

```
┌─────────────────────────────────────────────────────────────────┐
│                    Dejar una Reseña                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Proyecto:      [▼ Seleccionar proyecto realizado]             │
│                                                                  │
│  Calificación:  ★ ★ ★ ★ ★                                      │
│                 (Haz clic para calificar)                       │
│                                                                  │
│  Tu Comentario: [_________________________________]             │
│                 [_________________________________]             │
│                 [_________________________________]             │
│                 [_________________________________]             │
│                                                                  │
│  Nota: Tu reseña será revisada por nuestro equipo antes        │
│        de ser publicada.                                        │
│                                                                  │
│                      [  Enviar Reseña  ]                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Panel de Moderación de Reseñas

```
┌─────────────────────────────────────────────────────────────────┐
│  ISIELECT - Panel de Administración                             │
├─────────────────────────────────────────────────────────────────┤
│  [Proyectos] [Cotizaciones] [Reseñas] [Categorías]             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Reseñas Pendientes de Moderación                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 👤 Juan Pérez                    Fecha: 15/11/2025         ││
│  │ Proyecto: Instalación Industrial CFE                       ││
│  │ Calificación: ★★★★★                                        ││
│  │                                                             ││
│  │ "Excelente trabajo, muy profesionales. Cumplieron con      ││
│  │  todos los tiempos acordados y la instalación quedó        ││
│  │  perfecta. Totalmente recomendados."                       ││
│  │                                                             ││
│  │              [ ✅ Aprobar ]    [ ❌ Rechazar ]              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 👤 María González                Fecha: 14/11/2025         ││
│  │ Proyecto: Casa Residencial Centro                          ││
│  │ Calificación: ★★★★☆                                        ││
│  │                                                             ││
│  │ "Buen servicio en general. La única observación es que     ││
│  │  tardaron un día más de lo previsto, pero el resultado     ││
│  │  final es muy bueno."                                      ││
│  │                                                             ││
│  │              [ ✅ Aprobar ]    [ ❌ Rechazar ]              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Diagrama de Flujo de Autenticación

```mermaid
flowchart TD
    Start([Usuario accede a la app]) --> CheckAuth{¿Tiene token JWT<br/>guardado?}
    
    CheckAuth -->|No| PublicView[Mostrar vistas públicas:<br/>Home, Projects, Reviews, Contact]
    CheckAuth -->|Sí| ValidateToken[Validar token con backend]
    
    ValidateToken --> IsValid{¿Token válido?}
    IsValid -->|No| RemoveToken[Eliminar token inválido]
    RemoveToken --> PublicView
    
    IsValid -->|Sí| LoadUser[Cargar datos de usuario]
    LoadUser --> CheckRole{¿Es Admin?}
    
    CheckRole -->|No| UserView[Vista de Usuario:<br/>Puede solicitar cotizaciones<br/>y dejar reseñas]
    CheckRole -->|Sí| AdminView[Vista de Admin:<br/>Acceso a AdminPanel<br/>+ vistas públicas]
    
    PublicView --> NeedsAuth{¿Intenta acción<br/>protegida?}
    NeedsAuth -->|Sí| RedirectLogin[Redirigir a /login]
    NeedsAuth -->|No| Continue[Continuar navegando]
    
    RedirectLogin --> Login[Formulario de Login]
    Login --> Submit[Enviar credenciales]
    Submit --> BackendAuth[POST /api/auth/login]
    
    BackendAuth --> AuthSuccess{¿Credenciales<br/>correctas?}
    AuthSuccess -->|No| ShowError[Mostrar error]
    ShowError --> Login
    
    AuthSuccess -->|Sí| SaveToken[Guardar JWT en localStorage]
    SaveToken --> LoadUser
    
    UserView --> Logout{¿Logout?}
    AdminView --> Logout
    Logout -->|Sí| ClearToken[Eliminar token]
    ClearToken --> PublicView
    
    style Start fill:#e1f5e1
    style PublicView fill:#e3f2fd
    style UserView fill:#fff9c4
    style AdminView fill:#ffccbc
    style BackendAuth fill:#f3e5f5
    style SaveToken fill:#c8e6c9
```

---

## 6. Diagrama de Componentes React

```mermaid
graph TD
    App[App.tsx<br/>Router Principal] --> Nav[Navigation.tsx<br/>Header + Menu]
    App --> AuthContext[AuthContext.tsx<br/>Estado Global Auth]
    
    App --> Home[HomePage.tsx]
    App --> Projects[ProjectsPage.tsx]
    App --> Reviews[ReviewsPage.tsx]
    App --> Contact[ContactPage.tsx]
    App --> About[AboutPage.tsx]
    App --> Login[LoginPage.tsx]
    App --> Profile[ProfilePage.tsx]
    App --> Admin[AdminPanel.tsx]
    
    Projects --> API1[categoriesAPI.getAll]
    Projects --> API2[projectsAPI.getAll]
    
    Admin --> AdminProjects[Projects Tab]
    Admin --> AdminQuotes[Quotes Tab]
    Admin --> AdminReviews[Reviews Tab]
    Admin --> AdminCategories[Categories Tab]
    
    AdminProjects --> API3[projectsAPI.create/update]
    AdminQuotes --> API4[quotesAPI.reply/delete]
    AdminReviews --> API5[reviewsAPI.approve/reject]
    AdminCategories --> API6[categoriesAPI.create/update]
    
    Contact --> API7[quotesAPI.create]
    Reviews --> API8[reviewsAPI.create]
    
    AuthContext --> API9[authAPI.login/register/me]
    
    Nav --> UserMenu[UserMenu.tsx<br/>Dropdown User]
    
    App --> Footer[Footer.tsx]
    
    style App fill:#61dafb,stroke:#333,stroke-width:3px
    style AuthContext fill:#ffd700,stroke:#333,stroke-width:2px
    style Admin fill:#ff6b6b,stroke:#333,stroke-width:2px
    style API1 fill:#4caf50
    style API2 fill:#4caf50
    style API3 fill:#4caf50
    style API4 fill:#4caf50
    style API5 fill:#4caf50
    style API6 fill:#4caf50
    style API7 fill:#4caf50
    style API8 fill:#4caf50
    style API9 fill:#4caf50
```

---

## 7. Diagrama de Modelo de Datos (MongoDB)

```mermaid
erDiagram
    USER ||--o{ QUOTE : "solicita"
    USER ||--o{ REVIEW : "escribe"
    USER ||--o{ PROJECT : "crea (admin)"
    CATEGORY ||--o{ PROJECT : "contiene"
    PROJECT ||--o{ REVIEW : "recibe"
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password "hashed"
        enum role "user|admin"
        date createdAt
    }
    
    CATEGORY {
        ObjectId _id PK
        string title UK
        string description
        string icon "lucide-icon-name"
        number order
        boolean isActive
        date createdAt
    }
    
    PROJECT {
        ObjectId _id PK
        string title
        string description
        ObjectId categoryId FK
        string mainImage "url or /uploads/..."
        array images "secondary images"
        ObjectId clientId FK "optional"
        enum status "active|completed|archived"
        number order
        boolean featured
        boolean isActive
        ObjectId createdBy FK
        ObjectId updatedBy FK
        date createdAt
        date updatedAt
    }
    
    QUOTE {
        ObjectId _id PK
        ObjectId userId FK
        string phone
        string message
        string response "admin reply"
        date respondedAt
        enum status "pending|responded|closed"
        date createdAt
    }
    
    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId projectId FK
        number rating "1-5"
        string comment
        enum status "pending|approved|rejected"
        ObjectId moderatedBy FK "admin"
        date moderatedAt
        date createdAt
    }
```

**Relaciones clave:**
- Un **User** puede tener múltiples **Quotes**, **Reviews**, y crear **Projects** (si es admin)
- Una **Category** puede contener múltiples **Projects**
- Un **Project** puede recibir múltiples **Reviews**
- Los campos `createdBy`, `updatedBy`, `moderatedBy` referencian al modelo **User**
- Todos los modelos usan `ObjectId` de MongoDB como clave primaria

---

## Notas de Implementación

### Tecnologías Utilizadas
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + Mongoose
- **Base de Datos**: MongoDB Atlas
- **Autenticación**: JWT (jsonwebtoken + bcryptjs)
- **Uploads**: Multer (almacenamiento en disco local)
- **Validación**: express-validator
- **CORS**: cors middleware

### Decisiones de Diseño
1. **SPA con React**: Permite navegación fluida sin recargas de página
2. **API RESTful**: Estándar de la industria, fácil de documentar y consumir
3. **JWT sin refresh tokens**: Implementación simplificada para MVP
4. **Soft delete**: Los proyectos y categorías se desactivan en lugar de eliminarse
5. **Moderación de reseñas**: Control de calidad antes de publicación
6. **Roles binarios**: user/admin (suficiente para alcance actual)

### Próximos Pasos Recomendados
- [ ] Implementar paginación en listados de proyectos y reseñas
- [ ] Agregar búsqueda full-text en proyectos
- [ ] Migrar uploads a Cloudinary para producción
- [ ] Implementar refresh tokens para sesiones más seguras
- [ ] Agregar analytics de proyectos más visitados
- [ ] Exportar cotizaciones a Excel/PDF para reportes

---

**Documento generado el**: 17 de noviembre de 2025  
**Versión del sistema**: 1.0.0  
**Autor**: Proyecto ISIELECT - Ingeniería en Sistemas Computacionales
