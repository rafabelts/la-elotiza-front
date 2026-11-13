Design System — La Elotiza POS
Versión: 1.0 · Fecha: 12 de noviembre de 2026
Fuente: prototipo/prototipo-elotiza.dc.html
Alcance: sistema visual y patrones de interacción del punto de venta (POS).
Estado: documentación del prototipo existente, con propuestas de normalización identificadas explícitamente.

1. Identidad y principios
La Elotiza POS utiliza una interfaz clara, cálida y orientada a operaciones rápidas. Su lenguaje visual combina una base neutra tipo crema, superficies blancas, tipografía de alto contraste y acentos inspirados en maíz, elote y salsas.
Principios de diseño
1. Rapidez operativa: priorizar botones visibles, superficies amplias y acciones directas para el personal de caja y cocina.
2. Jerarquía clara: el nombre del cliente, los productos, el total y las acciones de confirmación deben distinguirse de inmediato.
3. Color con significado: utilizar colores cálidos para identificar categorías y señalar estados; reservar los botones oscuros para acciones de cierre o avance específico.
4. Baja carga cognitiva: mantener descripciones breves, mostrar opciones contextualmente y dividir las tareas complejas en modales enfocados.
5. Consistencia táctil: controles redondeados, estados seleccionados inequívocos y alturas adecuadas para interacción con mouse o pantalla táctil.
Personalidad visual: cálida, amigable, funcional, limpia y contemporánea. Evitar degradados extensos, ornamentos abundantes o jerarquías cromáticas que compitan con la operación.
2. Design tokens
2.1 Paleta principal
Los siguientes valores se encuentran en el HTML o en los estilos generados por su lógica.
Token recomendado	HEX	Uso en la interfaz
color.bg	#FAF9F6	Fondo global crema
color.surface	#FFFFFF	Paneles, tarjetas, modales, navegación activa
color.text.primary	#1A1A1A	Texto principal, acciones oscuras
color.text.secondary	#6B6862	Descripciones, etiquetas y metadatos
color.text.placeholder	#A19D95	Texto de ayuda dentro de inputs
color.border.default	#ECE9E3	Divisores y contornos discretos
color.accent.primary	#F08A00	Botón principal, foco, indicadores y selección
color.accent.hover	#D97C00	Hover de acciones principales
color.accent.deep	#A85A00	Links y mensajes destacados
color.accent.tint	#FFF4E5	Hover suave y fondos cálidos
color.surface.muted	#F3F1EC	Fondos de controles segmentados y chips neutros
color.surface.disabled	#F0EEE9	Acciones inhabilitadas y barras neutras
color.text.disabled	#8A867E	Texto deshabilitado
color.success	#3F6E12	Token --ok declarado en el prototipo; sin uso principal observado
color.danger	#B3261E	Diferencia de caja distinta de cero


Regla importante: sobre el naranja principal #F08A00 usar texto oscuro #1A1A1A, no blanco. Las acciones principales del prototipo siguen ese patrón.
2.2 Paletas por categoría del menú
Cada categoría dispone de fondo, borde, acento fuerte y texto de precio específicos.
Categoría	Fondo	Borde	Acento/selección	Texto de precio
Esquites	#FFF6D6	#F6E3A3	#F5B800	#6B4E00
Elotes	#FFEBC7	#F5D49A	#EBA53A	#7A4D00
Especiales	#FFEEDB	#F8D5AE	#F08A00	#8F4A00
Bebidas	#F4F0E9	#E3DCD0	#D9CFBF	#5C5548


Aplicación: usar la paleta de la categoría en la tarjeta de producto y en su filtro activo. No cambiar arbitrariamente el significado de los colores entre pantallas.
2.3 Colores complementarios que aparecen en la UI
HEX	Uso observado
#FFEEDB	Resumen de ventas, estados activos y confirmaciones
#FFEBC7	Resumen de efectivo esperado
#FFF6D6	Resumen de transferencias y estado «Preparando»
#FFF1DE	Estado «Cambios sin confirmar» y «Pendiente»
#8F4A00, #7A4D00, #6B4E00	Texto asociado a fondos de categoría
#9A5200	Advertencias suaves y pendientes
#4A4740	Estado neutro sobre fondo gris cálido
#D8D4CC, #E4E0D8	Bordes de tickets y comandas
#CFCBC3	Círculo de producto por preparar
#9A968E	Texto de producto completado
#333333	Hover de botón oscuro


2.4 Tipografía
Familia principal: Figtree, con fallback system-ui, sans-serif.

Importación tal como aparece en el prototipo:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">
Rol	Tamaño observado	Peso	Uso
Título de pantalla	24 px	800	Órdenes, Equipo, Corte
Título de modal	20–22 px	800	Personalizar producto, Cobrar, Confirmar
Nombre destacado	18–20 px	800	Cliente en órdenes y encabezado de orden
Métrica grande	28–30 px	800	Total, cambio y resumen de caja
Título de tarjeta	15–16 px	700	Producto, sección, nombre del empleado
Texto base de interfaz	14–15 px	400–600	Controles, importes, acciones
Texto auxiliar	13 px	400–600	Descripciones, etiquetas y ayuda
Badge / metadato	12–12.5 px	600–800	Estado, progreso y encabezados compactos


- Pesos disponibles: 400, 500, 600, 700, 800.
- Interlineado observado: ~1.2–1.55 según el tipo de contenido.
- Tracking: títulos -0.01em; totales y métricas -0.02em.
- Importes: utilizar font-variant-numeric: tabular-nums para alinear cantidades.
- Tickets, comandas y conceptos bancarios: ui-monospace, Menlo, monospace como tipografía secundaria.
2.5 Espaciado
El prototipo usa varios valores cercanos a una escala de 4 px, aunque no declara un sistema único. Escala propuesta para normalizar su implementación:
Token	Valor	Ejemplos
space.1	4 px	Separación de tabs
space.1_5	6 px	Texto y chips pequeños
space.2	8 px	Grupos de acciones
space.2_5	10 px	Elementos relacionados
space.3	12 px	Tarjetas de producto
space.3_5	14 px	Tarjetas de órdenes
space.4	16 px	Padding interior de tarjetas
space.5	20 px	Sidebar y formularios
space.6	24 px	Contenido y modales
space.7	28 px	Padding de páginas internas
space.10	40 px	Grandes separaciones / estados vacíos


Densidad recomendada: compacta pero cómoda; no reducir las áreas táctiles para ganar unos pocos píxeles.
2.6 Bordes, radios y elevación
Token	Valor	Aplicación
radius.control	999px	Botones, filtros, tabs, chips y avatar
radius.input	12px	Campos de texto e importes
radius.card	16px	Cards de productos, órdenes, métricas y formularios
radius.modal	20px	Superficie del diálogo
radius.ticket	14px	Contenedor de comanda/ticket
radius.ticket-name	8px	Nombre del cliente dentro del ticket
border.default	1px solid #ECE9E3	Tarjetas y campos
shadow.segment	0 1px 3px rgba(26,26,26,.1)	Opción activa en controles segmentados
shadow.modal	0 20px 50px rgba(26,26,26,.2)	Modales
shadow.toast	0 10px 30px rgba(26,26,26,.25)	Notificación flotante
overlay.modal	rgba(26,26,26,.4)	Oscurecimiento detrás de diálogos


2.7 Dimensiones de controles
Elemento	Altura / dimensiones observadas
Tab de navegación	Mínimo 40 px
Filtro de categoría	Mínimo 44 px
Chip seleccionable	Mínimo 44 px
Input de formulario	44–48 px aprox.
Botón secundario	44–52 px
Botón principal del panel de orden	Mínimo 56 px
Botón principal de pago	Mínimo 52 px
Control de cantidad en modal	44 × 44 px
Control de cantidad en carrito	36 × 36 px
Tecla de PIN	72 × 72 px
Logo del header	40 × 40 px
Logo de login	72 × 72 px


Propuesta: estandarizar objetivos táctiles de al menos 44 × 44 px en controles de uso frecuente, ampliando los botones de 36 px del carrito cuando el layout lo permita.
2.8 Tokens CSS listos para reutilizar
Este bloque normaliza variables encontradas dispersas entre :root, estilos inline y lógica JavaScript. Los nombres nuevos son una propuesta; los colores reflejan el archivo fuente.
:root {
  /* Tipografía */
  --font-sans: "Figtree", system-ui, sans-serif;
  --font-mono: ui-monospace, Menlo, monospace;

  /* Base */
  --color-bg: #FAF9F6;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #6B6862;
  --color-text-placeholder: #A19D95;
  --color-border: #ECE9E3;
  --color-surface-muted: #F3F1EC;
  --color-surface-disabled: #F0EEE9;
  --color-text-disabled: #8A867E;

  /* Marca y semánticos */
  --color-primary: #F08A00;
  --color-primary-hover: #D97C00;
  --color-primary-dark: #A85A00;
  --color-primary-tint: #FFF4E5;
  --color-success: #3F6E12;
  --color-danger: #B3261E;

  /* Categorías */
  --esquites-bg: #FFF6D6;
  --esquites-border: #F6E3A3;
  --esquites-accent: #F5B800;
  --esquites-ink: #6B4E00;

  --elotes-bg: #FFEBC7;
  --elotes-border: #F5D49A;
  --elotes-accent: #EBA53A;
  --elotes-ink: #7A4D00;

  --especiales-bg: #FFEEDB;
  --especiales-border: #F8D5AE;
  --especiales-accent: #F08A00;
  --especiales-ink: #8F4A00;

  --bebidas-bg: #F4F0E9;
  --bebidas-border: #E3DCD0;
  --bebidas-accent: #D9CFBF;
  --bebidas-ink: #5C5548;

  /* Tamaños y superficies */
  --radius-control: 999px;
  --radius-input: 12px;
  --radius-card: 16px;
  --radius-dialog: 20px;
  --shadow-segment: 0 1px 3px rgba(26, 26, 26, .1);
  --shadow-dialog: 0 20px 50px rgba(26, 26, 26, .2);
  --shadow-toast: 0 10px 30px rgba(26, 26, 26, .25);

  /* Escala sugerida */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
}
3. Arquitectura visual y layouts
3.1 Header global
- Fondo blanco, posición sticky y navegación principal en una cápsula gris cálida.
- Izquierda: logo circular de 40 px y marca La Elotiza en 16 px / peso 800.
- Centro: Tomar orden, Órdenes (con contador), Corte y Equipo (solo encargado).
- Derecha: indicador circular naranja de caja, nombre del cajero y acción Salir.
- Franja inferior horizontal de 4 px, dividida en tres colores: #F08A00, #EBA53A, #F5B800.
- La opción activa de navegación tiene superficie blanca, texto oscuro, sombra tenue y peso 700.
3.2 Pantalla «Tomar orden»
Estructura desktop observada:
┌──────────────────── Header global ────────────────────┐
│                                                       │
│   Catálogo flexible                Orden actual       │
│   ┌──────────────────────────┐    ┌─────────────────┐ │
│   │ Categorías               │    │ Folio + estado  │ │
│   │ Grid de productos        │    │ Cliente         │ │
│   │ (mín. 200 px/tarjeta)    │    │ Items de orden  │ │
│   │                          │    │ Total + acción  │ │
│   └──────────────────────────┘    └─────────────────┘ │
└───────────────────────────────────────────────────────┘
- Grid principal: minmax(0, 1fr) 380px.
- Área de menú: padding 24px 28px 40px.
- Tarjetas: repeat(auto-fill, minmax(200px, 1fr)) y gap: 12px.
- Sidebar de orden: ancho 380 px, fondo blanco, borde izquierdo y comportamiento sticky.
- La sidebar tiene encabezado fijo, lista de productos desplazable y total/acciones al final.
3.3 Pantalla «Órdenes»
- Contenedor centrado con max-width: 1240px, padding horizontal de 28 px.
- Título + filtros segmentados: En preparación, Entregadas, Canceladas, Todas.
- Grid de tarjetas: repeat(auto-fill, minmax(320px, 1fr)), separación de 14 px.
- Cada tarjeta reúne cliente, folio, hora, método de pago, estado, productos, barra de progreso y acciones.
3.4 Pantallas «Equipo» y «Corte de caja»
- Contenedores centrados con max-width: 1080px.
- Equipo: dos regiones principales, lista de personas + formulario de alta, minmax(300px, 1fr).
- Corte: tres tarjetas de métricas en grid flexible, seguidas de tabla de transferencias y panel de conteo de efectivo.
- Corte desktop: columnas minmax(0, 1fr) 340px.
3.5 Login y modales
- Login centrado con ancho máximo de 360 px y fondo crema.
- Modal de configuración: width: min(640px, 100%) y max-height: 88vh.
- Modal de cobro: width: min(560px, 100%).
- Modales de comanda y ticket: width: min(440px, 100%).
- Modal de cancelación: width: min(420px, 100%).
- Overlay oscuro al 40 %, diálogo blanco, radio 20 px y sombra elevada.
4. Biblioteca de componentes
4.1 Botones
Variante	Apariencia	Uso
Primary / Brand	Naranja #F08A00, texto #1A1A1A, cápsula	Confirmar orden, cobrar, agregar persona
Primary / Ink	Negro #1A1A1A, texto blanco, cápsula	Entregar orden, nueva orden, cerrar turno
Secondary / Outline	Blanco, borde #ECE9E3, texto oscuro	Imprimir, abrir cajón, opción auxiliar
Tertiary / Ghost	Transparente, texto secundario	Volver, editar, cancelar sin énfasis
Danger text (suave)	Transparente, texto #A85A00	Quitar producto, cancelar orden
Disabled	Fondo #F0EEE9, texto #8A867E	Acción que aún no cumple requisitos


Estados:
- Default: apariencia de su variante.
- Hover: naranja pasa a #D97C00; botón negro a #333333; outline enfatiza el borde en #1A1A1A.
- Active: en tarjetas de producto, transform: scale(.98).
- Focus visible: contorno de 2px solid #F08A00, separado 2 px del elemento.
- Disabled: cursor: not-allowed, apariencia desactivada y sin ejecutar la acción.
Regla: usar una acción principal por región decisional; no competir con varios botones naranjas de igual peso dentro del mismo bloque.
4.2 Navegación segmentada / tabs
- Contenedor tipo píldora: #F3F1EC, radio 999px, padding 4 px.
- Opción activa: superficie blanca, texto oscuro, peso 700 y sombra ligera.
- Opción inactiva: fondo transparente, texto #6B6862, peso 600.
- Usos: navegación global, filtros de órdenes, método de pago, rol de usuario.
- Estado activo expuesto mediante aria-current, aria-pressed o aria-checked, según corresponda.
4.3 Filtros de categoría
- Botón tipo píldora, altura mínima 44 px.
- Activo: se rellena con el color fuerte de su categoría.
- Inactivo: fondo transparente y texto secundario.
- Categorías: Esquites, Elotes, Especiales, Bebidas.
4.4 Tarjeta de producto (ProductCard)
Anatomía:
1. Nombre: 16px, peso 700.
2. Descripción: 13px, peso normal, máximo visual de dos líneas.
3. Precio: 15px, peso 800, color asociado a la categoría, alineado abajo.
Especificaciones observadas:
- Fondo y borde de la categoría.
- border-radius: 16px, padding 16px 16px 14px.
- Altura mínima 124px, layout vertical.
- Hover: borde oscuro; active: escala 0.98.
- La tarjeta completa es interactiva y abre el configurador.
- Para productos de varios tamaños, mostrar «desde $XX.XX».
4.5 Selección / chips (OptionChip)
- Altura mínima 44 px, padding horizontal 16 px y radio de cápsula.
- Inactivo: fondo blanco, borde neutro, texto oscuro.
- Seleccionado: fondo y borde oscuros, texto blanco.
- Deshabilitado: opacidad 0.4 y cursor no permitido.
- Uso en selección única o múltiple para tamaño, ramen, sabritas, extras y otras opciones.
- Indicar en el encabezado del grupo si es obligatorio y si tiene costo adicional.
4.6 Input y campo monetario
- Label de 13 px / peso 600, color secundario.
- Input en fondo #FAF9F6, texto oscuro, borde neutro, radio 12 px.
- Texto normal de 15 px; importes pueden utilizar 18–22 px y peso 700–800.
- Placeholder #A19D95.
- En el campo Nombre del cliente, borde naranja y texto de advertencia si la orden tiene productos y no se ha indicado el nombre.
- Para importes usar teclado decimal cuando corresponda (inputmode="decimal").
4.7 Contador de cantidad (QuantityStepper)
- Dos controles circulares con los símbolos «−» y «+».
- Variantes observadas: 36 px en carrito y 44 px en configurador.
- Número central con peso alto; en el modal se anuncia mediante aria-live="polite".
- La cantidad mínima del configurador es 1; en el carrito, decrementar desde 1 elimina el artículo.
4.8 Badges y chips de estado
- Formato cápsula, padding horizontal aproximado de 10–12 px.
- Tipografía de 12 px, peso 700–800.
- Los estados combinan texto + color; nunca depender solo del color.
Contexto	Estado	Visual observado
Orden actual	Nueva / Sin confirmar	Fondo neutro #F3F1EC, texto #4A4740
Orden actual	En cocina	Fondo #FFEEDB, texto #8F4A00
Orden actual	Cambios sin confirmar	Fondo #FFF1DE, texto #9A5200
Cocina	Preparando	Fondo #FFF6D6, texto #6B4E00
Cocina	Lista, llamar	Fondo naranja #F08A00, texto oscuro
Cocina	Entregada / Cancelada	Fondo neutro, texto gris oscuro; tarjeta atenuada
Transferencia / WhatsApp	Enviado	Fondo #F3F1EC, texto #4A4740
Transferencia / WhatsApp	Pendiente	Fondo #FFF1DE, texto #9A5200


4.9 Tarjeta de orden (OrderCard)
- Superficie blanca, borde fino neutro y radio de 16 px.
- Encabezado: nombre de cliente destacado (20 px), folio, hora, pago y estado.
- Items como filas interactivas con check circular de 26 px.
- Completados: marca de verificación, fondo naranja y título tachado/atenuado.
- Barra de progreso: altura 4 px, fondo #F0EEE9; progreso #F5B800 o naranja al completarse.
- Al estar lista, la tarjeta puede tener borde naranja.
- Entregadas y canceladas: opacidad 0.6; en canceladas se tacha el total.
- Acciones inferiores: marcar/desmarcar todo y entregar/reabrir.
4.10 Panel de orden actual (OrderSidebar)
Tres zonas:
1. Header: folio, estado, hora y nombre del cliente.
2. Contenido desplazable: lista de artículos, personalizaciones y controles.
3. Footer: cantidad total de productos, monto destacado y acción principal.
   - Monto en 28 px / peso 800 con números tabulares.
   - Vacío: mensaje centrado «Toca un producto para agregarlo.»
   - El botón principal cambia entre Confirmar orden, Confirmar cambios y Cobrar, según el estado de la orden.
   - La cancelación se presenta como acción secundaria separada.
4.11 Modal / diálogo (Dialog)
Estructura: overlay → contenedor blanco → título → contenido → acciones.

Variantes presentes:
- Configurador: grupos de chips, indicación especial, stepper y acción de guardar/agregar con precio.
- Comanda: confirmación del envío a cocina, vista previa monoespaciada, cobrar, imprimir o continuar editando.
- Cobro: monto, forma de pago segmentada, efectivo/transferencia y confirmación.
- Ticket: resumen de orden cobrada, vista previa del comprobante, nueva orden, ver órdenes e imprimir.
- Cancelación: título interrogativo, descripción de consecuencia y confirmación explícita.
Propuesta de accesibilidad para implementación final: gestionar foco dentro del diálogo, devolverlo al disparador al cerrar, admitir Escape cuando sea seguro y usar aria-labelledby para el título.
4.12 Toast / feedback breve
- Posicionado centrado en la zona inferior, a 24 px del borde.
- Fondo negro, texto blanco, padding 12px 20px, radio cápsula.
- Sombra 0 10px 30px rgba(26,26,26,.25).
- role="status" para anuncios no disruptivos.
- Duración de aproximadamente 2.6 s en la lógica actual.
- Casos: orden enviada, ticket registrado, persona agregada, cajón abierto.
4.13 Tarjetas de métricas y tablas
- Tarjetas de corte: fondo amarillo/naranja suave según métrica, radio 16 px, padding 18px 20px.
- Etiqueta 13 px / peso 700; cifra 30 px / peso 800; descripción 13 px.
- Tabla de transferencias: headers de 12 px, datos de 14 px, separadores neutros.
- Alinear los importes a la derecha y usar números tabulares.
- Los conceptos bancarios se presentan en monoespaciada.
4.14 Login con PIN
- Logo circular de 72 px, título de 22 px / peso 800.
- Selector de cajero como cápsulas y PIN representado mediante cuatro puntos.
- Teclado de tres columnas con teclas circulares de 72 px, gap de 12 px.
- PIN ingresado: punto naranja #F08A00; punto vacío: borde #D6D2CA.
- Error de PIN mostrado en texto legible, no exclusivamente por color.
- Nota: el prototipo muestra PINs de prueba; deben ocultarse completamente en una aplicación de producción.
4.15 Tickets y comandas
- Superficie interior crema, borde punteado #D8D4CC, radio 14 px y padding 20 px.
- Texto operativo monoespaciado; nombre del cliente destacado con Figtree.
- Agrupar artículos con separadores finos.
- Resaltar nombre del cliente, folio y total.
- Diferenciar claramente comanda de cocina (preparación) y ticket de venta (pago).
5. Interacción y comportamiento
5.1 Flujo principal de venta
Seleccionar categoría
       ↓
Seleccionar producto
       ↓
Configurar tamaño / extras / notas
       ↓
Agregar producto a la orden
       ↓
Capturar nombre del cliente
       ↓
Confirmar orden → Comanda a cocina
       ↓
Cobrar (efectivo o transferencia)
       ↓
Mostrar ticket → Nueva orden / Ver órdenes
- El configurador impide guardar si faltan opciones obligatorias.
- El botón de confirmación permanece deshabilitado si faltan productos o nombre de cliente.
- Los cambios posteriores a la confirmación requieren nueva confirmación.
- La cancelación utiliza un diálogo con consecuencias explícitas.
- Las órdenes pueden marcarse por artículo y entregarse tras estar pagadas, de acuerdo con la lógica del prototipo.
5.2 Reglas de microinteracción
- Hover: cambio de color o borde, sin animaciones excesivas.
- Click/press: escala discreta en tarjetas (scale(.98)).
- Transiciones observadas: borde ~150 ms, transformación ~100 ms y puntos PIN ~120 ms.
- Feedback inmediato: cambios en estado, badge, conteo, precio o toast.
- Información crítica visible: mostrar siempre nombre del cliente, total y estado de orden en el contexto adecuado.
5.3 Formato de contenido
- Idioma de producto: español (México).
- Precios: formato $1,234.00, con dos decimales. En el código se utiliza toLocaleString("es-MX").
- Folio: #0168 (prefijo # y cuatro dígitos en el prototipo).
- Información secundaria separada por punto medio: 12 oz · Sabrita: Takis · Extra: Tocino.
- Labels de acciones con verbos concretos: Confirmar orden, Cobrar, Imprimir ticket, Cerrar turno e imprimir.
- Para nombres de estados usar frases operativas: En cocina, Preparando, Lista, llamar, Entregada, Cancelada.
6. Accesibilidad
Ya presente en el HTML
- Estados y roles accesibles: aria-label, aria-current, aria-pressed, aria-checked, aria-invalid y role="status".
- Elementos de entrada asociados a sus etiquetas mediante for / id.
- Foco visible: borde de 2px solid #F08A00 con offset de 2 px.
- Validación del nombre de cliente con advertencia textual.
- Total y cambios con números tabulares.
Recomendaciones para producción
1. Contraste: mantener texto oscuro sobre el naranja principal; revisar placeholders y textos deshabilitados, que no ofrecen contraste de texto normal suficiente en todos los fondos.
2. Táctil: aumentar a 44 × 44 px las acciones de cantidad de 36 × 36 px del carrito cuando sean controles primarios para pantalla táctil.
3. Teclado: hacer navegables los controles de selección, modales y flujos de cobro sin mouse.
4. Modales: implementar trampa de foco, restauración del foco y anuncio correcto de título/estado.
5. No usar solo color: acompañar advertencias, selección y progreso con texto, estados accesibles o íconos comprensibles.
6. Estado deshabilitado: reflejarlo semánticamente con disabled, no solo cambiando la apariencia.
7. Mensajes: validar entradas y anunciar errores junto al campo correspondiente.
7. Responsive y adaptación
Lo que existe: grids fluidos con auto-fill y auto-fit, anchos máximos y modales con ancho limitado al viewport. Lo que no aparece explícito en el HTML proporcionado: un sistema de media queries o breakpoints para reorganizar el layout principal, el header y el panel de corte. No deben tratarse como especificaciones ya implementadas.

Propuesta de comportamiento responsive a validar:
Ancho aproximado	Comportamiento sugerido
≥ 1200px	Layout de dos columnas: catálogo + sidebar fija de 380 px
900–1199px	Mantener dos paneles si el ancho de tarjetas y acciones es suficiente; reducir paddings si es necesario
< 900px	Catálogo a una columna principal; orden actual como panel accesible mediante tab/botón o bloque debajo del catálogo
< 600px	Header compacto y navegación desplazable; tarjetas de producto de una o dos columnas según ancho útil; modales a casi todo el viewport


Estos rangos son recomendaciones, no breakpoints extraídos del archivo.
8. Convenciones para desarrollo
8.1 Naming de componentes sugerido
AppShell
├── AppHeader
│   ├── Brand
│   ├── MainNavigation
│   └── CashierSession
├── SaleScreen
│   ├── CategoryTabs
│   ├── ProductGrid
│   │   └── ProductCard
│   └── OrderSidebar
│       ├── OrderHeader
│       ├── OrderItem
│       └── OrderSummary
├── OrdersScreen
│   ├── OrderFilters
│   └── OrderCard
├── CashClosingScreen
│   ├── MetricCard
│   ├── TransferTable
│   └── CashCountPanel
├── TeamScreen
│   ├── TeamMemberRow
│   └── AddTeamMemberForm
└── Dialogs
    ├── ProductConfiguratorDialog
    ├── KitchenTicketDialog
    ├── PaymentDialog
    ├── SaleReceiptDialog
    └── CancelOrderDialog
8.2 Reglas de implementación
- Mantener tokens semánticos en CSS centralizado; evitar replicar los hexadecimales por cada componente.
- Crear variantes de botones y chips mediante propiedades (variant, size, selected, disabled) en vez de duplicar estilos.
- Definir los cuatro temas de categoría como objetos de tokens o variables CSS.
- Dar prioridad a estilos :focus-visible, estados accesibles y etiquetas antes que a animaciones.
- Separar la presentación visual del modelo de datos, precios, permisos y lógica de caja.
- No considerar los datos de prueba del HTML (usuarios, PIN, fechas, ventas) como parte del design system.
- Conservar dos familias tipográficas: Figtree para el producto y monoespaciada para comprobantes y conceptos de conciliación.
8.3 Ejemplo mínimo de estilos base
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 8px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--radius-control);
  font: 700 14px var(--font-sans);
  cursor: pointer;
}

.button--primary {
  border: 0;
  background: var(--color-primary);
  color: var(--color-text);
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

.button--primary:disabled {
  background: var(--color-surface-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}
9. Checklist de consistencia
- [ ] Fondo general crema #FAF9F6, superficies blancas.
- [ ] Todos los textos y botones usan Figtree, salvo tickets/conceptos monoespaciados.
- [ ] Botón naranja siempre con texto oscuro.
- [ ] Categorías conservan exactamente su paleta de cuatro colores.
- [ ] Cards usan radio de 16 px; modales 20 px; controles principales tipo cápsula.
- [ ] Los precios muestran dos decimales y usan cifras tabulares cuando se alinean.
- [ ] El foco de teclado permanece visible.
- [ ] Estados de órdenes se comunican por etiqueta y color.
- [ ] Formularios y modales muestran validaciones explicativas.
- [ ] Los botones de uso recurrente son cómodos para interacción táctil.
- [ ] La navegación y el panel de orden se comportan correctamente en pantallas pequeñas.
- [ ] Los datos mock y credenciales de prueba no aparecen en producción.

10. Límites de esta documentación
Esta especificación deriva del HTML proporcionado, incluyendo estilos en línea, variables CSS y estilos generados en JavaScript. El archivo también referencia una hoja de estilos externa (_ds/.../styles.css) que no forma parte del archivo adjunto; por eso no se documentan posibles reglas internas de ese recurso. Los tokens y patrones señalados como propuestos sirven para convertir el prototipo en un sistema de diseño mantenible y requieren validación de producto, accesibilidad y responsive.
