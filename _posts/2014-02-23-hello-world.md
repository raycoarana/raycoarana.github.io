---
layout: post
slug: hello-world
title: Esto empieza...
date: 2014-02-23 11:50:21+00:00
tags:
  - misc
subclass: 'post tag-content'
categories: 
  - raycoarana
navigation: True
---

```java
package com.raycoarana.blog;

public class Blog {

    public static void main(String[] args) {
        Blog blog = new Blog();
        blog.addTheme("feather");
        blog.prepare();
        blog.publish(new PublishListener(){
            public void onSuccess() {
                System.out.println("Let's start coding!");
            }
        });
    }
}
```