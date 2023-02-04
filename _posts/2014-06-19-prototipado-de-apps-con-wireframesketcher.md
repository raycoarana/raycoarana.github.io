---
layout: post
slug: prototipado-de-apps-con-wireframesketcher
title: Prototipado de apps con WireframeSketcher
date: 2014-06-19 08:59:16+00:00
cover: 'assets/images/wireframesketcher.png'
tags:
  - android
  - assets
  - prototipado
  - wireframe
  - wireframesketcher
  - design
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

Aunque este es un blog fundamentalmente de desarrollo, hoy quería comentar un poco algo que nos toca siempre al comenzar una aplicación: la conceptualización. En el desarrollo móvil no es ningún secreto que tenemos **el problema del tamaño de la pantalla** -a pesar de los pseudo tablets que tenemos ahora por teléfonos-. A la hora de conceptualizar la aplicación, es fundamental utilizar una **herramienta que nos permita de forma rápida poder organizar la información** y cómo se comportará nuestra app.

Desde hace un tiempo he estado buscando la mejor herramienta para esta labor. Algo fundamental que debe tener una herramienta de este tipo es que **respete las proporciones de los componentes nativos** de la plataforma. Sin esto, conceptualizar una pantalla es un disparate, ya que estamos organizando la información en base a una premisa que puede ser falsa y a la hora de llevarla a la práctica, podemos ver que las cosas no nos caben -o nos sobra espacio-. En esta búsqueda me he topado con **WireframeSketcher**, una herramienta la mar de interesante, basada en Eclipse y con todos los elementos nativos de Android 4.X -también tiene los de iOS y Windows Phone entre otros-. Vamos a ver las principales características de esta herramienta.

<!--more-->

### Proyectos y pantallas
En WireframeSketcher, como podemos imaginar al estar basado en Eclipse, tenemos un workspace en el que trabajamos y creamos nuestros proyectos. Un proyecto no será más que una serie de _screens_ y _assets_.

![new_project](/assets/images/new_project.png)

En esta carpeta de _assets_, se agregarán inicialmente todos los iconos y componentes nativos del sistema. Por ejemplo, si usamos Android como base para nuestro proyecto, nos agregará todos los componentes e iconos de Android. También, como podemos ver en la siguiente imagen, nos agrega una primera pantalla con la que podemos trabajar.

![project-structure](/assets/images/project-structure.png)

### Elementos de pantalla
Si vemos la parte derecha del espacio de trabajo, veremos que tenemos la paleta de componentes que podemos utilizar para crear nuestros wireframes. Estos están basados en una librería básica -que tienen todos los proyectos- y una librería de componentes incluidos en nuestro proyecto. Y digo incluidos en nuestro proyecto porque podemos crear nuestros propios componentes incluso crear proyectos que sirvan como librerías de componentes que podemos referenciar desde otros. Como veis una herramienta muy potente en este sentido.

![assets_library](/assets/images/assets_library.png)

Los componentes con los que podemos trabajar son prácticamente todos los controles con los que contamos de forma nativa en Android. _ActionBar, CAB, Navigation Drawer, TextView, EditText, Button_, etc. Con unos pocos clicks de ratón, montamos una interfaz Android 4.X pura, de componentes nativos y proporciones correctas. Para editar estos componentes, basta con hacer doble-click sobre ellos para entrar en su jerarquía y poder así editar los elementos internos para cambiar imágenes, textos, color, tamaños de texto, etc.

![example_screen](/assets/images/example_screen.png)

### Iconos
Una cosa bastante reseñable y que le da un toque de calidad a nuestros wireframes es la posibilidad de utilizar el paquete de iconos nativos para poner elementos de menú, icono de la app o cualquier otra imagen.
Además de los iconos nativos, tenemos también otros paquetes de iconos -además de los que podemos añadir nosotros a nuestro proyecto por supuesto-, como la famosa fuente **awesome** entre otros paquetes que podemos descargarnos desde su web.

![icons_android](/assets/images/icons_android.png)

Si queremos añadir imágenes o iconos a nuestro proyecto, podemos agregarlos a la carpeta **assets/icons**, en formato SVG.

### Navegación
La navegación es otra cosa que podemos dejar indicada en nuestros proyectos, lo cual nos servirá para movernos a través de las pantallas mientras las desarrollamos, así como servir de enlaces cuando hagamos una exportación como veremos más adelante. Para añadir un enlace a alguno de los elementos, basta con seleccionar el elemento en el que queremos crear el enlace. Acto seguido, en el panel de la izquierda, donde tenemos las propiedades del elemento, cambiamos a la pestaña Links y desde ahí, seleccionamos la pantalla destino del enlace.

![links](/assets/images/links.png)

Podemos ver cómo queda el mapa de navegación por nuestra app creando un _Storyboard_. Este tipo de fichero nos permite agregar pantallas de nuestro proyecto las cuales podemos luego exportar como un HTML con enlaces entre ellas.

### Exportación a HTML, PDF y PNG
Ya por último en este repaso a las principales funciones que nos presta WireframeSketcher, nos queda exportar nuestro proyecto para que otras personas puedan interactuar con ellas y hacerse una idea de cómo ha de ser la aplicación.

La primera forma que tenemos es HTML, como hemos comentado anteriormente, **podremos exportar un Storyboard a HTML**, teniendo así un subconjunto de pantallas navegables a través del navegador, algo que podemos entregar a un cliente para que valide que es así como se debe organizar la aplicación.

Otras formas más estáticas de exportar nuestro trabajo es usando ficheros PDF y/o imágenes en formato PNG.

### Conclusiones
Después de experimentar distintas herramientas disponibles en el mercado, WireframeSketcher es para mí una de las mejores, por $99 tenemos una herramienta extensible y muy fiel al diseño final. Su uso es bastante sencillo y nos da la opción a exportar a HTML, algo ideal para enviar a clientes o compañeros. Como está integrado con Eclipse y como se puede instalar como plug-in también, nos permite integrar la herramienta en nuestro entorno habitual de trabajo -bueno si no estamos usando Android Studio- lo que nos permite la integración con otros plug-ins como control de versiones, pudiendo así colaborar y tener un historial de todo el trabajo realizado.

Más info y descarga: [https://wireframesketcher.com/](https://wireframesketcher.com/)
