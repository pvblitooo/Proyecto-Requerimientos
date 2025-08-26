# Sistema de Gestión de Inventario para Dole S.A.

## 1. Objetivo del Proyecto

El principal objetivo de este sistema es **optimizar la gestión de inventario** de frutas (manzanas, cerezas, peras, kiwis) en las cámaras de frío. Busca facilitar el control en tiempo real y mejorar la eficiencia operativa de la empresa.

---

## 2. Módulo de Acceso y Seguridad

Esta sección inicial se centra en el acceso de los usuarios al sistema.

* **Inicio de Sesión**: Un formulario sencillo que solicita **usuario** y **contraseña**.
* **Seguridad**:
    * Implementación de encriptación para las contraseñas.
    * Roles de usuario (ej. "administrador", "operador") para restringir el acceso a funcionalidades.
* **Funcionalidades Adicionales**: Opciones como "Olvidé mi contraseña" para recuperación.

---

## 3. Dashboard o Panel de Control

Esta es la interfaz principal que se muestra después de iniciar sesión, donde se presenta toda la información clave.

### Visualización General de Cámaras de Frío

Un diagrama visual o mapa que representa las cámaras de frío de la planta. Cada cámara debe tener un indicador de estado.

* **Estado**:
    * Ocupada
    * Disponible
    * En Mantenimiento
* **Código de Color**: Un código simple para identificar rápidamente el estado (ej. **rojo** = ocupado, **verde** = disponible, **amarillo** = mantenimiento).

### Detalle del Inventario por Cámara

Al hacer clic en una cámara, se despliega información detallada.

* **Nombre de la Cámara**: Por ejemplo, "Cámara 1", "Cámara 2", etc.
* **Capacidad Total**: Capacidad máxima de la cámara en kilogramos o pallets.
* **Capacidad Ocupada**: Porcentaje o cantidad actual del espacio utilizado.
* **Contenido Actual**: Listado de las frutas que contiene la cámara.
    * Manzanas: 20,000 kg
    * Cerezas: 5,000 kg
    * Peras: 15,000 kg
* **Gráfico de Ocupación**: Un gráfico de barra o circular para una visualización clara de la distribución de las frutas.

---

## 4. Módulo de Registro y Movimiento

Esta sección permite la actualización del inventario a través de interacciones directas.

### Entrada de Fruta

Formulario para registrar la entrada de nuevos lotes.

* **Tipo de Fruta**: Menú desplegable para seleccionar (Manzanas, Cerezas, Peras).
* **Cantidad**: Cantidad en kg.
* **Cámara de Destino**: Selección de la cámara de frío donde se almacenará el lote.

### Salida de Fruta

Formulario para registrar la salida de un lote (para exportación o procesamiento).

* **Selección de la Cámara**: Elegir la cámara de donde se retira la fruta.
* **Tipo y Cantidad**: Especificar qué tipo y cuánta fruta se retira.

### Movimiento Interno

Opción para trasladar fruta de una cámara a otra.

* **Cámara de Origen** y **Cámara de Destino**: Campos para seleccionar.
* **Tipo y Cantidad**: Indicar qué se mueve.

### 5. Arquitectura Tecnológica

Esta sección define el stack tecnológico seleccionado para el desarrollo, despliegue y mantenimiento del Sistema de Gestión de Inventario.

* **Infraestructura como Código (IaC):**
    * **Contenedores:** Se utilizará **Docker** para la contenerización de las aplicaciones. El despliegue se realizará en un entorno **on-premise**, asegurando el control local sobre la infraestructura.
    * **Base de Datos:** La solución de base de datos será **Azure PostgreSQL Flexible Server**, una base de datos relacional administrada en la nube de Azure, seleccionada por su robustez, consistencia transaccional (ACID) y su adecuación para datos estructurados.

* **Frontend:**
    * La interfaz de usuario será una aplicación web moderna desarrollada con la librería **React**.
    * Se utilizará **Vite** como herramienta de construcción y servidor de desarrollo para garantizar un rendimiento óptimo y una experiencia de desarrollo ágil.

* **Backend:**
    * El servicio de backend será desarrollado en **Python**.
    * La API seguirá la especificación **OpenAPI (Swagger)** para estandarizar la documentación, facilitar la integración con el frontend y permitir la generación automática de clientes.















