---
layout: post
slug: baindo-un-mvvm-diferente-para-android
title: Baindo, un MVVM diferente para Android
date: 2015-01-20 21:59:40+00:00
tags:
  - android
  - java
  - development
  - mvvm
  - ui
subclass: 'post tag-content'
categories:
    - raycoarana
---

Hoy os vengo a presentar algo en lo que llevo un tiempo trabajando, **Baindo**, un framework para aplicar **MVVM en aplicaciones Android**, del que quiero mostraros un _Sneak Peek_ del estado actual.
¿Por qué otro framework MVVM si existen miles? La respuesta a esta pregunta está en las ideas base que inspiran Baindo:
	
  * Evitar el uso de cualquier tipo de Reflection.
  * Sintaxis cómoda en código Java. Nada de Custom Views o Custom Attributes en nuestros layouts.
  * ViewModels sencillos y con ninguna dependencia con Android.
  * Maximizar el rendimiento del hilo de UI. Comandos y eventos de modificación de las propiedades se ejecutan en Background.
  * Actualización de UI desde cualquier hilo a través de las propiedades del ViewModel. Olvidate de tener que usar AsyncTask, Handlers o similares para hacer cambios en la UI.

Pinta bien, ¿no? ;-). Pues además será OpenSource y estará disponible en GitHub muy pronto. Veamos que pinta tiene.

<!--more-->

### Un ejemplo sencillo

Vamos a hacer un ejemplo sencillo de como seria su uso. Hagamos un simple hola mundo con un Button y un TextView que al pulsar dicho botón, nos muestre el mensaje _"HelloWorld!"_ en el TextView.

Lo primero es hacer el layout de la vista.

``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/message"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

    <Button
        android:id="@+id/button"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Tap me!"/>
</LinearLayout>
```

Ahora creamos el ViewModel para nuestro ejemplo, tenemos una acción a ejecutar, luego pondremos un comando y una propiedad de tipo CharSequence a la que asignar el valor **"HelloWorld!"**.
Creamos la propiedad como un atributo público de tipo `Property<CharSequence>`, que llamaremos `Message`, al cual le asignamos una instancia del mismo tipo.
A continuación el comando como un atributo público de tipo `Command`, que llamamos `SayHelloCommand`, creamos una clase anónima que le asignamos a dicho atributo y en él llamamos al método `setValue()` de la propiedad `Message`.

```java
public class ViewModel {
    public final Property<CharSequence> Message = new Property<>();

    public final Command SayHelloCommand = new Command() {
        @Override
        public void execute() {
            Message.setValue("HelloWorld!");
        }
    };
}
```

Sencillo, limpio y fácil de probar.

A continuación creamos un `Activity` que vamos hacer que herede de `BaindoActivity`. **Baindo ofrece una serie de Activities, Fragments y Renderers** (utiliza la librería de [Renderers](https://github.com/pedrovgs/Renderers) para introducir el binding en Adapters) a partir de las cuales crear nuestras vistas. También ofrece un sencillo mecanismo para crear o dar soporte a Baindo en nuestros propios Activities y Fragments base, con muy pocas líneas. Ya os contaré más acerca de como hacer esto.

En este `Activity`, una vez le hemos asignado el layout, llamaremos a un método `bindViews()` justo después del `setContentView()`.

```java
public class ClickActivity extends BaindoActivity {
    private final ViewModel mViewModel = new ViewModel();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_click);

        bindViews();
    }
    ...
}
```

Por último, vamos a implementar el método _bindViews()_, en el vamos a hacer el bind entre el `Button` del layout y el comando `SayHelloCommand`. Y luego entre el `TextView` y la propiedad `Message`. Cuando hacemos un bind a una propiedad debemos establecer la _dirección_ del bind. Este puede ser unidireccional hacia el ViewModel (`writeOnly`), hacia la vista, (`readOnly`) o bidireccional (`readWrite`).

Como ya iremos viendo según avancemos sobre los diferentes bindings que permite Baindo, no todos permiten ambas direcciones, por ejemplo un control `ProgressBar` solo permite el modo readOnly. Un `SeekBar`, sin embargo, permite cualquiera de ellos.

En este caso vamos a ponerlo en modo readOnly, ya que solo queremos que la vista muestre lo que tiene el ViewModel sin modificarlo en ningún caso.

```java
    private void bindViews() {
        bind().text()
              .of(R.id.message)
              .to(mViewModel.Message).readOnly();
        bind().click()
              .of(R.id.button)
              .to(mViewModel.SayHelloCommand);
    }
```

Y ya lo tenemos, si ejecutamos la aplicación (acordaos de registrar la actividad en el manifest), tenemos lo que esperamos, el mensaje se muestra en el `TextView` una vez pulsamos el botón.

El código que hemos escrito en el comando se ejecuta en un hilo separado, un hilo que llamaremos **hilo del ViewModel**, así pues tendremos en nuestra app **un hilo de UI y tantos hilos como Activities/Fragments tengamos en pantalla**. Estos hilos son avisados cuando se producen cambios en la UI y notifican cambios en el ViewModel al hilo de UI.

### ¿Puedo hacer cualquier cosa en un hilo de ViewModel?
Pues si y no, depende de tu ViewModel y tu vista, hay que tener en cuenta que si bien no vas a bloquear nunca la UI, si que puedes producir el efecto de que al pulsar un botón no pasa nada hasta pasado un tiempo. **Si el hilo del ViewModel está ocupado, no puede atender a ese nuevo evento de UI**, los cuales serán atendidos una vez el hilo del ViewModel quede liberado. Lo ideal del hilo de ViewModel es hacer esos pequeños cálculos previos a pintar nuestros modelos. No es un proceso de negocio, sino un proceso de  preparación para ser mostrado en UI como manejo de cadenas, pequeñas operaciones, coordinar operaciones en background, etc.

Con este esquema **conseguimos la mejor respuesta de la UI al usuario**. Adiós parones, bajadas de framerate en animaciones, etc., gracias a Baindo podemos olvidarnos de todo esto. Estad atentos al blog, **muy pronto publicaré la primera alpha** para que podáis trastear con ella, hasta entonces, sed pacientes!!
