---
layout: post
slug: antipatrones-de-navegacion-en-android
title: 10 antipatrones de navegación en Android
date: 2014-03-02 12:00:38+00:00
tags:
  - android
  - diseño
  - patrones
  - smartphone
  - UX
subclass: 'post tag-test tag-content'
categories:
  - raycoarana
navigation: True
---

Los chicos de Android Design in Action han publicado un video en YouTube donde nos describen algunos antipatrones de navegación que se han encontrado en algunas apps de las que analizan regularmente. Es un video muy interesante y casi obligatorio ver para no caer en malos patrones a la hora de crear aplicaciones. Si bien ver el video está bien, os lo resumo de forma rápida por si no tenéis 26 min libres para verlo.
<!--more-->

#### 1. Navegación en el menú flotante del ActionBar

![Navegación en el menú flotante del ActionBar](/assets/images/NavigationInOverflow.png) Navegación en el menú flotante del ActionBar

El primer antipatrón es el que utiliza el panel flotante del ActionBar como elemento de navegación por la aplicación. Esto es un mal patrón ya que el ActionBar, como su propio nombre indica, es una **barra de acciones** y ahí han de residir los elementos con los que el usuario pueda realizar acciones sobre el contenido que se muestra. Peor aún es que las acciones que no se muestran y se dejan en el menú flotante, se consideran acciones secundarias, que el usuario utiliza con poca frecuencia, por lo que si seguimos este antipatrón, estamos dejando el elemento más importante de nuestra aplicación (la navegación por ella) relegada al lugar donde el usuario menos se lo espera.

Como elementos de navegación debemos usar otros patrones, bien explicados en la [web oficial de android](http://developer.android.com/design) y utilizar el Navigation Drawer o pestañas.

#### 2. Mala utilización de los elementos de navegación

![Mala utilización de los elementos de navegación](/assets/images/WrongNavHierarchy.png) Mala utilización de los elementos de navegación

El segundo antipatrón del que nos hablan es la mala organización de los elementos de navegación. Destacando los tres elementos de navegación básicos en una aplicación, el Navigation Drawer, un Spinner en el ActionBar y el uso de pestañas. El orden en el que estos elementos deben marcar la jerarquía de la información también nos viene definido de forma clara. 

El principal elemento de navegación de nuestra aplicación debe ser el Navigation Drawer, en segundo lugar el Spinner del ActionBar y en tercer lugar las pestañas. Esto queda natural, ya que la forma en que miramos una pantalla siempre es de izquierda a derecha y de arriba a abajo. Siguiendo este camino, lo primero que nos encontraremos será el icono que nos indica que existe un Navigation Drawer. Si el usuario lo despliega, el ActionBar cambia (o debería!) y deja de mostrar las acciones o título del contenido actual para mostrar el título de nuestra aplicación y acciones globales a esta. En segundo lugar veremos el Spinner del ActionBar y por último veremos las pestañas como elemento más anidado.

#### 3. Pestañas sin Swipe

![Pestañas sin Swipe](/assets/images/TabsThatDontSwipe.png) Pestañas sin Swipe

Un clásico que a buen seguro os habréis encontrado alguna vez, ya sea como usuario o como desarrollador es la inclusión de contenido con scroll horizontal dentro de una pestaña, que por norma debe permitir el gesto de Swipe para cambiar entre ellas. Al incluir contenido con scroll horizontal, lo que provocamos es que entre en conflicto un gesto con otro, haciendo que a veces se detecte como Swipe y cambie de pestaña o a veces se detecte como scroll horizontal, haciéndole la vida imposible al usuario de nuestra app. Un ejemplo claro de esto nos puede ocurrir si añadimos un mapa como contenido de una pestaña, si queríamos fastidiar al usuario, ¡sin duda lo hemos conseguido!

Debemos evitar siempre tener contenido con scroll horizontal dentro de las pestañas y permitir siempre hacer el gesto de Swipe entre ellas (utiliza el ViewPager para ello). Y aunque lo encuentres en StackOverflow, NUNCA, NUNCA, NUNCA se te ocurra deshabilitar el Swipe como solución a este problema. Busca otra forma de organizar la navegación de tu app.

#### 4. Pestañas con jerarquía

![Pestañas con jerarquía](/assets/images/DeepOrPersistentTabs.png) Pestañas con jerarquía

Este es sin duda otro clásico que azota a nosotros pobres usuarios de Android a manos de desarrolladores venidos del mundo iOS. En Android las pestañas no deben ser elementos persistentes en la interfaz y no se deben tener jerarquía dentro de ellas. Cuando el usuario pulsa sobre algún elemento de la interfaz dentro de la pestaña, se debe hacer una navegación a una pantalla completamente nueva. Esto también es lo más sencillo de implementar, ya que no tendremos que guardar estados en las pestañas para almacenar esa navegación cuando el usuario cambia de contenido haciendo Swipe. Y también responde a una forma predecible de utilización, ya que no cabe a interpretación preguntas como:
	
  * ¿Qué pasa al darle atrás?	
  * ¿Y al cambiar de pestaña, se mantiene la anterior o se vuelve a la inicial?
  * ¿Sabe el usuario que ha hecho una navegación dentro de una pestaña y debe darle atrás para volver?, porque si le da atrás en otra pestaña que esté en la principal se saldrá de la actividad, ¿o no? 

Estos son los problemas que causamos al caer en este antipatrón, muchas dudas y posibles interpretaciones acerca de como debería funcionar la interfaz, creando confusión en el usuario.

#### 5. Cambio de pestaña con el botón atrás

![Cambio de pestaña con el botón atrás](/assets/images/BackTraversesTabs.png) Cambio de pestaña con el botón atrás

Continuando con el mal uso de las pestañas, otro mal uso de ellas es guardar el cambio entre ellas e incluirlas en el historial del botón atrás. Las pestañas en Android son elementos superficiales de la interfaz, el cambio entre ellas no supone ningún cambio en el estado de la aplicación. Al poder cambiar entre ellas con un simple Swipe, el número de cambios que el usuario puede hacer entre ellas es muy numeroso y vamos a obligarle a pasar por cada una de ellas tantas veces como cambios haya realizado.

#### 6. Cambio en el menú de navegación con el botón atrás

![Cambio en el menú de navegación con el botón atrás](/assets/images/BackTraversesDrawer1.png) Cambio en el menú de navegación con el botón atrás

Similar al anterior, se puede pretender guardar la navegación que el usuario realiza desde el menú de navegación, pero esto es un error. Cada vez que el usuario hace una navegación desde el NavigationDrawer, se debe limpiar el historial de navegación, ya que estamos haciendo un cambio de contexto en la aplicación, nos vamos a otra sección. Este cambio implica que el usuario va a realizar otra cosa diferente con la aplicación y no espera volver a la anterior. 

La única excepción a esta regla es si queremos evitar que el usuario cierre la aplicación por accidente. Podemos mantener la actividad inicial de nuestra aplicación como raíz de la navegación y que cuando el usuario pulse atrás, este vuelva a la pantalla principal.

#### 7. Navegación dentro de menú de navegación

![Navegación dentro de menú de navegación](/assets/images/DeepNavigationDrawers.png) Navegación dentro de menú de navegación

Rizando el rizo, si tu aplicación es muy compleja podrías llegar a tener subsecciones. Existen diferentes formas de hacer llegar al usuario a estas subsecciones y una de ellas es incluirlas en el menú de navegación. El problema es incluir navegación dentro del menú de navegación, una vez más agregamos cierto grado de entropía a la interfaz, ya que caben diferentes estados y posibilidades al interactuar con ella. Si se cierra y se vuelve a abrir el menú de navegación, ¿se mantiene en la subsección? ¿vuelve al principal?

Lo recomendado en este caso es hacer uso de un _Accordion_ que permitan colapsar las subsecciones, siempre que sea esta la forma de navegación que quieras, existen alternativas que dependen de la semántica de tu app.

#### 8. Elementos del menú de navegación que no son raíz

![Elementos del menú de navegación que no son raíz](/assets/images/BadDrawerTransitions.png) Elementos del menú de navegación que no son raíz

Como comentamos anteriormente, los elementos del menú de navegación son siempre raíces y por tanto todos deben mostrar el botón para desplegar el menú de navegación y nunca el botón Arriba. De la misma forma, se debe evitar el que se muestre la animación por defecto de nueva actividad y mostrar directamente el contenido. Así enfatizamos el hecho de que esa navegación no tiene historial, no estamos poniendo una nueva pantalla encima, sino que estamos cambiando una por otra.

#### 9. No mostrar el botón Arriba

![No mostrar el botón Arriba](/assets/images/NeverShowingUpCaret.png) No mostrar el botón Arriba

Este caso es justo el opuesto al anterior, si como anteriormente hemos comentado toda pantalla que se muestre desde el menú de navegación debe mostrar el botón para desplegar este, toda pantalla a la que no se llegue desde el menú de navegación no debe mostrar el botón para mostrarlo. En este caso siempre debe mostrar el botón de arriba. Dejando la opción a abrir el menú de navegación con el gesto de Swipe desde el borde para aquellos usuarios que lo descubran.

#### 10. Menú de navegación en la derecha

![Menú de navegación en la derecha](/assets/images/RightSideNavigation.png) Menú de navegación en la derecha

Y el último de los 10 antipatrones de navegación se trata de posicionar el menú de navegación (o la vista maestra de una relación maestro-detalle) en la parte derecha. Estas siempre deben estar en la izquierda, haciendo la navegación de izquierda a derecha. Con esto se enfatiza más en la jerarquía del contenido.

#### ¿Solo hay 10 antipatrones?

Si bien muchos de estos antipatrones son conocidos por cualquiera que se haya empapado de las guías de diseño disponible en la página de desarrolladores de Android, algunos de los detalles comentados en este video son muy interesantes y ponen matices muy buenos a la hora de llevarlos a nuestras apps de forma correcta.

Aunque solo comentan 10, a buen seguro que por ahí habrá muchos más, en próximas entradas veremos algunos ejemplos de aplicaciones que hacen uso de estos malos patrones y cómo quedarían si se aplicasen bien, así como otros no comentados.

¿Conoces algún antipatrón más? ¿No estás de acuerdo con algo? ¡Deja tus comentarios!
