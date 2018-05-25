---
layout: post
slug: patron-promise-con-jdeferred
title: Patrón Promise con jdeferred
date: 2014-08-07 22:02:48+00:00
tags:
  - android
  - concurrent
  - java
  - promise
  - thread
  - development
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

El patrón Promise es un patrón que trata de simplificar la estructura de nuestro código cuando trabajamos con operaciones asíncronas, algo que está a la orden del día en cualquier aplicación con interfaz gráfica, pero también importante en servicios que tienen distintas dependencias para realizar su trabajo y este puede realizarse en paralelo.

En primer lugar vamos a plantear el problema que trata de resolverse y cómo lo simplificamos con este patrón y en concreto con la librería **jdeferred**. Luego veremos el caso de particular de Android y el soporte específico que nos ofrece **jdeferred** que nos simplifican aún más el trabajo.

<!--more-->

### Trabajo en paralelo y sincronización de hilos
En cualquier aplicación que desarrollemos, siempre debemos trabajar al menos con dos hilos de ejecución. Un primer hilo encargado de pintar la interfaz gráfica y procesar la entrada del usuario; y un segundo hilo encargado de realizar las operaciones con recursos lentos como el acceso a disco, red, etc. Con esto conseguimos tener una interfaz gráfica que siempre responde al usuario y no parece que está colgada.

Por ejemplo, imaginemos que queremos en nuestra aplicación realizar tareas de procesamiento a razón de peticiones del usuario. Según el trabajo se vaya completando queremos notificar el progreso al usuario. Ahora mismo estamos en un mundo donde no hay PC/Smartphone/Tablet que no tenga varias CPUs, así que podemos lanzar varias cosas a ejecutarse al mismo tiempo, pero no podemos crear infinitos hilos -bueno en teoría sí, ya que el Sistema operativo compartirá el tiempo de CPU entre todos los hilos y si la memoria aguanta, podríamos tener muchos, pero no es lo más óptimo-. Así pues para empezar, nos creamos un **pool de hilos**.

```java
private static final int NUMBER_OF_CPUS = Runtime.getRuntime().availableProcessors();

private ExecutorService mExecutorService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sample);

        mExecutorService = Executors.newFixedThreadPool(NUMBER_OF_CPUS);
    }
```

En este código estamos utilizando el número de CPUs disponibles, **no quiere decir que esto sea lo más óptimo**. De hecho, dependiendo del tipo de trabajo que vayamos a hacer, por ejemplo, una petición de lectura de disco, **la CPU quedará un tanto ociosa mientras el disco responde y otro hilo podría adelantar trabajo**. Luego muy probablemente un número un tanto mayor podría llegar a obtener mejores resultados, todo depende del tipo de trabajo a realizar. Para ello lo mejor es **no tratar de optimizar desde el minuto 0**, sino una vez tenemos resuelto el problema, probar otros valores para ver con cuál se obtienen mejores resultados.

Bien una vez tenemos nuestro pool de hilos, podemos agregar trabajo a realizar.

```java
private void doWorkInBackground() {
    Runnable work = new Runnable() {
        @Override
        public void run() {
            try {
                for (int i = 0; i <= 100; i += 20) {
                    Thread.sleep(1000);
                    Log.i(TAG, "Done " + i + "% of work on thread " + Thread.currentThread().getId());
                }
            } catch (Throwable ex) {
                Log.e(TAG, "Error doing background work", ex);
            }
        }
    };
    mExecutorService.submit(work);
}
```

Como veis, no es más que crear un `Runnable` con el trabajo a realizar y llamar al método `submit()` de nuestro `ExecutorService` para que programe y ejecute el trabajo en un hilo en segundo plano.

El esquema anterior es muy simple, pero normalmente una aplicación es algo más compleja y lo primero que podemos agregar de complejidad es hacer un tratamiento al resultado de la ejecución de lo anterior. Por ejemplo, hacemos una librería que lee una imagen de disco de forma asíncrona con el anterior esquema, ¿dónde ponemos el código para hacer algo con esa imagen una vez se ha cargado? Lo primero que podemos pensar es llamar a esa tarea de procesar la imagen como última línea de código dentro del Runnable. Eso funciona, pero **estamos acoplando dos funcionalidades distintas y afectando a la reusabilidad de nuestro código**.

### Patrón Promise al rescate
La esencia del patrón Promise es precisamente esa, cuando lanzamos un trabajo asíncrono, se nos devuelve una promesa de que recibiremos en un momento futuro el resultado del mismo. Con esta promesa luego **podemos encolar trabajo para que este se ejecute cuando el anterior ha finalizado**.

Veamos cómo podemos aplicarlo a nuestro ejemplo. Lo primero será crear un `DeferredObject`, el cual controlará el estado de la promesa y sobre el que podemos actuar para **notificar progreso, errores o resultado del trabajo**. Los tres métodos esenciales son:

  * **notify()** para notificar progreso en la ejecución de la tarea.
  * **resolve()** para dar la tarea por finalizada y enviar el resultado.
  * **reject()** para notificar errores en la operación.

Por último, una vez hemos lanzado a ejecutar el trabajo, devolvemos la promesa.

```java
private Promise<String, Throwable, Integer> doWorkInBackground() {
    final DeferredObject<String, Throwable, Integer> deferredObject = new DeferredObject<String, Throwable, Integer>();

    Runnable work = new Runnable() {
        @Override
        public void run() {
            try {
                for (int i = 0; i <= 100; i += 20) {
                    Thread.sleep(1000);
                    Log.i(TAG, "Done " + i + "% of work on thread " + Thread.currentThread().getId());
                    deferredObject.notify(i);
                }

                deferredObject.resolve("Finish!");
            } catch (Throwable ex) {
                deferredObject.reject(ex);
            }
        }
    };
    mExecutorService.submit(work);

    return deferredObject.promise();
}
```

Y ya está, ahora si queremos usar este método y realizar acciones con cada posible caso solo nos queda ir agregando los _callbacks_ necesarios. Estos son:

  * **then()**. Qué hacer cuando el trabajo ha finalizado, puedes recibir hasta 3 parámetros, qué hacer después en caso de tener resultado, en caso de fallo y con cada progreso.
  * **progress()**. Qué hacer con cada notificación de progreso.
  * **done()**. Qué hacer solo cuando se finaliza correctamente.
  * **fail()**. Qué hacer cuando se produce un error.
  * **always()**. Qué hacer en cualquier caso, ya sea error o no.

Todas estas llamadas se pueden ir encolando como comentábamos anteriormente. En principio todas ellas se ejecutan en el mismo hilo desde el que se produce la notificación, en este caso que estamos mostrando, todo ello se ejecuta desde el hilo que ejecuta el Runnable. Para comprobarlo, vamos a añadir este código a nuestro ejemplo.

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    ...

    this.doWorkInBackground()
            .then(new DoneCallback<String>() {
                @Override
                public void onDone(String result) {
                    Log.i(TAG, "then() on thread " + Thread.currentThread().getId());
                }
            }).progress(new ProgressCallback<Integer>() {
                @Override
                public void onProgress(Integer progress) {
                    Log.i(TAG, "progress() on thread " + Thread.currentThread().getId());
                }
            }).done(new DoneCallback<String>() {
                @Override
                public void onDone(String result) {
                    Log.i(TAG, "done() on thread " + Thread.currentThread().getId());
                }
            }).fail(new FailCallback<Throwable>() {
                @Override
                public void onFail(Throwable result) {
                    Log.i(TAG, "fail() on thread " + Thread.currentThread().getId());
                }
            }).always(new AlwaysCallback<String, Throwable>() {
                @Override
                public void onAlways(Promise.State state, String resolved, Throwable rejected) {
                    Log.i(TAG, "always() on thread " + Thread.currentThread().getId());
                }
            });
}
```

Del resultado de la ejecución de este código, tendremos la siguiente salida por consola:

```
I/JDEFERRED_DEMO﹕ Done 0% of work on thread 351
I/JDEFERRED_DEMO﹕ progress() on thread 351
I/JDEFERRED_DEMO﹕ Done 20% of work on thread 351
I/JDEFERRED_DEMO﹕ progress() on thread 351
I/JDEFERRED_DEMO﹕ Done 40% of work on thread 351
I/JDEFERRED_DEMO﹕ progress() on thread 351
I/JDEFERRED_DEMO﹕ Done 60% of work on thread 351
I/JDEFERRED_DEMO﹕ progress() on thread 351
I/JDEFERRED_DEMO﹕ Done 80% of work on thread 351
I/JDEFERRED_DEMO﹕ progress() on thread 351
I/JDEFERRED_DEMO﹕ Done 100% of work on thread 351
I/JDEFERRED_DEMO﹕ progress() on thread 351
I/JDEFERRED_DEMO﹕ then() on thread 351
I/JDEFERRED_DEMO﹕ done() on thread 351
I/JDEFERRED_DEMO﹕ always() on thread 351
```

### De la promesa a la interfaz de usuario
Ya tenemos lo que queríamos, una forma de generar **APIs en nuestras aplicaciones que ejecutan trabajo de forma asíncrona** y que de manera muy fácil podemos encolar a otras tareas a realizar. Pero, ¿cómo podemos ahora interactuar con la UI? Como hemos visto, ahora mismo todo se está ejecutando en un hilo en segundo plano. ¿Cómo podemos cambiar el código anterior para hacer que alguna de esas llamadas sean en el hilo de la UI y así poder realizar cambios en la misma?

Lo primero que necesitamos es utilizar la clase `AndroidDeferredManager` para gestionar los hilos, en vez de utilizar directamente el `ExecutorService`. Vamos a crear uno en el método onCreate.

```java
...
    private AndroidDeferredManager mDeferredManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sample);

        mDeferredManager = new AndroidDeferredManager(Executors.newFixedThreadPool(NUMBER_OF_CPUS));

...
```

Luego necesitamos cambiar en el método `doWorkInBackground()`, para en vez de utilizar el `ExecutorService`, utilizar el `DeferredManager` que hemos creado anteriormente. Por último, el `Promise` que generamos, debemos también hacerlo pasar por el `DeferredManager`, para que sea gestionado por él.

```java
    private Promise<String, Throwable, Integer> doWorkInBackground() {
        ...

        mDeferredManager.when(work);

        return mDeferredManager.when(deferredObject);
    }
```

Con estos dos cambios, a priori si volvemos a ejecutar la aplicación veremos que ahora todos los callbacks se ejecutan en el hilo de la UI. Este es el comportamiento por defecto del `AndroidDeferredManager`, entiende que todo lo que se ejecuta a partir de la promesa será actualizar la interfaz gráfica. 
¿Y si queremos seguir en background? Pues lo que tendremos que cambiar es la interfaz que usamos para crear las clases anónimas y utilizar las que comienzan por **Android**. Veremos que ahora la interfaz nos obliga a implementar un segundo método `getExecutionScope()` con el qué podemos indicar en que hilo se debe ejecutar nuestro _callback_, pudiendo indicar si es UI o BACKGROUND. Vamos a probarlo, cambiamos el _callback_ de `always()` y hacemos que la clase anónima ahora se cree a partir de la interfaz `AndroidAlwaysCallback` e implementamos el método `getExecutionScope()` devolviendo **BACKGROUND**.

```java
...
}).always(new AndroidAlwaysCallback<String, Throwable>() {
	@Override
	public void onAlways(Promise.State state, String resolved, Throwable rejected) {
		Log.i(TAG, "always() on thread " + Thread.currentThread().getId());
	}

	@Override
	public AndroidExecutionScope getExecutionScope() {
		return AndroidExecutionScope.BACKGROUND;
	}
});
...
```

Y volvemos a ejecutar nuestro código.

```
...
I/JDEFERRED_DEMO﹕ Done 0% of work on thread 414
I/JDEFERRED_DEMO﹕ progress() on thread 1
I/JDEFERRED_DEMO﹕ Done 20% of work on thread 414
I/JDEFERRED_DEMO﹕ progress() on thread 1
I/JDEFERRED_DEMO﹕ Done 40% of work on thread 414
I/JDEFERRED_DEMO﹕ progress() on thread 1
I/JDEFERRED_DEMO﹕ Done 60% of work on thread 414
I/JDEFERRED_DEMO﹕ progress() on thread 1
I/JDEFERRED_DEMO﹕ Done 80% of work on thread 414
I/JDEFERRED_DEMO﹕ progress() on thread 1
I/JDEFERRED_DEMO﹕ Done 100% of work on thread 414
I/JDEFERRED_DEMO﹕ always() on thread 414
I/JDEFERRED_DEMO﹕ progress() on thread 1
I/JDEFERRED_DEMO﹕ then() on thread 1
I/JDEFERRED_DEMO﹕ done() on thread 1
...
```

El resultado es que ahora el _always_ se ha ejecutado en el hilo de background. El resto sigue en el hilo de la interfaz gráfica. Y con esto vemos que **se ha adelantado la ejecución en este caso y a pesar del orden con el que hemos ido encadenando los callback, su ejecución es en un orden distinto debido al hilo en el que debe ejecutarse**.

Como podéis imaginar podemos hacer muchos juegos con esta librería, pero lo dejamos para un siguiente artículo donde veremos cómo podemos hacer **transformaciones de datos a base de filtros y pipes** y cómo podemos además **ejecutar trabajo en paralelo y realizar una acción final cuando todos estos trabajos en paralelo han terminado** de manera muy fácil.

### Código más limpio y fácil de leer
La principal consecuencia de utilizar este patrón en nuestro código asíncrono es que nuestras APIs cumplen una máxima en el desarrollo de código limpio: **los métodos no tienen parámetros de salida, solo un valor de retorno**. En el caso asíncrono, es muy típico ver cómo hay que pasar un _callback_ a un método para que cuando este acabe, nos devuelva por ahí el resultado. Con esta forma de trabajo, el método devuelve la promesa, con la que podremos obtener el valor más adelante, dejando un código más fácil de leer ya que es casi lineal y no obliga al desarrollador a estar dando saltos entre el código para seguir el flujo.

### ¿Cómo la obtengo?
Pues desde su sitio web en _[http://jdeferred.org/](http://jdeferred.org/)_ o también a través de Gradle agregando:

``` groovy
compile 'org.jdeferred:jdeferred-android:1.2.3'
```

También os dejo en este repo el código de ejemplo.

{% github raycoarana/jdeferred-demo %}
