---
author: raycoarana
comments: true
date: 2014-03-28 17:47:02+00:00
layout: post
link: http://raycoarana.com/desarrollo/primeros-pasos-con-google-glass-iii/
slug: primeros-pasos-con-google-glass-iii
title: Voice triggers. Primeros pasos con Google Glass (III)
wordpress_id: 68
categories:
- Desarrollo
post_format:
- Imagen
tags:
- android
- android studio
- gdk
- glassware
- google glass
- voice trigger
---

En el anterior artículo sobre los primeros pasos con Google Glass empezamos a ver el concepto de **Voice trigger**, los comandos de voz que permiten lanzar nuestras aplicaciones. Vamos a hablar un poco más cerca de ellas y qué cosas podemos hacer a día de hoy con la API.

<!-- more -->

[sh_margin margin="20"]


### Voice triggers con prompt


Una de las primeras cosas que podemos hacer con un Voice trigger es hacerle una pregunta al usuario. Es decir, el usuario dice **_Ok glass, google_**, entonces el sistema antes de abrir la aplicación de Google, abre una interfaz en la que muestra una pregunta y espera a que el usuario responda a ella. Luego una vez el usuario responde a la pregunta, lanza la aplicación proporcionando como parámetro el texto capturado.

[caption id="attachment_258" align="aligncenter" width="300"][![Prompt de la aplicación de Google](http://raycoarana.com/wp-content/uploads/2014/03/1.prompt-300x168.png)](http://raycoarana.com/wp-content/uploads/2014/03/1.prompt.png) Prompt de la aplicación de Google[/caption]

Para asociar un prompt a nuestro voice trigger es tan sencillo como añadir una etiqueta **_input_** con un atributo **_prompt_** dentro de la etiqueta **_trigger_** de la siguiente forma:

[code language="xml"]
<?xml version="1.0" encoding="utf-8"?>
<trigger keyword="@string/glass_voice_trigger">
    <input prompt="@string/glass_voice_prompt" />
</trigger>
[/code]

Así de sencillo, con esto cuando el usuario lance nuestra aplicación, el sistema mostrará esa interfaz y capturará lo dicho por el usuario. Pero, ¿cómo recibimos esa información en nuestra aplicación? Pues como no podía ser de otra forma, a través del **Intent**. Para obtenerlo, debemos usar la constante **RecognizerIntent.EXTRA_RESULTS**, con la que obtendremos una lista de String con cada una de las palabras capturadas.

[code language="java"]
ArrayList<String> voiceResults = getIntent().getExtras()
        .getStringArrayList(RecognizerIntent.EXTRA_RESULTS);
[/code]

[sh_margin margin="20"]


### Creando un Voice trigger con prompt


Vamos a poner en práctica lo anterior, creamos una nueva actividad en nuestro proyecto (o creamos un proyecto nuevo como [ya vimos](http://raycoarana.com/desarrollo/primeros-pasos-con-google-glass-ii/)) con su layout, donde vamos a mostrar el texto que hemos capturado del usuario.

Creamos un layout con nombre **activity_askmesomething.xml**, cuyo contenido será el siguiente.

[code language="xml"]
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textSize="18sp"
        android:text="I ask you something and you respond"/>

    <TextView
        android:id="@+id/captured_input"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"/>

</LinearLayout>
[/code]

Ahora creamos la actividad, enlazando con este layout.

[code language="java"]
public class AskMeSomethingActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_askmesomething);
    }
}
[/code]

Ahora vamos a obtener una referencia al **TextView** donde vamos a mostrar el texto capturado, recomponemos el texto capturado con un **StringBuilder** y lo asignamos al **TextView**. Quedaría algo así:

[code language="java"]
...
        ArrayList<String> voiceResults = getIntent().getExtras()
                .getStringArrayList(RecognizerIntent.EXTRA_RESULTS);

        StringBuilder inputBuilder = new StringBuilder();
        for(String voiceToken : voiceResults) {
            inputBuilder.append(voiceToken);
            inputBuilder.append(" ");
        }

        TextView capturedInputText = (TextView)findViewById(R.id.captured_input);
        capturedInputText.setText(inputBuilder.toString());
...
[/code]

Ya por último nos queda crear el Voice trigger y añadir la nueva actividad al **AndroidManifest.xml**. Lo primero el Voice trigger, añadimos un nuevo fichero xml que llamamos **_askmesomething_trigger.xml_** con el siguiente contenido, nada que ya no hayamos visto antes.

[code language="xml"]
<trigger keyword="@string/trigger_ask_me_something">
    <input prompt="@string/prompt_ask_me_something" />
</trigger>
[/code]

Modificamos el fichero **_strings.xml_** para agregar las nuevas cadenas.

[code language="xml"]
<string name="trigger_ask_me_something">ask me something</string>
<string name="prompt_ask_me_something">What\'s your favourite color?</string>
[/code]

Y por último agregamos la actividad al **_AndroidManifest.xml_**.

[code language="xml"]
...
        <activity
            android:name=".AskMeSomethingActivity"
            android:label="@string/app_name" >
            <intent-filter>
                <action
                    android:name="com.google.android.glass.action.VOICE_TRIGGER" />
            </intent-filter>

            <meta-data android:name="com.google.android.glass.VoiceTrigger"
                android:resource="@xml/askmesomething_trigger" />
        </activity>
...
[/code]

Y ya tenemos todo listo, ahora solo nos falta lanzar la aplicación, decir **_Ok glass, ask me something_** y veremos la siguiente pantalla:

[caption id="attachment_259" align="aligncenter" width="300"][![Prompt de nuestra aplicación](http://raycoarana.com/wp-content/uploads/2014/03/2.our_prompt-300x168.png)](http://raycoarana.com/wp-content/uploads/2014/03/2.our_prompt.png) Prompt de nuestra aplicación[/caption]

Al responder a la pregunta, se lanzará nuestra aplicación, mostrando por pantalla lo capturado:

[caption id="attachment_260" align="aligncenter" width="300"][![Pantalla con el resultado de la captura](http://raycoarana.com/wp-content/uploads/2014/03/3.horse_is_black-300x168.png)](http://raycoarana.com/wp-content/uploads/2014/03/3.horse_is_black.png) Pantalla con el resultado de la captura[/caption]

[sh_margin margin="20"]


### Restricciones


Una última cosa que nos queda por comentar de los Voice triggers es la posibilidad de **deshabilitarlos en función del estado del sistema**, es decir, si alguna de las características del dispositivo no está disponible por la razón que fuera, el sistema deshabilita aquellos comandos de voz que lo requieran. Actualmente existen tres:




	
  * camera

	
  * network

	
  * microphone



Por ejemplo, si nuestra aplicación requiere de conexión a internet, podemos limitar su uso con el siguiente código, donde podemos ver que se ha añadido la etiqueta **constraints** con el atributo **network** a **true**.

[code language="xml"]
<trigger keyword="@string/trigger_ask_me_something">
    <constraints network="true" />
</trigger>
[/code]

Y esto es todo, el código de este artículo lo tenéis en el repositorio de esta serie de artículos, bajo la carpeta **2.VoiceTriggers**.

[github repo="raycoarana/google_glass_first_steps"]

[sh_margin margin="20"]


### Continuará...


En el próximo artículo vamos a empezar a trabajar con la **Card API** para crear una interfaz con la que podamos navegar e interactuar. Veremos cómo utilizar las clases _Card_, _CardScrollView_ y _CardScrollAdapter_ para conseguir una interfaz similar a la que podemos ver en las aplicaciones Google Glass, sin ir más lejos, el propio **Timeline** usa esta dinámica.
