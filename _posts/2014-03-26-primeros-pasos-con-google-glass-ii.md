---
layout: post
slug: primeros-pasos-con-google-glass-ii
title: Primeros pasos con Google Glass (II)
date: 2014-03-26 07:42:01+00:00
tags:
  - android
  - android studio
  - gdk
  - glassware
  - google glass
  - voice trigger
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

Siguiendo la serie de artículos de primeros pasos Google Glass, toca empezar a ponernos manos a la obra con nuestra primera aplicación. En el último artículo sobre Google Glass, dimos un vistazo general de sus características técnicas y de uso, que nos sirve para tener idea de que se puede y que no se puede hacer con ellas. Si bien hay que tener en cuenta que estamos ante un producto que está aún en una fase temprana de desarrollo y que muchas cosas cambiarán hasta que su salida a la venta al público general.

<!--more-->

Si no lo has leído, te recomiendo que hagas un repaso rápido al artículo antes de seguir con este, ya que te aclarará aspectos básicos de Google Glass.

### Configurando el entorno de desarrollo

El primer paso necesario para desarrollar para Google Glass será hacernos con el **GDK (Glass Development Kit)**, actualmente se encuentra disponible la versión **Sneak Peak**, que nos da indicaciones de que es en **una versión muy inmadura** y todo puede cambiar de una actualización a otra sin previo aviso.

Para instalar el GDK, nos vamos a Android Studio (actualmente versión 0.5.2), y abrimos el SDK Manager. Como comentamos en el artículo anterior, Google Glass funciona con Android 4.0.3, por lo que el GDK lo veremos bajo grupo **Android 4.0.3 (API 15)**, ahí encontraremos el Glass Development Kit Sneak Peek listo para instalar.

![Instalando GDK](/assets/images/1.InstalandoGDK.png) Instalando GDK

Una vez instalado el GDK, ya podemos comenzar el desarrollo de nuestra primera aplicación. Antes os debo dar una mala noticia, a día de hoy **no existe un emulador de Google Glass**, así que no busquéis una imagen del sistema para Google Glass. A día de hoy la única forma de probar una aplicación Google Glass **es tener una físicamente** sobre la que instalar y depurar las mismas.

### Creación del proyecto

Vamos a crear nuestra primera aplicación, para ello iniciamos el asistente de nuevo proyecto en nuestro Android Studio y lo configuramos como podéis ver en la siguiente imagen. Básicamente dado que Google Glass a día de hoy funciona solo con Android 4.0.3, pondremos este nivel de API como **_Minimum required SDK_** y **_Target SDK_**. Así tendremos la seguridad de no utilizar API que no tengamos disponible. Si en un futuro como ya se comienza a rumorear se actualiza Glass a una versión de Android más nueva, sería conveniente cambiar el **_Target SDK_** a la nueva versión.
Por último, vamos a poner en **_Compile with_** no la API 15, sino el **Glass Development Kit Sneak Peak (Google Inc.) (API 15)**. Os recomiendo desmarcar la opción de crear una primera actividad, a mi siempre me gusta **partir de un proyecto vacío** y crear, más que partir de un proyecto lleno de código demo y tener que estar haciendo limpieza.

![Creando el proyecto](/assets/images/2.CreandoElProyecto.png) Creando el proyecto

### Retocando el build.gradle

Una vez Android Studio termina de generarnos el proyecto, lo cierto es que al menos hasta la versión 0.5.2, tiene un bug por el que no genera bien el _app/build.gradle_. La opción de configuración que hemos puesto en el asistente como **_Compile with_** no la pone en el fichero de gradle. Para solucionarlo, lo abrimos y lo modificamos para que _**compileSdkVersion**_ apunte al GDK quedando así:

```groovy
apply plugin: 'android'

android {
    compileSdkVersion "Google Inc.:Glass Development Kit Sneak Peek:15"
    buildToolsVersion "19.0.2"

    defaultConfig {
        minSdkVersion 15
        targetSdkVersion 15
...
```

### AndroidManifest y estilos

El siguiente paso que debemos hacer será modificar el **_AndroidManifest.xml_** para requerir el GDK. Esto es opcional, si no lo requerimos no pasa nada, pero hay que tener en cuenta que entonces nuestra aplicación **se podría instalar en otros dispositivos** y al no tener estos la API del GDK, **fallará** al no encontrarlas.

Necesitamos agregar el siguiente trozo de código dentro de la etiqueta _**application**_:

```xml
<uses-library
    android:name="com.google.android.glass"
    android:required="true" />
```

Para terminar de configurar el proyecto antes de comenzar a escribir código de verdad, tendremos que modificar el fichero **_res/values/styles.xml_**, para cambiar el tema base que usará nuestra aplicación. Si dejamos el que pone Android Studio, **nos aparecerá en nuestra aplicación Google Glass el Action Bar**, cosa nada deseable. Debemos configurar el tema para que herede del tema que trae el sistema por defecto, quedando nuestro fichero **_styles.xml_** de la siguiente forma:

```xml
<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="@android:style/Theme.DeviceDefault">
        <!-- Customize your theme here. -->
    </style>

</resources>
```

Y para hacer algo de limpieza en el proyecto, os recomiendo borrar las carpetas _drawable-mdpi_, _drawable-xhdpi_, _drawable-xxhdpi_, ya que Google Glass utiliza una resolución hdpi y en el estado actual veo poco recomendable dedicar tiempo a generar los recursos gráficos para todas esas densidades de píxel cuando en la actualidad solo se utiliza una.

### Helloworld from Glass!

Ya tenemos nuestro proyecto listo para comenzar a desarrollar, los pasos anteriores hasta que mejore el soporte de Android Studio para el desarrollo de Glassware, serán el pan de cada día. A partir de ahora, vamos a generar una simple actividad, que muestre un mensaje en pantalla y configuraremos nuestra aplicación para que el usuario pueda lanzarla con un comando de voz.

Creamos una nueva clase llamada **_HelloWorldActivity_**, haciendo que extienda de **_Activity_**. Y como siempre en cualquier aplicación Android, sobrescribimos el método _**onCreate()**_ y establecemos el layout para nuestra actividad.

```java
import android.app.Activity;
import android.os.Bundle;

public class HelloWorldActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_helloworld);
    }
}
```

A continuación, ya sea con el acceso directo (Alt + Enter con el cursor sobre layout) o directamente creando el layout en la carpeta **_res/layout/activity_helloworld.xml_**, generamos nuestra vista. En ella utilizaremos un simple TextView de la siguiente forma:

```xml
<?xml version="1.0" encoding="utf-8"?>

<TextView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:text="HelloWorld!"/>
```

Ahora que ya tenemos nuestra actividad, vamos a crear el lanzador por comando de voz. Para ello tenemos que **crear un Voice Trigger**. Un Voice Trigger es un pequeño fichero XML en el que indicamos a Android el **comando de voz** que queremos que lance nuestra aplicación. Para ello, crear un fichero en **_res/xml/trigger.xml_**. En él, pondremos el siguiente código:

```xml
<?xml version="1.0" encoding="utf-8"?>

<trigger keyword="@string/glass_voice_trigger"/>
```

Muy simple, solo estamos indicando cuál es la frase que lanza nuestra aplicación. Vamos ahora a nuestro fichero _**res/values/string.xml**_ y creamos la cadena **_glass_voice_trigger_** con el valor _say hello_.

```xml
<resources>

...

    <string name="glass_voice_trigger">say hello</string>

...

</resources>
```

Pero, ¿cómo relaciona Glass el comando de voz con la actividad que queremos que lance? Pues como siempre en Android, todo ello se configura como un **_intent-filter_**, con el cual indicaremos al sistema qué comando de voz queremos que dispare nuestra actividad. Nos vamos al **_AndroidManifest.xml_** y agregamos la actividad que hemos creado, añadiendo un **_intent-filter_** que capture la acción **_com.google.android.glass.action.VOICE_TRIGGER_** y añadimos como metadatos el fichero xml que creamos anteriormente, quedando así:

```xml
...
    <application ...>

        ...

        <activity
            android:name=".HelloWorldActivity"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="com.google.android.glass.action.VOICE_TRIGGER" />
            </intent-filter>

            <meta-data android:name="com.google.android.glass.VoiceTrigger"
                       android:resource="@xml/trigger" />
        </activity>

    </application>
...
```

Y con esto ya tenemos nuestra aplicación lista para ser lanzada. Conectamos la Google Glass y lanzamos la aplicación. Una cosa que notaréis es que el entorno os dirá que no tenéis definido ninguna actividad principal. Ignoradlo y haced que se lance sin configurar ninguna actividad por defecto.

![Configurar el lanzamiento de nuestra app](/assets/images/3.LanzandoLaApp.png) Configurar el lanzamiento de nuestra app

Una vez instalada, solo nos queda decir "Ok glass, say hello". En el desarrollo normal de la aplicación, nos interesará que esta se lance directamente sin tener que decir el comando de voz, simplemente tenemos que volver a acceder a la pantalla anterior y establecer la actividad que queremos que se inicie cada vez que lancemos la aplicación desde Android Studio.

![App HelloWorld](/assets/images/4.HelloWorld.png) App HelloWorld

El código de este artículo lo tenéis en el siguiente repositorio, bajo la carpeta **1.Helloworld**. _Happy coding!_

[github repo="raycoarana/google_glass_first_steps"]

### Continuará...

En el próximo artículo veremos cómo jugar un poco más con los trigger, qué configuración nos permite y cómo podemos obtener datos de lo que nos diga el usuario.
