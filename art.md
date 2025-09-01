---
layout: default
title: "Art & Design Projects"
permalink: /art/
---

<div class="art-grid__wrap">
  <h1>Art & Design Projects</h1>
  <ul class="gallery-grid">
    {% assign art_projects = site.projects | where_exp: "item", "item.tags contains 'art' or item.tags contains 'design'" | sort: 'year' | reverse %}
    {% for p in art_projects %}
      {% assign cover_style = '' %}
      {% if p.gradient %}
        {% assign cover_style = 'background: ' | append: p.gradient %}
        {% if p.hero %}
          {% assign cover_style = cover_style | append: ', url(' | append: p.hero | append: ')'} %}
        {% endif %}
        {% assign cover_style = cover_style | append: ';' %}
      {% elsif p.hero %}
        {% assign cover_style = 'background: linear-gradient(135deg, #20265dff, #1c88f3ff), url(' | append: p.hero | append: ');' %}
      {% endif %}
      {% assign cover_style = cover_style | append: 'background-size: cover; background-position: center; background-repeat: no-repeat;' %}
      <li class="gallery-card" {% if p.github %}data-github="{{ p.github }}"{% endif %} {% if p.demo_url %}data-demo="{{ p.demo_url }}"{% endif %} data-page="{{ p.url | relative_url }}">
        <a href="{{ p.github | default: p.url | relative_url }}" class="gallery-link" target="_blank" rel="noopener">
          <div class="cover" style="{{ cover_style }}"></div>
          <div class="meta">
            <h2>{{ p.title }}</h2>
            <p class="summary">{{ p.summary | default: p.content | strip_html | strip_newlines | truncate: 160 }}</p>
            {% if p.tags %}<div class="tags">{% for t in p.tags %}<span class="tag">{{ t }}</span>{% endfor %}</div>{% endif %}
          </div>
        </a>
      </li>
    {% endfor %}
  </ul>
</div>
