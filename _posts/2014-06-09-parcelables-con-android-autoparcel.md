---
author: raycoarana
comments: true
date: 2014-06-09 20:29:34+00:00
layout: post
link: http://raycoarana.com/desarrollo/parcelables-con-android-autoparcel/
slug: parcelables-con-android-autoparcel
title: Parcelables con Android AutoParcel
wordpress_id: 348
categories:
- Desarrollo
tags:
- activity
- android
- autoparcel
- autovalue
- fragment
- parcelable
---

Cuando vamos a crear una app en Android y tenemos que pasar datos entre **Activities** y/o **Fragments**, el sistema operativo nos brinda la posibilidad de usar un **Bundle**, ya sea a través del **Intent **(y el Bundle de extras) o a través del método _**setArguments()**_ de los Fragments. Esta es la manera idónea de pasar datos entre componentes, ya que **no crea acoplamientos poco deseables**, además estos se gestionan de manera automática por el sistema, por lo que no debemos preocuparnos de qué pasa con ellos si el sistema ha tenido que recrear el Activity o Fragment debido al ciclo de vida de la aplicación.

El problema viene con los tipos de datos que nos permite almacenar un Bundle, estos son tipos básicos u objetos que implementen la interfaz **Serializable** o **Parcelable**. A la hora de implementar una u otra interfaz, la primera es sencilla, con solo hacer que nuestra clase implemente la interfaz Serializable el sistema **por medio de reflexión es capaz de serializar el objeto a una representación binaria** que se puede persistir. En el caso de Parcelable, sin embargo, debemos implementar dos métodos para serializar -_writeToParcel()_- y deserializar -_constructor_- el objeto. Además debemos escribirlo con sumo cuidado y en perfecto orden inverso o no funcionará, algo muy **tedioso y difícil de mantener**.

<!-- more -->

[sh_margin margin="20"]


### ¿Porqué usar Parcelable sobre Serializable?


La principal razón para implementar Parcelable sobre Serializable es su velocidad de ejecución, se habla de hasta **10x más rápido** trabajar con objetos Parcelable. Si estamos en un entorno móvil, esto se traduce no solo en **mayor rapidez**, sino también en **menor consumo de batería**, algo que nunca debemos obviar a la hora de desarrollar apps.
Como decimos esta gran ventaja en cuanto a velocidad viene con un precio y es que la implementación y sobre todo el mantenimiento de este tipo de objetos es muy tediosa, siendo una tarea muy repetitiva y donde es muy fácil cometer errores.

[sh_margin margin="20"]


### Android AutoParcel al rescate


Para solucionar esto, existe una librería muy interesante, o más que librería deberíamos hablar de **plug-in para Gradle**, que en tiempo de compilación, es capaz de generar el código de serialización y deserialización de nuestros objetos. Al ser en tiempo de compilación, no penaliza en absoluto la ejecución y nos beneficiamos de no tener que lidiar con los tediosos métodos de la interfaz Parcelable. Esta se llama [Android AutoParcel](https://github.com/frankiesardo/auto-parcel) y es un port de la librería [Google AutoValue](https://github.com/google/auto/tree/master/value).

Vamos a ver cómo podemos integrar fácilmente este plug-in en nuestros proyectos y cómo usarlo. Lo primero será modificar el fichero raíz **build.gradle**, donde agregaremos en las dependencias la siguiente línea:

[code language="groovy"]
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:0.11.+'
        classpath 'com.neenbedankt.gradle.plugins:android-apt:+'
    }
}

allprojects {
    repositories {
        mavenCentral()
    }
}
[/code]

Ahora nos vamos al fichero **build.gradle** de la aplicación, lo primero será aplicar el plug-in **android-apt** y luego agregamos en la sección de dependencias del proyecto tanto el procesador que generará el código en tiempo de compilación como la librería con las anotaciones de AutoParcel.

[code language="groovy"]
apply plugin: 'android'
apply plugin: 'android-apt'

android {
    ...
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.github.frankiesardo:android-auto-value:+'
    apt 'com.github.frankiesardo:android-auto-value-processor:+'
}
[/code]

Ahora refrescamos el proyecto y vamos a escribir nuestro primer objeto con AutoParcel. Nuestras **clases tendrán que ser abstractas** y **por cada propiedad que queramos que tenga, debemos generar un método abstracto** para obtener su valor.

[code language="java"]
import android.auto.value.AutoValue;
import android.os.Parcelable;

@AutoValue
public abstract class Foo implements Parcelable {

   public abstract String fooString();
   public abstract int fooInteger();

}
[/code]

Solo nos falta una forma para poder construir objetos de tipo Foo, para ello agregamos un método estático con todos los valores e internamente y llamaremos en su interior al constructor del objeto que AutoParcel genera. El orden de los parámetros será el mismo con el que hemos escrito nuestra clase abstracta. Al momento de escribir este código muy probablemente la clase **AutoValue_Foo** aún no exista, debemos compilar para que el generador se ejecute y cree la clase.

[code language="java"]
import android.auto.value.AutoValue;
import android.os.Parcelable;

@AutoValue
public abstract class Foo implements Parcelable {

   public abstract String fooString();
   public abstract int fooInteger();

   public static final Foo create(String fooString, int fooInteger) {
      return new AutoValue_Foo(fooString, fooInteger);
   }

}
[/code]

Y con esto ya está todo, de esta forma tan simple podemos ahora generar objetos que utilizar como argumentos o extras para los _Fragments _y _Activities_ que usemos en nuestras aplicaciones, reduciendo la cantidad de código que tenemos que escribir considerablemente y sin caer en malas prácticas acoplando los componentes de nuestra aplicación.

[sh_margin margin="20"]


### Más info


Puedes obtener más info y acceder al código en su página en GitHub.

[github repo="frankiesardo/auto-parcel"]
