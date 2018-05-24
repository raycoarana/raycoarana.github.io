---
layout: post
slug: ssl-pinning-ataques-man-in-the-middle
title: SSL Pinning y ataques man-in-the-middle
date: 2014-03-05 18:09:43+00:00
tags:
    - android
    - Man in the middle
    - seguridad
    - SSL
    - SSL Pinning
subclass: 'post tag-content'
categories:
  - raycoarana
navigation: True
---

Un problema que cada vez más está de actualidad es la seguridad y la privacidad en las aplicaciones móviles. Existe además un problema mayor que en otros entornos dado que es más plausible el conectarse a redes externas como WiFi's públicas. Como desde nuestras apps no podemos controlar que redes utiliza el usuario, debemos securizar las conexiones con SSL. Pero..., ¿es esto suficiente? _Pues va a ser que no_.

<!--more-->

### ¿Qué es SSL Pinning?

Cuando se hace la negociación SSL y el servidor nos envía su certificado, por defecto Android (aunque ocurre igual en otras plataformas) comprueba que este pertenece a una autoridad certificadora de confianza y que este no está revocado o caducado. El problema es que cuando estamos en una red pública, es posible que un atacante se ponga "en medio" y se haga pasar por el servidor, haciendo de puente entre este y nosotros. Si esto lo hace con un certificado válido, nuestro sistema comprueba el certificado y lo dará por válido, pudiendo este atacante hacerse con todos los datos que intercambiamos con el servidor en **texto claro**.
SSL Pinning de denomina al proceso de verificar además que el certificado que ha enviado el servidor sea solo el de nuestro servidor y no cualquiera válido. Así, si detectamos un certificado válido pero que no es el de nuestro servidor, podemos rechazar la conexión, ya que existe alguien en medio _con el oído puesto_.

### ¿Cómo implementamos SSL Pinning en Android?

Para poder implementar SSL Pinning en Android necesitamos en primer lugar preparar el certificado del servidor con el que vamos a conectarnos e incorporarlo a un almacén de certificados de Java. Para ello haremos uso de la herramienta **keytool** que viene con el JDK. Para hacer esto, ejecutaremos el siguiente comando:

```bash
keytool -importcert
        -trustcacerts
        -file "MICERTIFICADO.cer"
        -alias MIALIAS
        -keystore "sslpinning.ks"
        -provider org.bouncycastle.jce.provider.BouncyCastleProvider
        -providerpath "bcprov-jdk16-145.jar"
        -storetype BKS
        -storepass AQUI_VA_TU_PASSWORD
```

Donde tendremos que especificar el nombre del certificado a importar al almacén de certificados y la contraseña con la que crearemos esta. Como podéis ver, es necesario para hacer esto un proveedor. Podemos utilizar el famoso BouncyCastle, para poder ejecutar este comando debemos tener el fichero [**bcprov-jdk16-145.jar**](http://www.bouncycastle.org/download/bcprov-jdk16-145.jar) en el lugar donde estamos ejecutándolo.

Una vez creado nuestro almacén de certificados con nombre **sslpinning.ks**, nos lo llevamos a nuestro proyecto. Lo copiaremos en la carpeta **res/raw**.

Ahora que tenemos todo listo, abrimos nuestro Eclipse/AndroidStudio y comenzamos a escribir código. Lo que vamos a necesitar será proporcionar al objeto HttpClient de Apache (que viene incluida en el SDK de Android) este almacén de certificados como únicos certificados válidos para realizar conexiones SSL. Para ello, vamos a sobrescribir la clase DefaultHttpClient. Crearemos un constructor que recibirá como parámetro el contexto para poder acceder al recurso donde tenemos el almacén de certificados.

```java
import android.content.Context;
import android.content.res.Resources;
import org.apache.http.impl.client.DefaultHttpClient;

public class SecureHttpClient extends DefaultHttpClient {

    Resources mResources;

    public SecureHttpClient(Context context) {
        mResources = context.getResources();
    }

}
```

Una vez tenemos la clase, vamos a añadirle un método que se encargará de construir una factoría de sockets SSL, al que le proporcionaremos el almacén de certificados que debe utilizar como certificados de confianza.

```java
import org.apache.http.conn.ssl.SSLSocketFactory;
import java.io.InputStream;
import java.security.KeyStore;

...

private SSLSocketFactory buildSSLSocketFactory() {
    try {
        KeyStore trusted = KeyStore.getInstance("BKS");
        InputStream in = mResources.openRawResource(R.raw.sslpinning);
        try {
            trusted.load(in, "AQUI_VA_TU_PASSWORD".toCharArray());
        } finally {
            in.close();
        }
        SSLSocketFactory sf = new SSLSocketFactory(trusted);
        sf.setHostnameVerifier(SSLSocketFactory.STRICT_HOSTNAME_VERIFIER);
        return sf;
    } catch (Exception e) {
        throw new AssertionError(e);
    }
}

...

```

Una vez tenemos el método anterior, vamos a sobrescribir el método _createClientConnectionManager()_. En él vamos a registrar nuestra factoría de sockets SSL cuando se solicita una conexión sobre https. De esta forma, cada vez que el cliente Http va a realizar una conexión, creará el Socket SSL basado en nuestra configuración.

```java
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;

...

@Override
protected ClientConnectionManager createClientConnectionManager() {
    SchemeRegistry registry = new SchemeRegistry();
    registry.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
    registry.register(new Scheme("https", this.buildSSLSocketFactory(), 443));
    return new ThreadSafeClientConnManager(getParams(), registry);
}

...

```

Y listo, con esto ya tenemos un cliente Http seguro que realiza una estricta comprobación de los certificados, confiando únicamente en aquellos que hemos incluido en nuestro almacén de certificados. Ya solo nos queda hacer las peticiones de la misma forma que lo hacemos normalmente.

### ¿Y qué pasa con las aplicaciones híbridas?

En el caso de las aplicaciones híbridas lo anterior no vale. Las conexiones con el servidor no las hacemos nosotros sino que las hace el WebView que muestra nuestra aplicación. Luego debemos meternos en la negociación SSL que realiza el WebView para rechazar aquellas conexiones que no se hacen con el certificado de nuestro servidor. Pero esto es algo que dejaremos para un próximo artículo.
