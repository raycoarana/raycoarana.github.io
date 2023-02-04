---
layout: post
slug: cards-api-primeros-pasos-google-glass-iv
title: Cards API. Primeros pasos con Google Glass (IV)
date: 2014-03-31 07:00:45+00:00
cover: 'assets/images/glass-5.jpg'
tags:
  - android
  - android studio
  - card
  - gdk
  - glassware
  - google glass
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

Hoy vamos a ver cómo crear interfaces gráficas para nuestro Glassware utilizando el concepto de tarjetas o Cards. Como sabéis, en Google Glass no hay botones, no hay forma de interactuar con elementos en la interfaz gráfica, sino que esta se compone de pantallas por las que podemos movernos, pantallas que se denominan tarjetas o Cards. El propio Timeline que se representa en la interfaz inicial de Google Glass es un conjunto de tarjetas por las que podemos movernos. ¿Cómo podemos crear una interfaz de este estilo? Pues de forma muy fácil utilizando las clases CardScrollView, CardScrollAdapter y Card. ¡Vamos a ello!

<!--more-->

### Crear y configurar el proyecto

Lo primero que debemos hacer será crear un nuevo proyecto. Para ello te recomiendo que sigas el artículo de [Primeros pasos con Google Glass]({% post_url 2014-03-02-primeros-pasos-con-google-glass %}), donde vimos cómo crear y configurar un proyecto en Android Studio para Google Glass.

Una vez hemos creado el proyecto vacío, vamos a crear una actividad donde mostraremos nuestra interfaz de tarjetas. Creamos una clase con nombre **_CardsActivity_** y la añadimos al **_AndroidManifest.xml_**. Si quieres puedes añadirle un comando de voz para lanzar la aplicación o por simplicidad, puedes configurar el entorno para lanzar la aplicación directamente como ya comentamos en el [segundo artículo de esta serie]({% post_url 2014-03-26-primeros-pasos-con-google-glass-ii %}). Recuerda que para poder lanzar la actividad desde el entorno esta tendrá que tener un _intent-filter_ con la acción y categoría por defecto (**_...action.MAIN_** y **_...category.LAUNCHER_**). En esta ocasión no vamos a generar un layout para esta actividad, sino que usaremos directamente la vista CardScrollView como contenido de la actividad como veremos a continuación.

### CardScrollView y CardScrollAdapter

La vista **_CardScrollView_** es la encargada de mostrar las tarjetas de forma lineal, permite moverse entre ellas con los gestos de **Swipe hacia izquierda o derecha** y todas las animaciones de aceleración al hacer el gesto de forma rápida para pasar rápido entre las distintas tarjetas. Para ello, el CardScrollView utiliza el mismo patrón que muchas otras vistas en Android, el **patrón Adapter**, para adaptar nuestro modelo al control visual que se muestra en pantalla. De esto se encarga el **_CardScrollAdapter_**, al cual el **_CardScrollView_** irá llamando para construir las tarjetas a mostrar en cada momento, encargándose por nosotros del ciclo de vida de las mismas.

Vamos a crear nuestra vista y asignarla como contenido de nuestra actividad, para ello en el método **_onCreate()_** de nuestra actividad hacemos lo siguiente:

```java
public class CardsActivity extends Activity {

    private CardScrollView mCardScrollView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mCardScrollView = new CardScrollView(this);
        
        setContentView(mCardScrollView);
    }
}
```

Ya tenemos nuestra vista, pero ahora mismo poco va a mostrar ya que no tiene contenido. Vamos a añadirle algunas tarjetas, para ello vamos a crear y configurar un **_CardScrollAdapter_**. Para crear un **_CardScrollAdapter_**, tendremos que heredar la clase e implementar algunos métodos. Lo normal sería tener un modelo de datos asociado a cada tarjeta, pero para nuestro ejemplo, vamos a prescindir de ello para simplificar, por lo que solo tendremos que implementar el método _**getCount()**_ y _**getView()**_ para indicar el número de tarjetas y la vista de cada una de ellas respectivamente. Vamos a crear cuatro tarjetas, así que el código de nuestro Adapter quedaría algo así, donde delegamos la creación de las vistas en métodos que veremos a continuación.

```java
    CardScrollAdapter mCardScrollAdapter = new CardScrollAdapter() {

        @Override
        public int getCount() {
            return 4;
        }

        @Override
        public Object getItem(int i) {
            return null;
        }

        @Override
        public View getView(int i, View view, ViewGroup viewGroup) {
            View cardView;
            switch (i) {
                case 0:
                    cardView = getFirstCardView();
                    break;
                case 1:
                    cardView = getSecondCardView();
                    break;
                case 2:
                    cardView = getThirdCardView();
                    break;
                default: //case 3:
                    cardView = getFourthCardView();
                    break;
            }
            return cardView;
        }

        @Override
        public int findIdPosition(Object o) {
            return 0;
        }

        @Override
        public int findItemPosition(Object o) {
            return 0;
        }
    };
```

Como habéis visto, el **_CardScrollAdapter_**, como cualquier otro Adapter, lo que nos pide son vistas, por lo que podríamos crear cualquier tipo de vista para nuestras tarjetas. Sin embargo, Google ha incluido en el SDK la clase **_Card_** que nos **permite crear vistas de forma sencilla**, con el estilo de Glass sin tener que preocuparnos por nada. El que hayamos configurado nuestro Adapter con 4 elementos no es casualidad, vamos a ver las principales configuraciones de tarjetas que podemos crear con esta clase.

### Tarjeta simple con texto

La primera tarjeta que crearemos será una sencilla que solo contendrá un texto. La clase **_Card_** requiere como parámetro el contexto y luego le asignaremos los datos a mostrar por la misma. Cuando hemos acabado, llamamos al método **_toView()_** para obtener la vista resultante.

```java
    private View getFirstCardView() {
        Card card = new Card(this);
        card.setText("Tarjeta simple de texto");
        return card.toView();
    }
```

El resultado de este código es la siguiente tarjeta:

![Tarjeta simple con texto](/assets/images/tarjeta_texto.png) Tarjeta simple con texto

### Tarjeta con texto e imagen a la izquierda

Para añadir una imagen a la izquierda de la tarjeta, solo tendremos que llamar al método **_addImage()_** y establecer con **_setImageLayout()_** que esta esté alineada a la izquierda.

```java
    private View getSecondCardView() {
        Card card = new Card(this);
        card.setText("Tarjeta con imagen a la izquierda");
        card.setImageLayout(Card.ImageLayout.LEFT);
        card.addImage(R.drawable.audi);
        return card.toView();
    }
```

El resultado lo podéis ver a continuación:

![Tarjeta con texto e imagen a la izquierda](/assets/images/tarjeta_texto_imagen_izq.png) Tarjeta con texto e imagen a la izquierda

### Tarjeta con texto e imagen al fondo

Si queremos que la imagen no esté a la izquierda sino que esté de fondo de la tarjeta, simplemente cambiamos el ImageLayout de la misma. Esto creará un ligero degradado a negro tras el texto para ganar contraste sobre la imagen.

```java
    private View getThirdCardView() {
        Card card = new Card(this);
        card.setText("Tarjeta con imagen al fondo");
        card.setImageLayout(Card.ImageLayout.FULL);
        card.addImage(R.drawable.opel);
        return card.toView();
    }
```

La tarjeta resultante es la siguiente:

![Tarjeta con imagen de fondo](/assets/images/tarjeta_texto_imagen_fondo.png) Tarjeta con imagen de fondo

### Tarjeta con texto, nota al pie y varias imágenes a la izquierda

Podemos agregar varias imágenes, creándonos un mosaico con ellas. También podremos acompañar el texto principal con un texto al pie de la tarjeta.

```java
    private View getFourthCardView() {
        Card card = new Card(this);
        card.setText("Tarjeta con texto al pie y varias imagenes");
        card.setFootnote("Texto pie de página");
        card.setImageLayout(Card.ImageLayout.LEFT);
        card.addImage(R.drawable.audi);
        card.addImage(R.drawable.opel);
        return card.toView();
    }
```

El resultado es la siguiente tarjeta:

![Tarjeta con múltiples imágenes y pie](/assets/images/tarjeta_multiples_img.png) Tarjeta con múltiples imágenes y pie

Ahora que ya tenemos nuestro Adapter con sus vistas, nos falta asignarlo al **_CardScrollView_** y activar este. Para ello añadimos estas líneas en el método **_onCreate()_** de la actividad.

```java
...
mCardScrollView.setAdapter(mCardScrollAdapter);
mCardScrollView.activate();
...
```

Con esto si lanzamos la aplicación veremos la interfaz de tarjetas con cada una de ellas. Pero, ¿cómo podemos interactuar con ellas? No podemos poner un botón, implementar el OnClickListener no servirá de nada. ¿Entonces? ¿Cómo podemos darle opciones al usuario para realizar acciones sobre cada tarjeta?

### Interactuando con una tarjeta

Para interactuar con una tarjeta, debemos asignar un **_OnItemClickListener_** al **_CardScrollView_**. Cada vez que el usuario haga _TAP_, la vista nos notificará con la información relativa a la tarjeta sobre la que se ha realizado la pulsación en el TouchPad. En el método **_onCreate()_** de nuestra actividad, añadimos la siguiente línea:

```java
...
mCardScrollView.setOnItemClickListener(this);
...
```

Ahora nos queda hacer que nuestra actividad implemente esa interfaz **_OnItemClickListener_** y añadir el método **_OnItemClick()_**.

```java
...
public class CardsActivity extends Activity implements AdapterView.OnItemClickListener {

    ...

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

    }
}
```

Bien ahora que ya somos notificados sobre la pulsación sobre una tarjeta, ¿cómo podemos mostrar al usuario operaciones que hacer sobre estos elementos que está viendo? Pues haciendo uso de los menús de Android. En Google Glass, los menús se comportan de manera distinta, mostrándose cada entrada de menú a pantalla completa como tarjetas sobre las que el usuario puede moverse (adivinad qué vista utilizará el sistema operativo para implementar esto). La manera de implementarlo por tanto es muy conocida por cualquier desarrollador Android, pero vamos a repasarla.

Lo primero será crearnos la definición de nuestro menú, creamos un fichero xml en **_menu/activity_cards.xml_**. Los iconos los tenéis disponibles en el repositorio junto con el resto del código.

```xml
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <item android:id="@+id/menu_read_aloud"
          android:icon="@drawable/ic_read_aloud"
          android:title="@string/menu_read_aloud" />

    <item android:id="@+id/menu_share"
        android:icon="@drawable/ic_share"
        android:title="@string/menu_share" />

    <item android:id="@+id/menu_close"
        android:icon="@drawable/ic_close"
        android:title="@string/menu_close" />

</menu>
```

Una vez tenemos nuestro menú, vamos a incorporarlo a la actividad. Para ello implementamos los métodos **_onCreateOptionsMenu()_** y **_onOptionsItemSelected()_** para crear el menú cuando sea necesario y realizar acciones cuando se seleccione un elemento del menú. Si quisieramos personalizar el menú en función del elemento sobre el que se hace la selección, podemos implementar el método **_onPrepareOptionsMenu()_** y ocultar/mostrar aquellos elementos que nos interese.

```java
...

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_cards, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.menu_read_aloud:
                onMenuReadAloud();
                break;
            case R.id.menu_share:
                onMenuShare();
                break;
            case R.id.menu_close:
                onMenuClose();
                break;
            default:
                return super.onOptionsItemSelected(item);
        }
        return true;
    }

...
```

Ya tenemos muestro menú montado, solo nos falta relacionar el **_onItemClick_** del **_CardScrollView_** con la apertura del menú y escribir código para cada una de las acciones. Lo primero es tan sencillo como esto:

```java
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        this.openOptionsMenu();
    }
```

Pero vamos a complicar un poco el caso, por ejemplo no queremos que para el primer elemento del **_CardScrollView_** se muestre un menú. ¿Qué deberíamos hacer? Pues por un lado evitar llamar al método **_openOptionsMenu()_** cuando el usuario haga TAP sobre el primer elemento y muy importante, darle **feedback al usuario de que en ese elemento no hay acciones** posibles a realizar. Para esto segundo haremos uso del **_AudioManager_** y los sonidos del sistema, que específicamente en Glass están representados por constantes de la clase **_Sounds_**, en concreto la constante _DISALLOWED_. De la misma forma, para darle feedback al usuario de la apertura del menú, haremos lo mismo pero con la constante _TAP_.

Lo primero, obtener una instancia al **_AudioManager_** en el método **_onCreate()_**.

```java
    private AudioManager mAudioManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mAudioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        ...
```

Ahora en el método **_onItemClick()_** hacemos lo siguiente:

```java
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        if (position == 0) {
            mAudioManager.playSoundEffect(Sounds.DISALLOWED);
        } else {
            mAudioManager.playSoundEffect(Sounds.TAP);
            this.openOptionsMenu();
        }
    }
```

Ya tenemos la funcionalidad que queríamos, ahora el primer elemento no muestra el menú y da feedback al usuario de ello. Vamos ahora a darle funcionalidad a las acciones que teníamos. No vamos a implementarlas de verdad para no extendernos demasiado, solo vamos mostrar en el log del sistema que se han ejecutado.

```java
    private void onMenuReadAloud() {
        Log.i("DEMO3", "onMenuReadAloud()");
    }

    private void onMenuShare() {
        Log.i("DEMO3", "onMenuShare()");
    }

    private void onMenuClose() {
        Log.i("DEMO3", "onMenuClose()");
    }
```

Y con esto lo tenemos todo, al ejecutar la aplicación y hacer TAP sobre una de las tarjetas con menú, se nos mostrará dándonos la opción a seleccionar la acción que queremos realizar.

![ReadAloud](/assets/images/menu_read_aloud.png)
![Share](/assets/images/menu_share.png)
![Close](/assets/images/menu_close.png)

### Buenas prácticas

Por último vamos a comentar algunas buenas prácticas que envuelven a las interfaces en general de Google Glass y que tienen que ver con estos elementos que hemos visto hoy. Lo primero es la recomendación de siempre utilizar un **_CardScrollView_** en nuestras interfaces, aunque solo vayamos a mostrar una sola tarjeta. **_CardScrollView_** tiene esos **efectos de rebote animados** cuando el usuario llega al final, dándole un feedback muy importante de la no existencia de más elementos. Así pues, a menos que vayamos a utilizar el Swipe izquierda o derecha para otra cosa, hagamos uso del **_CardScrollView_**. 

Otra buena práctica muy relacionada con ese feedback es informar al usuario de si su **acción sobre el TouchPad ha sido reconocida o no** mediante sonidos, como hemos podido ver en el código ejemplo. Debemos informar al usuario de qué ocurre cuando hace TAP, reproduciendo el sonido adecuado si no hay acción disponible.

Y hasta aquí hemos llegado en este artículo, como siempre tenéis disponible el código en el repositorio de GitHub de esta serie de artículos bajo la carpeta **3.CardAPI**.

{% github raycoarana/google_glass_first_steps %}

### Continuará...

Ahora que ya sabemos como manejar las tarjetas y mostrar acciones sobre ellas, vamos a ver cómo podemos trabajar con el Timeline, veremos cómo podemos crear tarjetas estáticas, tarjetas dinámicas e incorporarlas en el Timeline, pudiendo el usuario interactuar con ellas sin la necesidad de abrir nuestra aplicación.
