---
layout: post
slug: roborouter
title: RoboRouter, mi primera librería OpenSource
date: 2014-11-03 22:17:07+00:00
tags:
  - activity
  - android
  - launcher
  - roborouter
  - startup
  - development
subclass: 'post tag-content'
categories: 
  - raycoarana
navigation: True
---

Hace tiempo que no escribo nada en el Blog, pero hoy tengo el orgullo de presentar mi primera librería _OpenSource_: RoboRouter. Es para Android y disponible a través de **Maven/Gradle**.
<!--more-->

### ¿Qué es RoboRouter?
RoboRouter es un pequeña librería _-de apenas dos clases-_ que permite mediante la activación/desactivación de componentes **manejar el punto de arranque de nuestra aplicación** cuando esta tiene una pantalla de inicio de sesión y/o un asistente de bienvenida o tutorial inicial. Cosas que es muestran escasamente una vez en la vida de la aplicación en el móvil de un usuario y que no debería _ensuciar_ el código de la actividad principal con la que arrancamos la aplicación normalmente. RoboRouter permite gestionar este tipo de escenarios de una forma **muy fácil y sin apenas escribir código**.

Pasaos por [GitHub](https://github.com/raycoarana/roborouter) y mirad como funciona, descargad el proyecto de ejemplo y jugad con él. Cualquier sugerencia será bienvenida.

{% github raycoarana/roborouter %}
