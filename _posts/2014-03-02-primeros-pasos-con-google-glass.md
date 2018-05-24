---
layout: post
slug: primeros-pasos-con-google-glass
title: Primeros pasos con Google Glass (I)
date: 2014-03-02 19:24:59+00:00
tags:
  - android
  - gdk
  - glassware
  - google glass
  - timeline
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

En esta serie de artículos, del que este es el primero, vamos a aprender a crear aplicaciones para Google Glass y esas legiones de _Explorers_ que hay ahí fuera. Aunque tiene un precio aún prohibitivo y su disponibilidad es muy limitada (solo para residentes en EEUU y bajo invitación), está llamado a ser el gadget del futuro y rivalizar muy de tú a tú con otros gadgets que giran entorno a los Smartphones. Dispositivos que se conectan a nuestro Smartphone y lo complementan, permitiendo realizar ciertas acciones sin tener que sacarlo de nuestro bolsillo, como las pulseras, los relojes, etc.

<!--more-->

Pero antes de empezar a hablar de cómo podemos crear Glassware (que es como se denominan estas apps), vamos a echar un vistazo a las características del hardware y del software:

### Características técnicas
	
  * CPU OMAP 4430 SoC 1.2Ghz Dual
  * 1 GB RAM	
  * Pantalla de 640x360 pixels (hdpi)
  * Sistema operativo Android 4.0.4 (API 15)
  * Cámara de 5 MP con capacidad de grabación de video a 720p
  * TouchPad
  * GPS y SMS a tráves de conexión con smartphone
  * Bluetooth
  * WiFi 802.11b/g
  * 16 GB de almacenamiento (12 GB libres para el usuario)
  * Giroscopio, acelerómetro, magnetómetro, sensor de luz ambiental y sensor de proximidad
  * Micrófono y transductor de conducción ósea que actúa como altavoz
  * Conector MicroUSB, tanto para conexión con el PC como para salida de auriculares

### ¿Cómo se maneja?

El manejo de Google Glass se realiza con una combinación entre voz, gestos con la cabeza e interacción con el TouchPad. Desde encenderlas moviendo la cabeza hacia arriba (o tocando el TouchPad) se puede interactuar con el ya famoso **Ok glass...** o interactuando con el TouchPad con Swipe hacia adelante/atrás, toques y Swipe abajo que hace las veces de botón atrás. Adicionalmente y a discreción de la aplicación que tengamos abierta, esta puede hacer uso de otro tipo de gestos en el TouchPad, como veremos en próximos artículos.

### Google Glass es un dispositivo Android más

Como hemos comentado anteriormente, las Google Glass tienen como sistema operativo un Android 4.0.4, una revisión de Android 4.0.3 en el que se mantiene su nivel de API (API 15). Por lo tanto, el modelo de programación es exactamente el mismo y la API es exactamente la misma a la de cualquier aplicación Android, salvo unas pequeñas excepciones a tener en cuenta y que iremos comentando poco a poco.

El entorno de desarrollo a utilizar para desarrollar Glassware será Eclipse con el plug-in ADT o Android Studio, igual que para una aplicación Android para Smartphones o Tablets. Lo que deberemos tener en cuenta a la hora de crear un proyecto para Google Glass es que la API a la que nos dirigimos es la 15.

### El Timeline, un launcher propio

![Representación del Timeline](/assets/images/timeline.png) Representación del Timeline

Cuando un usuario inicia o activa su Google Glass, verá en primer lugar lo que se llama el Timeline. Este Timeline no es más que un launcher propio, desde el que se lanzan las aplicaciones y en el que se pueden visualizar notificaciones y widgets, que en el caso de Google Glass reciben el nombre de tarjetas o Cards. Estas son siempre a pantalla completa. Luego el Timeline es un conjunto de estas tarjetas, colocadas de forma longitudinal y sobre las que el usuario se puede mover usando el TouchPad. Es por ello que las tarjetas tienen acceso restringido al TouchPad, para evitar entrar en conflicto con los gestos de Swipe adelante/atrás.

![Pantalla inicial de Google Glass](/assets/images/ok-glass-e1393787954995.png) Pantalla inicial de Google Glass

La tarjeta principal, aquella que muestra la hora y el texto "ok glass" es la que nos permite lanzar aplicaciones. Y aquí es donde nos encontramos una de las principales diferencias entre una aplicación Android _normal_ y una aplicación para Google Glass. El inicio de una aplicación no se marca con **android.intent.action.MAIN**, sino que nuestra aplicación debe responder a la intención **com.google.android.glass.action.VOICE_TRIGGER**. Además de esta intención, debemos indicar en forma de meta-datos, una frase. Esta será la frase que el usuario diga tras decir "ok glass" y que hará que se abra nuestra aplicación. En principio esta frase es la que nosotros queramos, tenemos una guía a seguir con una serie de [reglas en la estructura y forma](https://developers.google.com/glass/distribute/voice-checklist) de la misma. Pero si pretendemos que Google nos publique la aplicación en MyGlass, debemos ceñirnos al uso de [una lista de frases](https://developers.google.com/glass/develop/gdk/input/voice#existing_voice_commands). Si queremos utilizar otra frase, debemos antes enviarla para su aprobación. Si más de una aplicación está _suscrita_ a una misma frase, el Timeline le dará la opción al usuario de elegir cual de ellas quiere lanzar, de forma similar a como ocurre  actualmente en las aplicaciones para Smartphones y Tablets cuando dos aplicaciones responden a una misma intención.

Para el manejo del Timeline y poder crear y agregar nuestras propias tarjetas, será necesario utilizar una API que está fuera del SDK normal de Android, el llamado GDK (Glass Development Kit). Esto es una librería **jar** con un stub de clases necesarias para poder compilar nuestro proyecto. En ella se incluye esta API para el manejo del Timeline, así como algunas otras clases de ayuda y controles para manejar y crear interfaces apropiadas para el dispositivo. Ya exploraremos estas clases con más detenimiento en próximos artículos.

### Continuará...

En el próximo artículo crearemos nuestra primera aplicación para Google Glass. Exploraremos los pequeños ajustes que debemos hacer en un proyecto Android por defecto para hacerlo compatible y cómo incorporar el GDK.
