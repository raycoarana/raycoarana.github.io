---
layout: post
slug: calligraphy-fuentes-personalizadas-android
title: Calligraphy, fuentes personalizadas en Android
date: 2014-06-16 19:15:48+00:00
cover: 'assets/images/Photoxpress_2141649.jpg'
tags:
  - android
  - calligraphy
  - fuentes
  - personalizadas
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

Si hay una cosa que es un **dolor de muelas** en Android es cuando tienes que hacer una app que usa **fuentes personalizadas**. Aunque es incluso peor, si queremos usar la moderna Roboto, ya tenemos el lío formado, ya que en Android 2.3 no la tendremos tampoco. Y es que utilizar fuentes personalizadas es algo que está muy mal resuelto incluso aún hoy en la última versión del sistema (4.4.3 a día de hoy).

Básicamente para establecer una fuente distinta a las que trae el sistema por defecto, debemos instanciar la fuente (que normalmente tendremos en la carpeta **assets**) y asignarla a la vista de turno. El código sería algo así de horrible (horrible porque hacer esto por cada vista es una locura desde el punto de vista de mantenimiento de este tipo de código).

```java
Typeface tf = Typeface.createFromAsset(getAssets(), 
                                       "fonts/mycustomfont.ttf");
        
TextView myView = (TextView) findViewById(android.R.id.text1);
myView.setTypeface(tf);
```

Vamos a ver algunas formas para mejorar lo anterior y dejar que nuestras vistas se **definan de forma declarativa** por completo en el XML del layout.

<!--more-->

### Solución 1. Controles personalizados

Una primera solución a este problema es utilizar controles personalizados para agregarles un atributo en el que indiquemos que fuente utilizar. Existen varias librerías que implementan esta forma de trabajo con las que simplemente debes utilizar sus vistas en vez de las vistas por defecto. Por ejemplo la librería [PixlUI](https://github.com/neopixl/PixlUI) utiliza esta aproximación.

¿Desventajas de esta forma de trabajo? Pues que implica agregar una dependencia en todo el proyecto con esta librería, introduciendo sus atributos propios en las vistas. Además lo peor es que el editor de layouts pierde muchas veces la capacidad de mostrar el predictivo a la hora de escribir atributos. Además las vistas nos quedarán con esos **nombres de controles enormes** que incluyen el nombre del paquete de la clase y hacen menos legible nuestro código.

```xml
<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android" 
    xmlns:pixlui="http://schemas.android.com/apk/com.neopixl.pixlui"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.neopixl.pixlui.components.textview.TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/text_of_my_view"
        android:gravity="center"
        android:textSize="36sp"
        pixlui:typeface="mycustomfont.ttf"/>

...

</LinearLayout>
```

### Solución 2. Calligraphy

Esta otra solución, implementada por esta librería llamada Calligraphy es tremendamente interesante, con **una aproximación mucho más elegante** a la hora de resolver el problema. En vez de regar nuestra aplicación con referencias a controles externos, esta librería crea un **Wrapper tanto al objeto Context como al objeto LayoutInflater** para interceptar toda referencia a las clases _TextView_, _Button_, _EditText_, _AutoCompleteTextView_, _MultiAutoCompleteTextView_, _CheckBox_, _RadioButton_ y _ToggleButton_. Cuando detecta la instanciación de cualquiera de estos en nuestro _layout_, crea la fuente asociada y se la asigna a la vista. Esto además haciendo uso de una caché de fuentes y demás optimizaciones.

Para que esto funcione, lo que tendremos que hacer es **envolver** el contexto de nuestra actividad con este **Wrapper**, haciendo lo siguiente:

```java
@Override
protected void attachBaseContext(Context newBase) {
    super.attachBaseContext(new CalligraphyContextWrapper(newBase));
}
```

Ahora solo nos queda indicar que fuente queremos usar en las vistas, retomando el ejemplo anterior, sería algo así:

```xml
<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android" 
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/text_of_my_view"
        android:gravity="center"
        android:textSize="36sp"
        android:fontFamily="fonts/mycustomfont.ttf"/>

...

</LinearLayout>
```

Por defecto como puedes ver se reutiliza la propiedad **fontFamily** para indicar la fuente que queremos usar, si bien esto nos puede acarrear problemas a futuro si Google cambia el uso de esa propiedad o le da otro uso (aunque esto sería muy raro). Calligraphy nos ofrece **la posibilidad de usar un atributo personalizado**, para ello primero debemos crearnos el atributo, en el fichero attrbs.xml por ejemplo.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Resources>
    <attr name="customFont"/>
</Resources>
```

Ahora necesitamos indicarle a Calligraphy cual es el atributo que vamos a usar.

```java
@Override
protected void attachBaseContext(Context newBase) {
    super.attachBaseContext(new CalligraphyContextWrapper(newBase, R.attr.customFont));
}
```

Y ya solo nos queda utilizarlo en las vistas.

```xml
<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/text_of_my_view"
        android:gravity="center"
        android:textSize="36sp"
        customFont="fonts/mycustomfont.ttf"/>

...

</LinearLayout>
```

### Conclusiones

Sin duda Calligraphy **es lo que Google debería haber soportado en Android desde hace mucho tiempo**. Integrándolo en la librería de compatibilidad abriría incluso su uso en cualquier versión de la API. Su solución es bastante limpia, no acopla todo nuestro código a controles personalizados y nos permite gestionar todo con estilos y temas, por lo que **podemos centralizar el uso de las fuentes en nuestros ficheros de estilos**. Os dejo el enlace al repositorio donde podéis encontrar el código y ver cómo funciona.

[github repo="chrisjenx/Calligraphy"]
