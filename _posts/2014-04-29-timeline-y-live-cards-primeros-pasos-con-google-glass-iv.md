---
author: raycoarana
comments: true
date: 2014-04-29 21:00:32+00:00
layout: post
link: http://raycoarana.com/desarrollo/timeline-y-live-cards-primeros-pasos-con-google-glass-iv/
slug: timeline-y-live-cards-primeros-pasos-con-google-glass-iv
title: Timeline y Live Cards. Primeros pasos con Google Glass (V)
wordpress_id: 292
categories:
- Desarrollo
post_format:
- Imagen
tags:
- android
- cards
- gdk
- glassware
- google glass
- live card
- static card
- timeline
---

Hace mucho que no escribía en el blog, entre otras cosas porque ando un poco liado con un proyecto personal. Además, como ya sabrás Google ha actualizado Google Glass a la versión de firmware XE16, subiendo la versión de Android a 4.4.2, actualizando también el GDK y por consiguiente, nos trae muchos cambios en la API. Esto ha implicado que parte de este artículo ya no tenga sentido, ya que Google ha eliminado la clase TimelineManager y por tanto, ya no es posible publicar en el Timeline tarjetas estáticas.

[sh_margin margin="20"]


### Cambios en el GDK


Antes de continuar con la última entrega en esta serie de artículos de introducción a Google Glass, toca actualizar los anteriores. En el repositorio Git donde está el código de todos los artículos anteriores, podrás encontrar los proyectos actualizados con estos cambios, no son muchos y la mayoría no son más que cambios de nombres.

<!-- more -->




	
  * **Nuevo permiso para comandos de voz propios.** Si queremos utilizar comandos de voz que están fuera de la lista oficial de comandos, tendrás que añadir el permiso _**com.google.android.glass.permission.DEVELOPMENT**_ en tu Manifest. Ni que decir tiene, que con este permiso no te permitirán subir la aplicación a MyGlass. Los comandos de voz permitidos están incluidos ahora como constantes en la clase **_VoiceTriggers.Command_** y en el tag **_trigger_** debemos indicar el comando usando el atributo **_command_**
.
	
  * **Clase Card.** Cambia el nombre del método _toView()_ a _getView()_. Además existe una sobrecarga para la reutilización de vistas cuando se utiliza dentro de un CardScrollView.

	
  * **Clases CardScrollView y CardScrollAdapter.** Hay varios métodos que ya no existen o que ya no se pueden sobrescribir.



El resto de cambios afectan a API que no hemos visto, como la que ya hemos comentado, la desaparición de la clase _TimelineManager_. Si quieres ver el resto de cambios, puedes consultar las [Release Notes](https://developers.google.com/glass/release-notes) que ha publicado Google.

[sh_margin margin="20"]


### Static Cards


Como decíamos anteriormente, las Static Cards ya no existen como tal. Anteriormente, usando la clase _TimelineManager_ era posible publicar una tarjeta (objetos de tipo Card) directamente al Timeline, en la parte derecha que corresponde al pasado. El problema de esta API es que estas tarjetas no eran muy útiles, ya que el usuario no podía interactuar con ellas. No era posible asociarle un menú con el que poder interactuar y es esta seguramente la principal razón de su eliminación. Por lo tanto una Static Card no será más que una Live Card cuya vista permanece estática, aunque esto siempre será en la parte del futuro. ¿Y para el pasado? A mí esto me huele a próxima integración con la nueva API de Wearables que tenemos en Android y las tarjetas estáticas serán notificaciones.

[sh_margin margin="20"]


### Live Cards


Las Live Cards son por tanto la única forma que tenemos para insertar tarjetas en el Timeline de Google Glass (al menos por ahora). Para crear una tarjeta, basta con construir un objeto de tipo **_LiveCard_**, pasando el contexto y un tag con el que identificamos a la tarjeta. 

[code language="java"]
LiveCard liveCard = new LiveCard(this, "simple-card");
[/code]

Una vez tenemos nuestra tarjeta, necesitamos decirle qué queremos mostrar. Existen dos tipos de Live Cards, en función de la frecuencia de actualización de la interfaz que necesitemos, las creadas a partir de una vista normal para baja frecuencia de actualización o las creadas sobre un SurfaceHolder, para por ejemplo, pintar con OpenGL, cuando se requiera una frecuencia de actualización alta. Es decir, si vamos a modificar el contenido de nuestra Live Card una o dos veces por segundo como mucho, la primera aproximación es la adecuada. Si por contra vamos a crear un compass, realidad aumentada o algo que necesite una frecuencia de 20-30 o más veces por segundo, debemos optar por la segunda opción.

Para las primeras, debemos asignarle una **RemoteView**. Esto ya nos debería sonar, en Android las **RemoteView **se utilizan para cuando queremos crear Widgets y en cierta manera es justo lo que queremos hacer ahora, queremos darle a otra aplicación (el Timeline) una vista para que la muestre desde nuestra aplicación. Hay que tener esto claro para entender por qué no podemos poner cualquier vista en una **RemoteView** y como es además su forma de actualización a través del objeto **RemoveView**, realmente **nos estamos comunicando con otra aplicación**, que vive en otro contexto distinto al de nuestra app.

[code language="java"]
RemoteViews views = new RemoteViews(context.getPackageName(), 
                                    R.layout.view_of_my_livecard);
liveCard.setViews(views);
[/code]

Para las segundas, como comentamos necesitamos activar el _flag_ de que nos vamos a encargar nosotros directamente del pintado y hacerlo mediante el _callback_ que nos proporciona el **_SurfaceHolder_**. A partir de aquí podríamos crear un contexto de OpenGL por ejemplo y a partir de ahí crear lo que queramos. Pero eso ya no forma parte de esta serie de artículos de introducción a Google Glass, ya que lo podemos considerar como un aspecto avanzado y al que aplican las mismas reglas a partir de aquí a cualquier aplicación Android que use un SurfaceHolder.rfaceHolder_**.

[code language="java"]
liveCard.setDirectRenderingEnabled(true);
liveCard.getSurfaceHolder().addCallback(callback);
[/code]

Una vez tenemos ya configurada nuestra Live Card, solo nos queda publicarla, para ello es tan sencillo como llamar al método **_publish()_**. Este método nos pide un parámetro para indicar la forma de publicación, **REVEAL** o **SILENT**. Con REVEAL le estamos indicando al Timeline que debe llevar al usuario a nuestra tarjeta recién publicada. Si por contra utilizamos SILENT, como nos podemos imaginar, la tarjeta se publicará sin _molestar_ al usuario.

Pero... ¿realmente ya está? La verdad es que no. Si ejecutamos el código que hemos ido viendo y lo ejecutamos en una actividad, veremos que al salir de esta y volver al Timeline, nuestra tarjeta no existe. El problema es el ciclo de vida de nuestra aplicación y la tarjeta. Si recordáis del desarrollo de Widgets en Android, era siempre necesario tener un servicio en el que se apoyase el Widget y en el caso de las Live Cards nos ocurre igual, debemos crear un servicio y asociarlo a nuestra _LiveCard_ utilizando el método **_attach()_** o creándolo directamente desde el propio servicio y que este gestione explícitamente su ciclo de vida.

[code language="java"]
liveCard.attach(myService);
liveCard.publish(PublishMode.REVEAL);
[/code]

[sh_margin margin="20"]


### Manos a la obra


Vamos a crear un ejemplo completo, vamos a crear un **Voice Trigger con Prompt** el cual lanzará un servicio. En este servicio, con cada Intent recibido, actualizaremos la Live Card para que muestre el texto que ha dictado el usuario. Además, llevaremos al usuario a dicha tarjeta una vez la hemos actualizado. Empezamos!

En primer lugar creamos el layout de nuestra Live Card. Vamos a hacer algo sencillo, simplemente un TextView en el que mostrar el texto.

[code language="xml"]
<TextView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/my_card_content"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
[/code]

Ahora vamos a crear el servicio, primero el esqueleto del mismo.

[code language="java"]
public class Demo4Service extends Service {

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        ...
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        ...
    }
}
[/code]

Ahora en el método **_onStartCommand()_** recibiremos cada uno de los Intent que el usuario vaya lanzando, así que lo primero será transformar el texto obtenido desde la lista a una simple String.

[code language="java"]
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        ArrayList<String> voiceResults = intent.getExtras().getStringArrayList(RecognizerIntent.EXTRA_RESULTS);

        StringBuilder userContent = new StringBuilder();
        for (String voiceToken : voiceResults) {
            userContent.append(voiceToken);
            userContent.append(" ");
        }
...
[/code]

Una vez tenemos ya la cadena a mostrar, vamos a crear la tarjeta. La tarjeta solo será necesaria crearla si es la primera vez que el usuario lanza el comando desde el inicio del servicio. Si este ya estaba en ejecución, la tarjeta ya existe y solo tendremos que actualizarla. Para esto es importante quedarnos con una instancia siempre de la tarjeta a nivel de servicio.

[code language="java"]
...
        boolean haveToPublish = false;
        if (mLiveCard == null) {
            mLiveCard = new LiveCard(this, "simple-card");
            mLiveCard.setAction(PendingIntent.getActivity(this, 0, new Intent(this, MenuActivity.class), 0));
            mRemoteViews = new RemoteViews(getPackageName(), R.layout.view_of_my_livecard);
            haveToPublish = true;
        }
...
[/code]

En el trozo de código anterior podemos ver cómo creamos la tarjeta y cómo le asignamos una acción. **¡Ojo con esto porque es obligatorio!**, si no definimos una acción a nuestra tarjeta, esta no se publicará. **Si nuestra tarjeta no tiene de verdad ninguna función a mostrar** cuando el usuario pulsa sobre ella, debemos lanzar una actividad, que no haga ni muestre nada, pero que reproduzca el **sonido correspondiente para indicar al usuario que no existe acción posible**. Esto es algo en lo que insisto mucho siempre a los desarrolladores, siempre, siempre, siempre hay que dar feedback al usuario de lo que está pasando, para que no se quede dando TAPs al TouchPad para ver si se muestra algo y no saber si es que no hay nada, no funciona o el dispositivo no funciona bien.

También podemos ver en este trozo de código cómo creamos la vista de nuestra tarjeta, que como hemos hablado anteriormente, se trata de una **RemoteView**. También nos guardamos la instancia de la **RemoteView** para poder actualizarla a posteriori.

Lo siguiente será un código que se ejecutará siempre, independientemente de si la tarjeta existía con anterioridad o no y es la actualización de la vista con el texto dictado por el usuario. Para ello utilizamos uno de los métodos soportados por el objeto **RemoteViews** para actualizar el contenido de esa vista remota. Una vez lo hemos actualizado, necesitamos reasignarlo a la Live Card para que esta tenga conocimiento del cambio.

[code language="java"]
...
        mRemoteViews.setTextViewText(R.id.my_card_content, userContent);
        mLiveCard.setViews(mRemoteViews);
...
[/code]

Ya por último dentro del método _onStartCommand()_ nos falta publicar la tarjeta, si no estaba ya publicada o navegar hacia ella si ya lo estaba. Para ello nos ayudamos del flag que hemos definido anteriormente de la siguiente forma:

[code language="java"]
...
        if(haveToPublish) {
            mLiveCard.publish(LiveCard.PublishMode.REVEAL);
        } else {
            mLiveCard.navigate();
        }
...
[/code]

Bien, ya tenemos creada nuestra tarjeta, ahora necesitamos implementar el evento onDestroy de nuestro servicio, donde vamos a retirar nuestra tarjeta del Timeline.

[code language="java"]
    @Override
    public void onDestroy() {
        if (mLiveCard != null && mLiveCard.isPublished()) {
            mLiveCard.unpublish();
            mLiveCard = null;
        }
        super.onDestroy();
    }
[/code]

Ya lo tenemos todo, ahora solo nos falta configurar el _AndroidManifest_ y el Voice Trigger con su Prompt como ya sabemos. Lo primero el Voice Trigger con el Prompt.

[code language="xml"]
<trigger keyword="@string/trigger_show_my_card">
    <input prompt="@string/prompt_show_my_card" />
</trigger>
[/code]

Y declaramos el servicio en el _AndroidManifest_, asociándolo al Voice Trigger.

[code language="xml"]
...
        <service android:name=".Demo4Service">
            <intent-filter>
                <action
                    android:name="com.google.android.glass.action.VOICE_TRIGGER" />
            </intent-filter>

            <meta-data android:name="com.google.android.glass.VoiceTrigger"
                android:resource="@xml/show_my_card_trigger" />
        </service>
...
[/code]

**Recordad añadir el permiso para poder usar comandos personalizados**

[sh_margin margin="20"]


### Interactuando con nuestra Live Card


Anteriormente hemos visto cómo añadíamos una acción a nuestra Live Card, algo que es obligatorio, así que para completar nuestra aplicación, debemos implementar ese MenuActivity, el cual deberá ser transparente y que al mostrarse deberá abrir el menú. Además, si el menú se cierra, debe finalizarse y dejar la tarjeta en primer plano. Es todo código que ya hemos hecho en anteriores artículos, pero vamos a repasarlo rápidamente.

Creamos el fichero de menú.

[code language="xml"]
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@+id/one"
          android:title="One" />
    <item android:id="@+id/two"
          android:title="Two" />
</menu>
[/code]

Creamos la actividad, en la cual no necesitaremos el método _onCreate()_ ya que esta no va a tener interfaz gráfica. Para asociarle un menú a la actividad, lo hacemos como siempre. Para simplificar, no le vamos a añadir código para cuando se selecciona alguna de las opciones del menú, pero en caso de querer hacer algo, solo tendríamos que añadir el código que corresponda en el **switch**.

[code language="java"]
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.my_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            default:
                return super.onOptionsItemSelected(item);
        }
    }
[/code]

Ahora para hacer que el menú se muestre al abrir la actividad y que la actividad se finalice cuando el menú se cierre implementamos los siguientes métodos.

[code language="java"]
    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        openOptionsMenu();
    }

    @Override
    public void onOptionsMenuClosed(Menu menu) {
        finish();
    }
[/code]

Ya solo nos quedan un par de pequeños detalles para terminar nuestra aplicación y poder ver nuestra Live Card en acción. Lo primero es hacer nuestra actividad transparente, para eso vamos a sobrescribir el tema para esta actividad por uno que haga el fondo transparente y elimine cualquier animación de entrada de la actividad. En nuestro fichero de estilos agregamos el siguiente tema. Esperemos que en un futuro GDK este tema venga incluido por defecto en el sistema.

[code language="xml"]
    <style name="MenuTheme" parent="@android:style/Theme.DeviceDefault">
        <item name="android:windowBackground">@android:color/transparent</item>
        <item name="android:colorBackgroundCacheHint">@null</item>
        <item name="android:windowIsTranslucent">true</item>
        <item name="android:windowAnimationStyle">@null</item>
    </style>
[/code]

Por último nos queda registrar la actividad en el _AndroidManifest_, donde le asociaremos el tema que hemos creado.

[code language="xml"]
        <activity android:name=".MenuActivity"
                  android:theme="@style/MenuTheme"/>
[/code]

Ejecutamos el proyecto y decimos "ok glass, show my card", nos saltará el Prompt y a continuación, nuestra tarjeta.



Y con esto terminamos esta serie de artículos dedicados a Google Glass. Esto es lo básico y que marca diferencia con una aplicación Android, si bien me reservo aún algún tema como la autenticación con cuentas Google y no Google en Glass, pero hay muchas más cosas con las que experimentar ahí fuera y por ahora y hasta que exista un gran cambio de API en Google Glass, creo que es algo ya superado. Como siempre tenéis disponible el código en el repositorio de GitHub de esta serie de artículos bajo la carpeta **4.Timeline**.

[github repo="raycoarana/google_glass_first_steps"]

[sh_margin margin="20"]


### Conclusiones


Con la utilización de Google Glass en el día a día vemos que a pesar del gran **_hype_** que tiene a su alrededor, no es más que un dispositivo Wearable y como tal, tiene grandes usos específicos, pero a su vez grandes limitaciones en su utilización. Es un complemento ideal para que te guíe por medio de una ciudad que no conoces, pero nada apropiado para leer o interactuar con ellas durante un largo tiempo. Como siempre serán las apps las que hagan de este dispositivo algo útil y básico en nuestro día a día o una mera anécdota en la historia de los gadgets. Así pues, ¡su futuro está en vuestras manos! 

_Happy coding explorers! :-)_
