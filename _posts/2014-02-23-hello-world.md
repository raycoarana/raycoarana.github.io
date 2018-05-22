---
author: raycoarana
comments: true
date: 2014-02-23 11:50:21+00:00
layout: post
link: http://raycoarana.com/misc/hello-world/
slug: hello-world
title: Esto empieza...
wordpress_id: 1
categories:
- Miscelánea
---

[code language="java"]
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
[/code]
